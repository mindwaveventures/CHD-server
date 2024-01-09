import { BlobServiceClient } from '@azure/storage-blob';
import { ManagedIdentityCredential } from '@azure/identity';
import TrustManager from '../managers/trust';
import { setLogLevel } from '@azure/logger';
import PredictionManager from '../managers/predictions';
import { containerNames, fileUploadStatus, queues, resourceDocumentContainer, usertypes } from '../constants';
import { CustomError, ErrorCodes, nodemailerManager } from '../helpers';
import { azureService } from '../middleware';
import { predictionCompleted } from '../templates/email-content';
import {
    GetPredictionByUserId,
    GetPredictionByTrustId
} from '../types/request';
import UserManager from '../managers/users';
import appConfig from '../app-config';

const {
    noStorageAccount,
    predictionExpired,
    unAuthorized
} = ErrorCodes;

setLogLevel('error');

const defaultAzureCredential = new ManagedIdentityCredential({
    loggingOptions: {
        allowLoggingAccountIdentifiers: true
    }
});

class PredictionService {
    trustManager: TrustManager;
    predictionManager: PredictionManager;
    userManager: UserManager;
    constructor() {
        this.trustManager = new TrustManager();
        this.userManager = new UserManager();
        this.predictionManager = new PredictionManager();
    }

    _emailPredictionType(type: string) {
        if (type === containerNames.historic) {
            return 'historic';
        }
        return 'future';
    }

   async _updateFailedPredictionStatus(id: string, email: string | undefined, name: string, type: string, interval: any){
        await this.predictionManager.updatePrediction(id, {
            status: fileUploadStatus.failed
        });
        nodemailerManager({
            to: email || '',
            subject: 'WNB Prediction status',
            html: predictionCompleted(name, 'failed', this._emailPredictionType(type))
        });
        clearInterval(interval);
    }

    _listenForPipelineResponse(id: string, name: string, email: string | undefined, type: string) {
        let interval: any = setInterval(async () => {
            try {
                const receivedData: any = await azureService.receiveMessageByQueue(queues.pipeline);
                if (receivedData && receivedData.receivedMessageItems.length > 0) {
                    for (let i = 0; i < receivedData.receivedMessageItems.length; i++) {
                        const data = receivedData.receivedMessageItems[i];
                        const receivedJson = Buffer.from(data.messageText, 'base64').toString('utf8');
                        const receivedJsonAsObject = JSON.parse(receivedJson);
                        const output = JSON.parse(receivedJsonAsObject.data.runProperties['azureml.parameters']);
                        if (output && output.input_filepath && output.input_filepath.includes(id)) {
                            const { runStatus, runId } = receivedJsonAsObject.data;
                            nodemailerManager({
                                to: email || '',
                                subject: 'WNB Prediction status',
                                html: predictionCompleted(name, runStatus, this._emailPredictionType(type))
                            });
                            await this.predictionManager.updatePrediction(id, {
                                status: runStatus,
                                outputPath: output.output_filepath || '',
                                runId
                            });
                            await azureService.deleteMessageOnQueue(queues.pipeline, data.messageId, data.popReceipt);
                            clearInterval(interval);
                            interval = null;
                            return;
                        }
                    }
                }
            } catch (err: any) {
                await this._updateFailedPredictionStatus(id, email, name, type, interval);
                interval = null;
            }
        }, 30 * 1000); // Every 30 seconds
        setTimeout(async () => {
            if (interval) {
                await this._updateFailedPredictionStatus(id, email, name, type, interval);
                interval = null;
            }
        }, 4 * 60 * 60 * 1000); // Run after 4 hours
    }

    async checkPendingRequest() {
        try {
            const pendingPrediction = await this.predictionManager.getPredictionByStatus(fileUploadStatus.pending);
            for (let i = 0; i < pendingPrediction.length; i++) {
                const user = await this.userManager.getUserById(pendingPrediction[i].getDataValue('userId'));
                const name = (user?.getDataValue('firstName') + ' ' + user?.getDataValue('lastName')).trim();
                this._listenForPipelineResponse(pendingPrediction[i].getDataValue('id'), name, user?.getDataValue('email'), pendingPrediction[i].getDataValue('type'));
            }
        } catch (err) {
            console.log(err);
        }
    }

    async uploadHistoricData(userId: string, trustId: string, file: any, data: any) {
        let trainingData = null;
        try {
            const trust = await this.trustManager.getTrustById(trustId);
            if (!trust?.getDataValue('storageAccountName')) {
                throw new CustomError(noStorageAccount.message, noStorageAccount.errorCode, noStorageAccount.statusCode);
            }
            const user = await this.userManager.getUserById(userId);
            const blobServiceClient = new BlobServiceClient(
                `https://${trust.getDataValue('storageAccountName')}.blob.core.windows.net`,
                defaultAzureCredential
            );
            const containerClient = blobServiceClient.getContainerClient(containerNames.historic);
            const trainingFile = await this.predictionManager.createPrediction({
                userId,
                status: fileUploadStatus.pending,
                name: data.fileName,
                type: containerNames.historic
            });
            trainingData = trainingFile;
            const name = (user?.getDataValue('firstName') + ' ' + user?.getDataValue('lastName')).trim();
            this._listenForPipelineResponse(trainingFile.getDataValue('id'), name, user?.getDataValue('email'), containerNames.historic);
            const blobName = trainingFile.getDataValue('id').concat('.csv');
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.upload(file.buffer, file.size);
            return trainingFile.getDataValue('id');
        } catch (err) {
            if (trainingData)
                await this.predictionManager.deletePrediction(trainingData.getDataValue('id'));
            throw err;
        }
    };

    async uploadFutureData(userId: string, trustId: string, file: any, data: any) {
        let inferenceData = null;
        try {
            const trust = await this.trustManager.getTrustById(trustId);
            if (!trust?.getDataValue('storageAccountName')) {
                throw new CustomError(noStorageAccount.message, noStorageAccount.errorCode, noStorageAccount.statusCode);
            }
            const user = await this.userManager.getUserById(userId);
            const blobServiceClient = new BlobServiceClient(
                `https://${trust?.getDataValue('storageAccountName')}.blob.core.windows.net`,
                defaultAzureCredential
            );
            const containerClient = blobServiceClient.getContainerClient(containerNames.future);
            const trainingFile = await this.predictionManager.createPrediction({
                userId,
                status: fileUploadStatus.pending,
                name: data.fileName,
                type: containerNames.future
            });
            inferenceData = trainingFile;
            const name = (user?.getDataValue('firstName') + ' ' + user?.getDataValue('lastName')).trim();
            this._listenForPipelineResponse(trainingFile.getDataValue('id'), name, user?.getDataValue('email'), containerNames.future);
            const blobName = trainingFile.getDataValue('id').concat('.csv');
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.upload(file.buffer, file.size);
            return trainingFile.getDataValue('id');
        } catch (err) {
            if (inferenceData)
                await this.predictionManager.deletePrediction(inferenceData.getDataValue('id'));
            throw err;
        }
    };

    async getPredictionById(id: string) {
        try {
            const result = await this.predictionManager.getPredictionById(id);
            return {
                id: result?.getDataValue('id'),
                status: result?.getDataValue('status'),
                type: result?.getDataValue('type')
            };
        } catch (err) {
            throw err;
        }
    }

    async getPredictionList(userId: string, data: GetPredictionByUserId) {
        try {
            const result = await this.predictionManager.getPredictionByUserId(userId, data);
            const values = result.rows.map((item: any) => ({
                id: item.id,
                name: item.name.replace('.csv', ''),
                date: new Date(new Date(item.updatedAt).setDate(new Date(item.updatedAt).getDate() + 1)),
                currentDate: new Date()
            }));
            return {
                count: result.count,
                rows: values
            };
        } catch (err) {
            throw err;
        }
    }

    async getPredictionListByOrganisation(data: GetPredictionByTrustId) {
        try {
            const result = await this.predictionManager.getPredictonByOrganisationId(data);
            const values = result.rows.map((item: any) => ({
                id: item.id,
                name: item.name.replace('.csv', ''),
                date: new Date(new Date(item.updatedAt).setDate(new Date(item.updatedAt).getDate() + 1)),
                currentDate: new Date(),
                userName: item.user.firstName + ' ' + item.user.lastName
            }));
            return {
                count: result.count,
                rows: values
            };
        } catch (err) {
            throw err;
        }
    }

    async downloadPrediction(id: string) {
        try {
            const prediction = await this.predictionManager.getPredictionById(id);
            const date = new Date(prediction?.getDataValue('updatedAt') || '');
            const addedDate = date.setDate(date.getDate() + 1);
            if (addedDate < new Date().getTime()) {
                throw new CustomError(predictionExpired.message, predictionExpired.errorCode, predictionExpired.statusCode);
            }
            const fileStream = await azureService.downloadBlob(prediction?.getDataValue('user').trust?.storageAccountName || '', prediction?.getDataValue('outputPath') || '');
            return {
                data: fileStream,
                fileName: 'prediction.zip'
            };
        } catch (err) {
            throw err;
        }
    }

    async checkPredictionStatus(trustId: string, userId: string) {
        try {
            // const lastPrediction = await this.predictionManager.getLastPrediction(trustId);
            const lastUserPrediction = await this.predictionManager.getLastPredictionByUserId(userId);
            const date = new Date(lastUserPrediction?.getDataValue('updatedAt') || '');
            const addedDate = date.setHours(date.getHours() + 24);
            return {
                historic: lastUserPrediction?.getDataValue('type') === containerNames.historic,
                future: lastUserPrediction?.getDataValue('type') === containerNames.future,
                status: lastUserPrediction?.getDataValue('status'),
                expired: (lastUserPrediction?.getDataValue('type') === containerNames.future && addedDate < new Date().getTime()),
                id: (lastUserPrediction?.getDataValue('type') === containerNames.future && lastUserPrediction?.getDataValue('status') === fileUploadStatus.completed) ? lastUserPrediction.getDataValue('id') : '',
                predictionId: lastUserPrediction?.getDataValue('id'),
                predictionStatus: lastUserPrediction?.getDataValue('type')
            }
        } catch (err) {
            throw err;
        }
    }

    async getResourceList(usertype: string) {
        try{
            const resourceList = [];
            const blobServiceClient = new BlobServiceClient(
                `https://${appConfig.azureCommonQueue}.blob.core.windows.net`,
                defaultAzureCredential
            );
            const commonContainerClient = blobServiceClient.getContainerClient(resourceDocumentContainer.commonContainer);
            const commonBlobList =  commonContainerClient.listBlobsFlat();
            for await (const item of commonBlobList) {
                resourceList.push(item.name);
            }
            let containerName = '';
            if(usertype === usertypes.admin){
                containerName = resourceDocumentContainer.adminContainer;
            }else if(usertype === usertypes.clinician){
                containerName = resourceDocumentContainer.userContainer;
            }else if(usertype === usertypes.superAdmin){
                containerName = resourceDocumentContainer.superAdminContainer
            }
            const usertypeContainerClient = blobServiceClient.getContainerClient(containerName);
            const usertypeBlobList =  usertypeContainerClient.listBlobsFlat();
            for await (const item of usertypeBlobList) {
                resourceList.push(item.name);
            }
            return resourceList;
        }catch(err){
            throw err;
        }
    }

    async downloadResource(usertype: string, fileName: string){
        try{
            // Connect with the blob service using connection string
            const blobServiceClient = new BlobServiceClient(
                `https://${appConfig.azureCommonQueue}.blob.core.windows.net`,
                defaultAzureCredential
            );
            // Connect with the respective container
            const commonContainerClient = blobServiceClient.getContainerClient(resourceDocumentContainer.commonContainer);
            // Establish connection with the file and get things ready for donwload
            const commonBlockBlobClient = commonContainerClient.getBlockBlobClient(fileName);
            const blobExist = await commonBlockBlobClient.exists();
            if(blobExist){
                // Download file from blob storage
                const downloadBlockBlobResponse = await commonBlockBlobClient.download();
                return {
                    data: downloadBlockBlobResponse.readableStreamBody,
                    fileName
                };
            }
            let containerName = '';
            if(usertype === usertypes.admin){
                containerName = resourceDocumentContainer.adminContainer;
            }else if(usertype === usertypes.clinician){
                containerName = resourceDocumentContainer.userContainer;
            }else if(usertype === usertypes.superAdmin){
                containerName = resourceDocumentContainer.superAdminContainer
            }
            // Connect with the respective container
            const userContainerClient = blobServiceClient.getContainerClient(containerName);
            // Establish connection with the file and get things ready for donwload
            const userBlockBlobClient = userContainerClient.getBlockBlobClient(fileName);
            const userBlobExist = await userBlockBlobClient.exists();
            if(!userBlobExist){
                throw new CustomError(unAuthorized.message, unAuthorized.errorCode, unAuthorized.statusCode);
            }
            // Download file from blob storage
            const downloadBlockBlobResponse = await userBlockBlobClient.download();
            return {
                data: downloadBlockBlobResponse.readableStreamBody,
                fileName
            };
        }catch(err){
            throw err;
        }
    }
}

export default PredictionService;

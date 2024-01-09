import { QueueServiceClient } from '@azure/storage-queue';
import { BlobServiceClient } from '@azure/storage-blob';
import { setLogLevel } from '@azure/logger';
import { ManagedIdentityCredential } from '@azure/identity';
import { queues, containerNames } from '../constants';
import appConfig from '../app-config';

setLogLevel('error');

const defaultAzureCredential = new ManagedIdentityCredential({
    loggingOptions: {
        allowLoggingAccountIdentifiers: true
    }
});

const sendMessageToQueue = async (message: any, queueName = queues.request) => {
    try {
        // Instantiate a QueueServiceClient which will be used
        // to create a QueueClient and to list all the queues
        const queueServiceClient = new QueueServiceClient(
            `https://${appConfig.azureCommonQueue}.queue.core.windows.net`,
            defaultAzureCredential
        );
        // Get a QueueClient which will be used
        // to create and manipulate a queue
        const queueClient = queueServiceClient.getQueueClient(queueName);
        return await queueClient.sendMessage(Buffer.from(JSON.stringify(message, null, 2), 'utf8').toString('base64'));
    } catch (err) {
        throw err;
    }
};

const receiveMessageByQueue = async (queueName = queues.result) => {
    try {
        // Instantiate a QueueServiceClient which will be used
        // to create a QueueClient and to list all the queues
        const queueServiceClient = new QueueServiceClient(
            `https://${appConfig.azureCommonQueue}.queue.core.windows.net`,
            defaultAzureCredential
        );
        // Get a QueueClient which will be used
        // to create and manipulate a queue
        const queueClient = queueServiceClient.getQueueClient(queueName);
        // const properties = await queueClient.getProperties();
        // { numberOfMessages: properties.approximateMessagesCount }
        return await queueClient.receiveMessages();
    } catch (err) {
        throw err;
    }
};

const peekMessageonQueue = async (queueName = queues.result) => {
    try {
        // Instantiate a QueueServiceClient which will be used
        // to create a QueueClient and to list all the queues
        const queueServiceClient = new QueueServiceClient(
            `https://${appConfig.azureCommonQueue}.queue.core.windows.net`,
            defaultAzureCredential
        );
        // Get a QueueClient which will be used
        // to create and manipulate a queue
        const queueClient = queueServiceClient.getQueueClient(queueName);
        return await queueClient.peekMessages();
    } catch (err) {
        throw err;
    }
}

const deleteMessageOnQueue = async (queueName = queues.result, messageId: string, popReceipt: string) => {
    try {
        const queueServiceClient = new QueueServiceClient(
            `https://${appConfig.azureCommonQueue}.queue.core.windows.net`,
            defaultAzureCredential
        );
        const queueClient = queueServiceClient.getQueueClient(queueName);
        return await queueClient.deleteMessage(messageId, popReceipt);
    } catch (err) {
        throw err;
    }
}

// const getStorageAccountDetails = async (storageAccountName: string) => {
//     try {
//         const client = new StorageManagementClient(defaultAzureCredential, appConfig.azureSubscriptionId);
//         const storageaccount = await client.storageAccounts.listKeys(
//             appConfig.resourceGroup,
//             storageAccountName
//         );
//         if (storageaccount && storageaccount.keys && storageaccount.keys.length > 0) {
//             return `DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageaccount?.keys[0]?.value};EndpointSuffix=core.windows.net`;
//         }
//         return '';
//     } catch (err) {
//         throw err;
//     }
// };

// Convert stream to text
async function streamToText(readable: any) {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
        data += chunk;
    }
    return data;
}

const downloadBlob = async (accountName: string, fileName: string) => {
    try {
        // Connect with the blob service using connection string
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            defaultAzureCredential
        );
        // Connect with the respective container
        const containerClient = blobServiceClient.getContainerClient(containerNames.result);
        // Establish connection with the file and get things ready for donwload
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        // Download file from blob storage
        const downloadBlockBlobResponse = await blockBlobClient.download();
        return downloadBlockBlobResponse.readableStreamBody;
    } catch (err) {
        throw err;
    }
};

export default {
    sendMessageToQueue,
    receiveMessageByQueue,
    peekMessageonQueue,
    deleteMessageOnQueue,
    // getStorageAccountDetails,
    downloadBlob
};

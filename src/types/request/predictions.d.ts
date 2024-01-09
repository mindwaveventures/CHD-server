import { Pagination } from './common';

interface CreateTrainingFile {
    name: string;
    status: string;
    userId: string;
}

interface UpdateTrainingFile {
    name?: string;
    status?: string;
    userId?: string;
}

interface CreatePrediction {
    status: string;
    name: string;
    userId: string;
    type: string;
    outputPath?: string;
}

interface UpdatePrediction {
    status?: string;
    outputPath?: string;
    runId?: string;
}

interface GetPredictionByUserId extends Pagination {

}

interface GetPredictionByTrustId extends Pagination {
    trustId: string;
    userId: string;
}

export {
    CreateTrainingFile,
    UpdateTrainingFile,
    CreatePrediction,
    UpdatePrediction,
    GetPredictionByUserId,
    GetPredictionByTrustId
};

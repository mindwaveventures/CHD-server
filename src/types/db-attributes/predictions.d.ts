import { Optional } from 'sequelize';
import { UserAttributes } from './users';

interface PredictionAttributes {
    id: string;
    name: string;
    userId: string;
    status: string;
    outputPath: string;
    createdAt: string;
    updatedAt: string;
    type: string;
    runId: string;
    user: UserAttributes
}

type PredictionOptionalAttributes = 'id'
    | 'outputPath'
    | 'createdAt'
    | 'runId'
    | 'user'
    | 'updatedAt';

type PredictionCreationAttributes = Optional<PredictionAttributes, PredictionOptionalAttributes>;

export {
    PredictionAttributes,
    PredictionCreationAttributes
};

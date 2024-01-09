import { Optional } from 'sequelize';

import { UserAttributes } from './users';

interface TrainingFilesAttributes {
    id: string;
    status: string;
    userId: string;
    name: string;
    user: UserAttributes;
    createdAt: Date;
    updatedAt: Date;
};

type TrainingFilesOptionalAttributes = 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'user';

type TrainingFilesCreationAttributes = Optional<TrainingFilesAttributes, TrainingFilesOptionalAttributes>;

export {
    TrainingFilesAttributes,
    TrainingFilesCreationAttributes
};

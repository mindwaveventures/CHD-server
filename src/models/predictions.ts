import { DataTypes, ModelDefined } from 'sequelize';

import Users from './user';

// Model types
import sequelize from '../db';
import DBAttributes from '../types/db-attributes';

const Predictions: ModelDefined<
  DBAttributes.PredictionAttributes,
  DBAttributes.PredictionCreationAttributes
> = sequelize.define('predictions', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  runId: {
    type: DataTypes.STRING,
    defaultValue: '',
    field: 'run_id'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  outputPath: {
    type: DataTypes.STRING,
    defaultValue: '',
    field: 'output_path'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  tableName: 'predictions',
  timestamps: true
});

Predictions.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user'
});

export default Predictions;

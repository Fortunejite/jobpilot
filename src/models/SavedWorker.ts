import { model, Model, models, Document, Schema } from "mongoose";

export interface ISavedWorker {
  companyId: Schema.Types.ObjectId;
  workerId: Schema.Types.ObjectId;
}

export interface ISavedWorkerDocument extends ISavedWorker, Document {}

const savedWorkerSchema: Schema<ISavedWorkerDocument> = new Schema({
  workerId: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
}, {timestamps: true})

const savedWorker: Model<ISavedWorkerDocument> =
  models.SavedWorker || model<ISavedWorkerDocument>('SavedWorker', savedWorkerSchema);
export default savedWorker;
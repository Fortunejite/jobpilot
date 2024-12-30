import { model, Model, models, Document, Schema } from "mongoose";

export interface ISavedJob {
  jobId: Schema.Types.ObjectId | string;
  workerId: Schema.Types.ObjectId;
}

export interface ISavedJobDocument extends ISavedJob, Document {}

const savedJobSchema: Schema<ISavedJobDocument> = new Schema({
  workerId: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
}, {timestamps: true})

const savedJob: Model<ISavedJobDocument> =
  models.SavedJob || model<ISavedJobDocument>('SavedJob', savedJobSchema);
export default savedJob;
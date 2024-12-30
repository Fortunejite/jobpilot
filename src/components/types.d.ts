import { IWorkerDocument } from '@/models/Worker';
import { IUserDocument } from '@/models/User';
import { ISavedJobDocument } from '@/models/SavedJob';
import { IJobDocument } from '@/models/Job';

export type WorkerWithUserInfo = IWorkerDocument & {
  userId: IUserDocument;
};

export type SavedJobWithJobInfo = ISavedJobDocument & {
  jobId: IJobDocument;
};

export type JobWithCompanyInfo = IJobDocument & { companyId: ICompanyDocument };

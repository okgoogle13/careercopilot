import { JobData } from '../types';

interface JobInfoProps {
    jobData: JobData;
}

const JobInfo = ({ jobData }: JobInfoProps) => {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary-600 mb-4">Detected Job Posting</h2>
            <div className="space-y-2 text-sm">
                <div className="flex">
                    <span className="font-semibold text-gray-700 w-24">Title:</span>
                    <span className="text-gray-900">{jobData.title || 'N/A'}</span>
                </div>
                <div className="flex">
                    <span className="font-semibold text-gray-700 w-24">Company:</span>
                    <span className="text-gray-900">{jobData.company || 'N/A'}</span>
                </div>
                <div className="flex">
                    <span className="font-semibold text-gray-700 w-24">Location:</span>
                    <span className="text-gray-900">{jobData.location || 'N/A'}</span>
                </div>
                <div className="flex">
                    <span className="font-semibold text-gray-700 w-24">Source:</span>
                    <span className="text-gray-600 text-xs">{jobData.source || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default JobInfo;

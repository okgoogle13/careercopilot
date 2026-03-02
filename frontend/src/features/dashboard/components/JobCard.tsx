import React from 'react';
import { motion } from 'framer-motion';

interface JobCardProps {
    id: string;
    jobTitle: string;
    company: string;
    matchScore: number;
    status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
    deadline?: Date;
    onApply?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
    id,
    jobTitle,
    company,
    matchScore,
    status,
    deadline,
    onApply,
}) => {
    const getStatusColor = () => {
        switch (status) {
            case 'offer':
                return 'bg-sage text-surface';
            case 'interview':
<<<<<<< HEAD
                return 'bg-wattle text-surface';
=======
                return 'bg-ink text-surface';
>>>>>>> restoration-KR-Rage-Figma-v2.0
            case 'rejected':
                return 'bg-terracotta text-white';
            default:
                return 'bg-surface-container text-white/60';
        }
    };

    const getMatchBadgeColor = () => {
        if (matchScore >= 80) return 'bg-sage text-surface';
<<<<<<< HEAD
        if (matchScore >= 60) return 'bg-wattle text-surface';
=======
        if (matchScore >= 60) return 'bg-ink text-surface';
>>>>>>> restoration-KR-Rage-Figma-v2.0
        return 'bg-terracotta text-white';
    };

    return (
        <motion.div
            className="group relative overflow-hidden rounded-tech bg-surface-container p-6 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.01,
                y: -4,
            }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 27,
            }}
            data-testid={`kanban-card-${id}`}
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
            }}
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-trunk mb-1 text-xl font-black uppercase tracking-tight text-white">
                        {jobTitle}
                    </h3>
                    <p className="font-leaf text-sm text-white/60">{company}</p>
                </div>

                {/* Match Score Badge */}
                <div
                    className={`rounded-gem px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide ${getMatchBadgeColor()}`}
                >
                    {matchScore}%
                </div>
            </div>

            {/* Status Pill */}
            <div className="mb-4 flex items-center gap-2">
                <span
                    className={`inline-block rounded-full px-3 py-1 font-leaf text-xs font-medium capitalize ${getStatusColor()}`}
                >
                    {status}
                </span>
                {deadline && (
                    <span className="font-mono text-xs uppercase tracking-wide text-white/40">
                        Due: {deadline.toLocaleDateString()}
                    </span>
                )}
            </div>

            {/* Action Button */}
            {onApply && status === 'applied' && (
                <motion.button
                    onClick={onApply}
                    className="w-full rounded-pebble bg-terracotta py-3 font-leaf text-sm font-medium text-white transition-all hover:brightness-110"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    View Application
                </motion.button>
            )}

            {/* Hover Glow Effect */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-sage/5 to-transparent" />
            </div>
        </motion.div>
    );
};

export default JobCard;

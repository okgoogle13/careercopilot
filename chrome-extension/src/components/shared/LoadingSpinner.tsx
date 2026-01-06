import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'pulse' | 'wave' | 'dots' | 'spinner';
    color?: string;
    message?: string;
    className?: string;
}

export const LoadingSpinner = ({
    size = 'md',
    variant = 'spinner',
    color = '#667eea',
    message,
    className = '',
}: LoadingSpinnerProps) => {
    const sizeMap = {
        sm: { spinner: 16, dot: 8, text: 'text-xs' },
        md: { spinner: 24, dot: 12, text: 'text-sm' },
        lg: { spinner: 40, dot: 16, text: 'text-base' },
    };

    const config = sizeMap[size];

    const renderSpinner = () => {
        switch (variant) {
            case 'pulse':
                return (
                    <motion.div
                        className="rounded-full"
                        style={{
                            width: config.spinner,
                            height: config.spinner,
                            backgroundColor: color,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                );

            case 'wave':
                return (
                    <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="rounded-full"
                                style={{
                                    width: config.dot,
                                    height: config.dot,
                                    backgroundColor: color,
                                }}
                                animate={{
                                    y: [0, -config.dot * 1.5, 0],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>
                );

            case 'dots':
                return (
                    <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="rounded-full"
                                style={{
                                    width: config.dot,
                                    height: config.dot,
                                    backgroundColor: color,
                                }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>
                );

            case 'spinner':
            default:
                return (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <Loader2 size={config.spinner} style={{ color }} />
                    </motion.div>
                );
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            {renderSpinner()}
            {message && (
                <motion.p
                    className={`${config.text} text-gray-600 font-medium text-center`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
};

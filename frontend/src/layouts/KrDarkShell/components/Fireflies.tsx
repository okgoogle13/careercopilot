import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Firefly {
    id: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
    size: number;
    hasTrail?: boolean;
}

interface FirefliesProps {
    count?: number;
    className?: string;
}

export function Fireflies({ count = 16, className = "fixed inset-0 pointer-events-none overflow-hidden z-10" }: FirefliesProps) {
    const [fireflies, setFireflies] = useState<Firefly[]>([]);

    useEffect(() => {
        const newFireflies = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100, // Use full height of container
            delay: Math.random() * 8,
            duration: 7 + Math.random() * 5,
            size: [8, 12, 16][Math.floor(Math.random() * 3)],
            hasTrail: i === 0,
        }));
        setFireflies(newFireflies);
    }, [count]);

    return (
        <div className={className}>
            {fireflies.map((firefly) => (
                <div key={firefly.id} className="absolute" style={{ left: `${firefly.x}%`, top: `${firefly.y}%` }}>
                    {firefly.hasTrail && (
                        <motion.div
                            className="absolute rounded-full opacity-30"
                            style={{
                                width: firefly.size * 2,
                                height: 4,
                                background: 'linear-gradient(90deg, transparent, #D4A84B)',
                                filter: 'blur(4px)',
                                transformOrigin: 'left center',
                            }}
                            animate={{
                                opacity: [0, 0.4, 0],
                                width: [0, 100, 0],
                                rotate: [0, 15, -15, 0],
                            }}
                            transition={{
                                duration: firefly.duration,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    )}
                    <motion.div
                        className="absolute rounded-full"
                        style={{
                            width: firefly.size,
                            height: firefly.size,
                            background: 'radial-gradient(circle, #D4A84B 0%, rgba(212, 168, 75, 0.8) 30%, rgba(212, 168, 75, 0.4) 60%, transparent 100%)',
                            filter: 'blur(2px)',
                            boxShadow: '0 0 8px rgba(212, 168, 75, 0.6)',
                        }}
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [1, 1.4, 1],
                            x: [0, Math.random() * 60 - 30, 0],
                            y: [0, Math.random() * 60 - 30, 0],
                        }}
                        transition={{
                            duration: firefly.duration,
                            delay: firefly.delay,
                            repeat: Infinity,
                            ease: [0.45, 0.05, 0.55, 0.95], // cubic-bezier equivalence
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

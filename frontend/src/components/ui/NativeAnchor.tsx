import { motion } from 'framer-motion';

<<<<<<< HEAD
type NativeVariant = 'waratah' | 'bottlebrush' | 'banksia' | 'kangaroo' | 'gum' | 'fern';
=======
type NativeVariant = 'solidarity' | 'bottlebrush' | 'KrFlower' | 'kangaroo' | 'gum' | 'fern';
>>>>>>> restoration-KR-Rage-Figma-v2.0
type AnchorPoint = 'hanging-left' | 'hanging-right' | 'floor-left' | 'floor-right' | 'center-stage' | 'ceiling-left' | 'ceiling-right';

interface NativeAnchorProps {
    variant: NativeVariant;
    anchor: AnchorPoint;
    className?: string;
    blurIntensity?: 'none' | 'low' | 'high';
}

/**
 * Asset paths for Australian Native Plants
 */
const assets: Record<NativeVariant, string> = {
<<<<<<< HEAD
    waratah: '/assets/plants/native-waratah-hanging.png',
    bottlebrush: '/assets/plants/native-bottlebrush.png',
    banksia: '/assets/plants/native-banksia.png',
    kangaroo: '/assets/plants/native-kangaroo.png',
    gum: '/assets/plants/native-gum-hanging.png',
    fern: '/assets/specimens/leaf-fern.png',
=======
    solidarity: '/assets/plants/native-solidarity-hanging.png',
    bottlebrush: '/assets/plants/native-bottlebrush.png',
    KrFlower: '/assets/plants/native-KrFlower.png',
    kangaroo: '/assets/plants/native-kangaroo.png',
    gum: '/assets/plants/native-gum-hanging.png',
    fern: '/assets/kr-solidarity/specimen/kr-solidarity__specimen__triage-natural-history__v1.png',
>>>>>>> restoration-KR-Rage-Figma-v2.0
};

/**
 * NativeAnchor - Australian Native Plant Decorative Component
 * 
 * Renders plant illustrations with physics-based animations:
<<<<<<< HEAD
 * - Hanging plants (waratah, gum): Gentle sway + bob
=======
 * - Hanging plants (solidarity, gum): Gentle sway + bob
>>>>>>> restoration-KR-Rage-Figma-v2.0
 * - Standing plants (others): Breathing animation
 * 
 * Features:
 * - Absolute positioning via anchor prop
 * - Configurable blur for depth
 * - Framer Motion physics
 * 
 * @component
 * @example
 * <NativeAnchor 
 *   variant="gum" 
 *   anchor="hanging-right" 
 *   blurIntensity="none" 
 *   className="z-20" 
 * />
 */
export const NativeAnchor = ({
    variant,
    anchor,
    blurIntensity = 'none',
    className = ''
}: NativeAnchorProps) => {
    // 1. Determine if plant is hanging or standing
<<<<<<< HEAD
    const isHanging = variant === 'waratah' || variant === 'gum';
=======
    const isHanging = variant === 'solidarity' || variant === 'gum';
>>>>>>> restoration-KR-Rage-Figma-v2.0

    // 2. Define physics-based animations
    const animations = {
        hanging: {
            rotate: [0, 1, 0, -1, 0], // Gentle sway like wind
            y: [0, 2, 0], // Slight bob
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1] as const // easeInOut
            }
        },
        standing: {
            y: [0, -5, 0], // Breathing growth
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1] as const // easeInOut
            }
        }
    };

    // 3. Position mapping
    const getPosition = (): React.CSSProperties => {
        switch (anchor) {
            case 'ceiling-left':
                return { top: '-12%', left: '10%' };
            case 'ceiling-right':
                return { top: '-12%', right: '10%' };
            case 'hanging-left':
                return { top: '-10%', left: '5%' };
            case 'hanging-right':
                return { top: '-15%', right: '-5%' };
            case 'floor-left':
                return { bottom: '-5%', left: '-5%' };
            case 'floor-right':
                return { bottom: '-5%', right: '-5%' };
            case 'center-stage':
                return { bottom: '0%', left: '50%', transform: 'translateX(-50%)' };
            default:
                return {};
        }
    };

    // 4. Blur intensity mapping
    const getBlur = (): string => {
        switch (blurIntensity) {
            case 'high':
                return 'blur(12px) brightness(0.8)';
            case 'low':
                return 'blur(4px) brightness(0.9)';
            default:
                return 'none';
        }
    };

    return (
        <motion.div
            className={`absolute pointer-events-none z-0 ${className}`}
            style={{
                ...getPosition(),
                filter: getBlur()
            }}
            animate={isHanging ? animations.hanging : animations.standing}
        >
            <img
                src={assets[variant]}
                alt={`Australian Native ${variant} plant`}
                className={`
          ${isHanging ? 'w-[280px] md:w-[350px]' : 'w-[200px] md:w-[250px]'} 
          drop-shadow-2xl
        `}
            />
        </motion.div>
    );
};

<<<<<<< HEAD
export default NativeAnchor;
=======
export default NativeAnchor;
>>>>>>> restoration-KR-Rage-Figma-v2.0

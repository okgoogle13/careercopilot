export const twMerge = (...args: string[]) => args.filter(Boolean).join(' ');
export const extendTailwindMerge = () => twMerge;
export default twMerge;

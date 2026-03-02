export const rateLimits: Record<string, { max: number; duration: number }> = {
    email: { max: 5, duration: 60000 },  // 5/min
    report: { max: 2, duration: 60000 },  // 2/min
};
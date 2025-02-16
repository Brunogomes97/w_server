export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || (24 * 60 * 60 * 1000) //1 dia,
};

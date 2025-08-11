import wrapper from '../utils/Wrapper.js';
import admin from '../config/firebase-config.js';
import ApiError from '../utils/ApiError.js';

const verifyJWT = wrapper(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        throw new ApiError(401, 'Unauthorized');
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const userRecord = await admin.auth().getUser(decoded.uid); 
        // console.log('userRecord: ',userRecord)
        
        if (!decoded) {
            throw new ApiError(401, 'Access Token expired or invalid');
        }

        req.user = {
            ...decoded,
            email: userRecord.email,
            token: token 
        };

        next();
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export { verifyJWT };

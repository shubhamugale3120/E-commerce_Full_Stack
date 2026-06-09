import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if(!token){
            return res.json({success:false,message:"Not authorized, no token"});
        }  
        const token_decode = jwt.verify(token.trim(),process.env.JWT_SECRET);
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Not authorized, invalid token"});
        } 
        next();
    }catch (error) {
        console.error(error);
        res.json({success:false, message: error.message});
    }
}

export default adminAuth;
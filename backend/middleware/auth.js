import jwt from 'jsonwebtoken';


const userAuth = async (req,res,next) =>{

    try{
        const {token} = req.headers;

        if(!token){
            return res.json({success: false,message:"Not authorized, no token"});
        }

        const token_decode = jwt.verify(token.trim(),process.env.JWT_SECRET);
        if(!token_decode){
            return res.json({success: false,message:"Not authorized, invalid token"});
        }
        req.body.userId = token_decode.id;
        next();
    }catch(error){
        console.log(error);
        res.json({success: false, message:error.message});
    }
}


export default userAuth;
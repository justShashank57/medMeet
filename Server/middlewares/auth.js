import jwt from "jsonwebtoken";
export const requireAuth = async(req,res,next)=>{
       const token = req.headers.authorization;
       const finalToken = token.split(' ')[1];
       if(finalToken){
           try{
               const decodedToken = await jwt.verify(finalToken,process.env.JWT_SECRET || "your_jwt_secret_key_here_change_this_in_production");
               if(decodedToken){
                   req.user = decodedToken;
                   console.log("Decoded Token: ",decodedToken);
                   return next();
               }
           }
           catch(err){
            console.error("Error in JWT verification:", err);
            return res.status(400).json({message: "Authentication failed"});
           }
       }
       else{
        return res.status(400).json({message:"Session Expired."});
       }
}
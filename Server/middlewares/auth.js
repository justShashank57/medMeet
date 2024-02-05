import jwt from "jsonwebtoken";
export const requireAuth = async(req,res,next)=>{
       const token = req.cookies.jwt;
       if(token){
           try{
               const decodedToken = await jwt.verify(token,process.env.JWT_SECRET);
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
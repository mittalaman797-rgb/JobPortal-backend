import jwt from "jsonwebtoken"

 const isAuthenticated=(req,res,next)=>{
    try{
        const token=req.cookies.token
        if(!token){
             return res.status(401).json({
                message:"User not Authenticated",
                success:false

            })
        }
        const decode=jwt.verify(token,process.env.SECERT_KEY)
        if(!decode){
             return res.status(401).json({
                message:"Invalid token",
                success:false

            })
        }

         
        req.id=decode.userID
        next()

    }catch(err){
          console.log(err)
          res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}

export default isAuthenticated
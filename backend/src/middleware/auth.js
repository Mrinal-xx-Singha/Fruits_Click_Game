import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const authenticate = (req,res,next) =>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message:"Authentication required"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({message:"Invalid token"})        
    }
}


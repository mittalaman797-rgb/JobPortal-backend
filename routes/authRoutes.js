// router.route("/register").post(middelewarem,controller)
import express from "express"
const router=express.Router()
import { register,login,logOut,updateProfile } from "../controllers/user.controller.js"
import { loginupValidation,signupValidation } from "../middleware/authValidation.js"

import isAuthenticated from "../middleware/auth.js"
import { singleUpload } from "../middleware/multer.js"



router.post("/register",singleUpload,signupValidation,register)
router.post("/login",loginupValidation,login)
router.patch("/profile/update",singleUpload,isAuthenticated,updateProfile)
router.delete("/logout",logOut)

export default router
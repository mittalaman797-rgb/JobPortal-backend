import express from "express"
import { registerCompany,getCompany,getCompanyById,updateCompany } from "../controllers/company.controller.js"
import isAuthenticated from "../middleware/auth.js"
import { singleUpload } from "../middleware/multer.js"

const router=express.Router()

router.post("/register",isAuthenticated,registerCompany)
router.get("/get",isAuthenticated,getCompany)
// router.get("/get/:id",isAuthenticated,getCompanyById)
// router.put("/update/:id",singleUpload,isAuthenticated,updateCompany)
router.get("/get/:companyId", isAuthenticated, getCompanyById)
router.put("/update/:companyId", singleUpload, isAuthenticated, updateCompany)


export default router
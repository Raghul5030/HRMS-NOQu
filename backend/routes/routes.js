import express from 'express'
import {
    updateList, getInterviewList, getuserById, AddEmployee, DeleteInterview,
    GetEmployee, getDocDetial, DocStatusUpdate, GetAssets, UpdateAssets,
    Login, sendEmail, CheckEmail, ResetPassword, Cloudinary,
    UpdateAssetsStatus, EmployeeDoc, EmployeeAsset, EmployeeDocUpdate,
    EmployeeAssetUpdate, getInterviewList1, UpdateInterview_list,
    UpdateRejectReason, Addonboard, addInterview, GetAssetDefects,
    ReportDefect, UpdateDefectStatus, GetMyDefects
} from '../controller/controller.js'



const route = express.Router()

route.get("/getAssets", GetAssets)
route.get("/asset-defects", GetAssetDefects)
route.get("/my-defects", GetMyDefects)
route.get("/getUsers", getInterviewList)
route.get("/getform", getInterviewList1)
route.get("/getEmployee", GetEmployee)
route.get("/document", getDocDetial)
route.get('/getuser/:id', getuserById)
route.post("/UpdateInterview", UpdateInterview_list)
route.post("/UpdateInterviewReject", UpdateRejectReason)
route.post("/addinter", Addonboard)
route.post("/cloudinary-signature", Cloudinary)

route.post("/login", Login)
route.post("/report-defect", ReportDefect)
route.post("/update-defect-status", UpdateDefectStatus)
route.post("/UpdateAsset", UpdateAssets)
route.post("/UpdateAssets", UpdateAssets)
route.post("/udassets", UpdateAssetsStatus)
route.post("/updateEmployeeStatus", UpdateAssetsStatus)
route.post('/createEmployee', AddEmployee)
route.post("/updateEmployee", updateList)
route.post("/UpdateDocStatus", DocStatusUpdate)
route.post("/sendEmail", sendEmail)
route.post("/check-email", CheckEmail)
route.post("/reset-password", ResetPassword)
route.post("/cloudinary", Cloudinary)
route.post("/empdoc", EmployeeDoc)
route.post("/empass", EmployeeAsset)
route.post("/UpdateEmpDoc", EmployeeDocUpdate)
route.post("/empassupdate", EmployeeAssetUpdate)
route.post("/addInterviewForm", addInterview)

route.delete('/deleteInterview/:id', DeleteInterview)

export default route;

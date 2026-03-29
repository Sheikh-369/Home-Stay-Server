import express, { Router } from "express"
import upload from "../middlewaare/multer-upload"
import asyncErrorHandler from "../services/async-error-handler"
import AuthController from "../controllers/auth-controller"
import Middleware, { Role } from "../middlewaare/middleware"

const router:Router=express.Router()

//user register
router.route("/register").post(
    asyncErrorHandler(AuthController.userRegister)
)

//user login
router.route("/login").post(
    asyncErrorHandler(AuthController.userLogin)
)

//forgot password
router.route("/forgot-password").post(
    asyncErrorHandler(AuthController.forgotPassword)
)

// //reset password
router.route("/reset-password").post(
    asyncErrorHandler(AuthController.resetPassword)
)


// //get users by id
router.route("/user/:id").get(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin,Role.Guest),
    asyncErrorHandler(AuthController.getUserById)
)

// //update user/admin profile
router.route("/update-profile/:id").patch(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin,Role.Guest),
    upload.single("profileImage"),
    asyncErrorHandler(AuthController.updateProfile)
)

export default router
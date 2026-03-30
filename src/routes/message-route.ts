import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import Middleware, { Role } from "../middlewaare/middleware"
import MessageController from "../controllers/message-controller"

const router:Router=express.Router()

//create message(user)
router.route("/message").post(
    asyncErrorHandler(MessageController.createMessage)
)

//fetch all messages(admin)
router.route("/message").get(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin),
    asyncErrorHandler(MessageController.getAllMessages)
)

//delete messages(admin)
router.route("/message/:id").delete(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin),
    asyncErrorHandler(MessageController.deleteMessage)
)

export default router
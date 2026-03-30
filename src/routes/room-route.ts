import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import Middleware, { Role } from "../middlewaare/middleware"
import RoomController from "../controllers/room-controller"

const router:Router=express.Router()

//create room(admin)
router.route("/room").post(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin),
    asyncErrorHandler(RoomController.createRoom)
)

//fetch all rooms
router.route("/room").get(
    asyncErrorHandler(RoomController.createRoom)
)

//fetch single room
router.route("/room/:id").get(
    asyncErrorHandler(RoomController.createRoom)
)

//update room(admin)
router.route("/room/:id").patch(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin),
    asyncErrorHandler(RoomController.updateRoom)
)

//delete room (admin)
router.route("/room/:id").delete(
    Middleware.isLoggedIn,
    Middleware.accessTo(Role.Admin),
    asyncErrorHandler(RoomController.deleteRoom)
)

export default router
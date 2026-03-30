import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import BookingController from "../controllers/booking-controller"
import upload from "../middlewaare/multer-upload"
import Middleware, { Role } from "../middlewaare/middleware"

const router:Router=express.Router()

//create booking
router.route("/booking").post(
    upload.fields([
    { name: "idDocumentImage", maxCount: 1 },
    { name: "paymentProofImage", maxCount: 1 },
  ]),
    asyncErrorHandler(BookingController.createBooking)
)

//update booking
router.route("/booking/:id").patch(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(BookingController.adminUpdateBooking)
)

//delete booking
router.route("/booking/:id").delete(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(BookingController.adminDeleteBooking)
)

//fetch all bokings
router.route("/booking").get(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(BookingController.fetchAllBookings)
)

export default router
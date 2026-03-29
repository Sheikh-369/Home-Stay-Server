import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import BookingController from "../controllers/booking-controller"
import upload from "../middlewaare/multer-upload"

const router:Router=express.Router()

//create booking
router.route("/booking").post(
    upload.fields([
    { name: "idDocumentImage", maxCount: 1 },
    { name: "paymentProofImage", maxCount: 1 },
  ]),
    asyncErrorHandler(BookingController.createBooking)
)

export default router
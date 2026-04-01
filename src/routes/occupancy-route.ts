import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import upload from "../middlewaare/multer-upload"
import Middleware, { Role } from "../middlewaare/middleware"
import { OccupancyController } from "../controllers/occupancy-controller"

const router: Router = express.Router()

// ─── CHECK-IN / CREATE OCCUPANCY ───
router.route("/occupancy").post(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  upload.single("idDocumentImage"),
  asyncErrorHandler(OccupancyController.checkInGuest)
)

// ─── FETCH ALL ACTIVE GUESTS ───
router.route("/occupancy").get(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(OccupancyController.getActiveGuests)
)


// ─── CHECK-OUT GUEST ───
// This marks them as 'checked-out', effectively 'deleting' them from the active list
router.route("/occupancy/checkout/:id").patch(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(OccupancyController.checkOutGuest)
)


export default router
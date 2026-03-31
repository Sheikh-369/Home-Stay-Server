import express, { Router } from "express"
import asyncErrorHandler from "../services/async-error-handler"
import OccupancyController from "../controllers/occupancy-controller"
import upload from "../middlewaare/multer-upload"
import Middleware, { Role } from "../middlewaare/middleware"

const router: Router = express.Router()

// ─── CHECK-IN / CREATE OCCUPANCY ───
// Admin uses this to move a guest from 'Booking' to 'Active' or for Walk-ins
router.route("/occupancy").post(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  upload.single("idDocumentImage"),
  asyncErrorHandler(OccupancyController.checkInGuest)
)

// ─── FETCH ALL ACTIVE GUESTS ───
// This powers your main dashboard (filtered for status: 'active')
router.route("/occupancy").get(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(OccupancyController.getActiveGuests)
)

// ─── ADD INTERIM PAYMENT ───
// For recording money paid during the stay (before final check-out)
router.route("/occupancy/payment/:id").patch(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(OccupancyController.addPayment)
)

// ─── CHECK-OUT GUEST ───
// This marks them as 'checked-out', effectively 'deleting' them from the active list
router.route("/occupancy/checkout/:id").patch(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(OccupancyController.checkOutGuest)
)

// ─── SEARCH GUEST HISTORY (POLICE INQUIRY) ───
// To find data for guests who are already checked out
router.route("/occupancy/search").get(
  Middleware.isLoggedIn,
  Middleware.accessTo(Role.Admin),
  asyncErrorHandler(OccupancyController.searchGuestHistory)
)

export default router
import { Request, Response } from "express";
import Booking from "../database/models/booking-model";

interface BookingFiles {
  idDocumentImage?: Express.Multer.File[];
  paymentProofImage?: Express.Multer.File[];
}

class BookingController {
  //create booking
  static async createBooking(req: Request, res: Response) {
    try {
      const {
        fullName,
        phone,
        email,
        address,
        emergencyName,
        emergencyPhone,
        idType,
        entryDate,
        exitDate,
        roomPreference,
        numberOfOccupants,
        purposeOfStay,
        message,
        agreeToTerms,
      } = req.body;

      const files = req.files as BookingFiles;

      // Cloudinary URLs (safe access)
      const idDocumentImage =
        files?.idDocumentImage?.[0]?.path;

      const paymentProofImage =
        files?.paymentProofImage?.[0]?.path;

      // Validation
      if (
        !fullName ||
        !phone ||
        !email ||
        !address ||
        !idType ||
        !entryDate ||
        !exitDate ||
        !roomPreference ||
        !numberOfOccupants ||
        !purposeOfStay ||
        !agreeToTerms ||
        !files?.idDocumentImage ||
        !files?.paymentProofImage
      ) {
        return res.status(400).json({
          message: "Please fill all required fields and upload both images.",
        });
      }

      const booking = await Booking.create({
        fullName,
        phone,
        email,
        address,
        emergencyName,
        emergencyPhone,
        idType,
        idDocumentImage,
        entryDate,
        exitDate,
        roomPreference,
        numberOfOccupants: Number(numberOfOccupants),
        purposeOfStay,
        message,
        agreeToTerms,
        paymentProofImage,
        paymentStatus: "pending", // default
      });

      return res.status(200).json({
        message: "Booking submitted successfully.",
        data: booking,
      });
    } catch (error) {
      console.error("Booking Error:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  //admin update booking
  static async adminUpdateBooking(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { paymentStatus } = req.body; // only paymentStatus needed

      const booking = await Booking.findByPk(id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }

      // ✅ Allowed values
      const validPaymentStatus = ["pending", "verified", "rejected"];

      if (paymentStatus && !validPaymentStatus.includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status." });
      }

      // 🔹 Auto-update bookingStatus based on paymentStatus
      let newBookingStatus = booking.bookingStatus; // default = current

      if (paymentStatus === "verified") {
        newBookingStatus = "confirmed";
      } else if (paymentStatus === "rejected") {
        newBookingStatus = "cancelled";
      } else if (paymentStatus === "pending") {
        newBookingStatus = "pending";
      }

      await booking.update({
        paymentStatus: paymentStatus || booking.paymentStatus,
        bookingStatus: newBookingStatus,
      });

      return res.status(200).json({
        message: "Booking status updated successfully.",
        data: booking,
      });
    } catch (error) {
      console.error("Admin Update Error:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
}

//delete booking
  static async adminDeleteBooking(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const now = new Date();
    const createdAt = new Date(booking.createdAt);

    const diffInDays =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    // ✅ Delete rules
    if (
      booking.bookingStatus !== "cancelled" &&
      booking.paymentStatus !== "rejected" &&
      diffInDays < 30
    ) {
      return res.status(403).json({
        message: "Cannot delete active booking.",
      });
    }

    await booking.destroy();

    return res.status(200).json({
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
}

    // Fetch all bookings (admin only)
  static async fetchAllBookings(req: Request, res: Response) {
    try {
      const bookings = await Booking.findAll({
        order: [["submittedAt", "DESC"]],
      });

      return res.status(200).json({
        message: "Bookings fetched successfully.",
        data: bookings,
      });
    } catch (error) {
      console.error("Fetch Bookings Error:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
}

export default BookingController;
import { Request, Response } from "express";
import Booking from "../database/models/booking-model";

interface BookingFiles {
  idDocumentImage?: Express.Multer.File[];
  paymentProofImage?: Express.Multer.File[];
}

class BookingController {
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
}

export default BookingController;
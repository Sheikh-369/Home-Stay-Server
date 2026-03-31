import { Request, Response } from "express";
import Occupancy from "../database/models/occupancy-model";
import Booking from "../database/models/booking-model";
import { Op } from "sequelize";

class OccupancyController {
  // ─── CHECK-IN (Convert Booking to Active Guest) ───
  static async checkInGuest(req: Request, res: Response) {
    const { bookingId, roomNumber, rateAmount, billingCycle, securityDeposit } = req.body;

    if (!bookingId || !roomNumber || !rateAmount) {
      res.status(400).json({ message: "Missing required check-in details." });
      return;
    }

    // 1. Find the existing booking
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      res.status(404).json({ message: "Booking not found." });
      return;
    }

    // 2. Create the Occupancy record (Transferring data)
    const newOccupancy = await Occupancy.create({
      fullName: booking.fullName,
      phone: booking.phone,
      address: booking.address,
      idDocumentImage: booking.idDocumentImage,
      roomNumber,
      entryDate: booking.entryDate, // Or new Date() for actual arrival
      exitDate: booking.exitDate,
      billingCycle: billingCycle || 'monthly',
      rateAmount,
      totalPaid: booking.advanceAmount, // Start with the advance they already paid
      securityDeposit: securityDeposit || 0,
      status: 'active'
    });

    // 3. Update the original booking status so it's "Checked In"
    await booking.update({ bookingStatus: 'confirmed' }); // Or a new status like 'checked-in'

    res.status(200).json({
      message: "Guest checked in successfully.",
      data: newOccupancy
    });
  }

  // ─── GET ACTIVE GUESTS (For your dashboard table) ───
  static async getActiveGuests(req: Request, res: Response) {
    const guests = await Occupancy.findAll({
      where: { status: 'active' }
    });
    res.status(200).json(guests);
  }

  // ─── CHECK-OUT & FINAL BILLING ───
  static async checkOutGuest(req: Request, res: Response) {
    const  id  = req.params.id as string;
    const { finalPayment } = req.body;

    const guest = await Occupancy.findByPk(id);
    if (!guest || guest.status === 'checked-out') {
      res.status(404).json({ message: "Active guest not found." });
      return;
    }

    // Update total paid with the final settlement
    const updatedTotalPaid = guest.totalPaid + (Number(finalPayment) || 0);

    await guest.update({
      totalPaid: updatedTotalPaid,
      status: 'checked-out',
      exitDate: new Date().toISOString().split('T')[0] // Set exit to today
    });

    res.status(200).json({
      message: "Check-out complete. Guest moved to history.",
    });
  }

  // ─── ADD INTERIM PAYMENT (If they pay mid-month) ───
  static async addPayment(req: Request, res: Response) {
    const  id  = req.params.id as string;
    const { amount } = req.body;

    const guest = await Occupancy.findByPk(id);
    if (!guest) {
      res.status(404).json({ message: "Guest not found." });
      return;
    }

    await guest.update({
      totalPaid: guest.totalPaid + Number(amount)
    });

    res.status(200).json({ message: "Payment recorded successfully." });
  }

    // Add this to your OccupancyController.ts
    static async searchGuestHistory(req: Request, res: Response) {
        const { query } = req.query; // e.g., ?query=9801234567

        const results = await Occupancy.findAll({
            where: {
            [Op.or]: [
                { fullName: { [Op.like]: `%${query}%` } },
                { phone: { [Op.like]: `%${query}%` } }
            ]
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(results);
    }


}

export default OccupancyController;
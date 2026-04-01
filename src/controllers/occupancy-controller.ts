import { Request, Response } from 'express';
import Occupancy from '../database/models/occupancy-model';

export class OccupancyController {
  
  // 1. CHECK-IN: Create the active record
  static async checkInGuest(req: Request, res: Response) {
    try {
      const { fullName, phone, address, roomNumber, rateAmount, billingCycle, securityDeposit, exitDate } = req.body;
      const idDocumentImage = req.file ? req.file.path : "required"; // Enforcing your rule

      if (idDocumentImage === "required") return res.status(400).json({ message: "ID Document is mandatory." });

      const newOccupancy = await Occupancy.create({
        fullName, phone, address, idDocumentImage, roomNumber,
        rateAmount: Number(rateAmount),
        billingCycle: billingCycle || 'monthly',
        securityDeposit: Number(securityDeposit) || 0,
        entryDate: new Date().toISOString().split('T')[0],
        exitDate, // Planned date
        status: 'active',
        totalPaid: 0
      });

      res.status(200).json({ success: true, data: newOccupancy });
    } catch (error: any) {
      res.status(500).json({ message: "Check-in failed", error: error.message });
    }
  }

  // 2. CHECK-OUT: Calculate stay and finalize bill
  static async checkOutGuest(req: Request, res: Response) {
    try {
      const  id  = req.params.id as string;
      const guest = await Occupancy.findByPk(id);

      if (!guest || guest.status === 'checked-out') {
        return res.status(404).json({ message: "Active resident not found." });
      }

      const actualExitDate = new Date().toISOString().split('T')[0];
      const start = new Date(guest.entryDate);
      const end = new Date(actualExitDate);
      
      // Calculate duration (Difference in days)
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Min 1 day

      // Simple Bill Calculation
      let finalBill = 0;
      if (guest.billingCycle === 'monthly') {
        finalBill = (guest.rateAmount / 30) * diffDays;
      } else {
        finalBill = guest.rateAmount * diffDays;
      }

      // Update record to final state
      await guest.update({
        exitDate: actualExitDate,
        status: 'checked-out',
        adminNotes: `Stayed for ${diffDays} days. Final Bill: ₹${finalBill.toFixed(2)}`
      });

      res.status(200).json({ 
        success: true, 
        daysStayed: diffDays, 
        totalDue: finalBill.toFixed(2),
        message: "Guest checked out successfully." 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Check-out failed", error: error.message });
    }
  }

  // 3. GET ACTIVE LIST: For the Admin to monitor
  static async getActiveGuests(req: Request, res: Response) {
    try {
      const actives = await Occupancy.findAll({ where: { status: 'active' } });
      res.status(200).json(actives);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching list" });
    }
  }
}
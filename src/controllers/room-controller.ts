import { Request, Response } from "express";
import Room from "../database/models/room-model";

class RoomController {
  // ****************** Create Room **************************
  static async createRoom(req: Request, res: Response) {
    const { roomNumber, floor, roomType, capacity, features, rent, status } = req.body;

    // Validation
    if (!roomNumber || !floor || !roomType || !capacity || !rent) {
      res.status(400).json({ message: "Please fill all required fields." });
      return;
    }

    // Check if Room Number already exists
    const existingRoom = await Room.findOne({ where: { roomNumber } });
    if (existingRoom) {
      res.status(400).json({ message: "Room number already exists." });
      return;
    }

    try {
      const newRoom = await Room.create({
        roomNumber,
        floor,
        roomType,
        capacity,
        features: features || [],
        rent,
        status: status || 'Vacant',
      });

      res.status(201).json({
        message: "Room created successfully.",
        data: newRoom,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // ****************** Fetch All Rooms **************************
  static async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await Room.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json({ data: rooms });
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms." });
    }
  }

  // ****************** Fetch Single Room **************************
  static async getRoomById(req: Request, res: Response) {
    const  id  = req.params.id as string;
    try {
      const room = await Room.findByPk(id);
      if (!room) {
        res.status(404).json({ message: "Room not found." });
        return;
      }
      res.status(200).json({ data: room });
    } catch (error) {
      res.status(500).json({ message: "Error fetching room." });
    }
  }

  // ****************** Update Room **************************
  static async updateRoom(req: Request, res: Response) {
    const  id  = req.params.id as string;
    const { roomNumber, floor, roomType, capacity, features, rent, status } = req.body;

    try {
      const room = await Room.findByPk(id);
      if (!room) {
        res.status(404).json({ message: "Room not found." });
        return;
      }

      await room.update({
        roomNumber,
        floor,
        roomType,
        capacity,
        features,
        rent,
        status,
      });

      res.status(200).json({
        message: "Room updated successfully.",
        data: room,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating room." });
    }
  }

  // ****************** Delete Room **************************
  static async deleteRoom(req: Request, res: Response) {
    const  id  = req.params.id as string;

    try {
      const room = await Room.findByPk(id);
      if (!room) {
        res.status(404).json({ message: "Room not found." });
        return;
      }

      await room.destroy();
      res.status(200).json({ message: "Room deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error deleting room." });
    }
  }
}

export default RoomController;
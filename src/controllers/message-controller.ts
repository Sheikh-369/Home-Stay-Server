import { Request, Response } from "express";
import ContactMessage from "../database/models/message-model";

class MessageController {
  // ****************** Create Message **************************
  static async createMessage(req: Request, res: Response) {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation for required fields
    if (!name || !email || !message) {
      res.status(400).json({
        message: "Please fill all required fields (name, email, message).",
      });
      return;
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully.",
      data: newMessage,
    });
  }

  // ****************** Fetch All Messages **************************
  static async getAllMessages(req: Request, res: Response) {
    const messages = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]], // Latest messages first
    });

    res.status(200).json({
      message: "Messages fetched successfully.",
      data: messages,
    });
  }

  // ****************** Delete Message **************************
  static async deleteMessage(req: Request, res: Response) {
    const  id  = req.params.id as string;

    const messageToDelete = await ContactMessage.findByPk(id);

    if (!messageToDelete) {
      res.status(404).json({
        message: "Message not found.",
      });
      return;
    }

    await messageToDelete.destroy();

    res.status(200).json({
      message: "Message deleted successfully.",
    });
  }

  // ****************** Update Message Status (Mark as Read) ******************
  static async markAsRead(req: Request, res: Response) {
    const  id  = req.params.id as string;

    const message = await ContactMessage.findByPk(id);

    if (!message) {
      res.status(404).json({ message: "Message not found." });
      return;
    }

    // Update the read status
    await message.update({ read: true }); 

    res.status(200).json({
      message: "Message marked as read.",
      data: message,
    });
  }

}

export default MessageController;
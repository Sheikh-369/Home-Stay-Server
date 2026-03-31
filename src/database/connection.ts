import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";//always 1
config();//and then 2

import User from "./models/user-model";
import Booking from "./models/booking-model";
import ContactMessage from "./models/message-model";
import Room from "./models/room-model";
import Occupancy from "./models/occupancy-model";

const sequelize = new Sequelize(process.env.CONNECTION_STRING as string, {
    models: [User,Booking,ContactMessage,Room,Occupancy],
});

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log("✅ Authentication was successful.");

        await sequelize.sync({ alter: false });
        console.log("✅ Migration successful.");
    } catch (error) {
        console.error("❌ Database error:", error);
    }
}

initializeDatabase();

export default sequelize;
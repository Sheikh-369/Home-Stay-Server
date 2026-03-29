import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";//always 1
config();//and then 2

import User from "./models/user-model";
import Booking from "./models/booking-model";

const sequelize = new Sequelize(process.env.CONNECTION_STRING as string, {
    models: [User,Booking],
});

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log("✅ Authentication was successful.");

        await sequelize.sync({ alter: true });
        console.log("✅ Migration successful.");
    } catch (error) {
        console.error("❌ Database error:", error);
    }
}

initializeDatabase();

export default sequelize;



git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Sheikh-369/Home-Stay-Server.git
git push -u origin main
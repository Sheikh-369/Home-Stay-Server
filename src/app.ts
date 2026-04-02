import express from "express";
import cors from "cors"

const app = express();
import "./database/connection"

import authRoute from "./routes/auth-route"
import bookingRoute from "./routes/booking-route"
import messageRoute from "./routes/message-route"
import roomRoute from "./routes/room-route"
import occupancyRoute from "./routes/occupancy-route"

app.use(express.json())

app.use(
  cors({
    origin:[
      "http://localhost:4028",
      "http://localhost:3000",
      "https://home-stay-client.vercel.app"
    ],  //do not use slash(/) here

    credentials: true
  })
);

//for auth
app.use("/homestay/auth",authRoute)

//for booking
app.use("/homestay",bookingRoute)

//for messages
app.use("/homestay",messageRoute)

//for room
app.use("/homestay",roomRoute)

//for occupancy
app.use("/homestay",occupancyRoute)

export default app;

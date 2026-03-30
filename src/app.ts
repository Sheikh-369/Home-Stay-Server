import express from "express";
import cors from "cors"

const app = express();
import "./database/connection"

import authRoute from "../src/routes/auth-route"
import bookingRoute from "../src/routes/booking-route"
import messageRoute from "../src/routes/message-route"
import roomRoute from "../src/routes/room-route"

app.use(express.json())

app.use(
  cors({
    origin:[
      "http://localhost:4028",
      "http://localhost:3000"
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

export default app;

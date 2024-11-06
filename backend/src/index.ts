import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { DataSource } from "typeorm";
import { Activity } from "./models/Activity";
import { Friends } from "./models/Friends";
import { User } from "./models/User";
import { activityRouter } from "./routes/activity.route";
import { friendRouter } from "./routes/friends.route";
import { userRouter } from "./routes/users.route";
dotenv.config();
const app = express();
const PORT = 5000;

const main = async () => {
  const connection = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    entities: [User, Friends, Activity],
    ssl: true,
  });

  connection
    .initialize()
    .then(() => {
      console.log(`DATABASE CONNECTED`);
      app.use(express.json());
      app.use(cors());

      app.use(userRouter);
      app.use(friendRouter);
      app.use(activityRouter);

      app.listen(PORT, () => {
        console.log(`SERVER STARTED ON ${PORT}`);
      });
    })
    .catch((err) => {
      console.error(`DATABASE DOES NOT CONNECTED `, err);
    });
};

main();

import { DataSource } from "typeorm";

import express from "express";
import cors from "cors";
import { User } from "./models/User";
import { userRouter } from "./routes/users.route";

const app = express();
const PORT = 5000;

const main = async () => {
  const connection = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "root123",
    database: "postgres",
    synchronize: true,
    entities: [User],
  });

  connection
    .initialize()
    .then(() => {
      console.log(`DATABASE CONNECTED`);
      app.use(express.json());
      app.use(cors());
      app.use(userRouter);

      app.listen(PORT, () => {
        console.log(`SERVER STARTED ON ${PORT}`);
      });
    })
    .catch((err) => {
      console.error(`DATABASE DOES NOT CONNECTED `, err);
    });
};

main();

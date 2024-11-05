import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { omit } from "lodash";
import { User } from "../models/User";

dotenv.config();

const sendErrorResponse = (
  res: express.Response,
  statusCode: number,
  message: string
) => {
  res.status(statusCode).send({ message });
};

const generateToken = (
  userId: number,
  email: string,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign({ userId, email }, secret, { expiresIn });
};

export const userById = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.app.get("userId");
    const find_user = await User.findOneBy({ id: userId });
    if (find_user) {
      res.status(200).send({ data: find_user });
    } else {
      res.status(404).send({ message: "User not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const userLogin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Validation failed");
    }

    const { email, password } = req.body;
    const findUser = await User.findOneBy({ email });

    if (!findUser) {
      return sendErrorResponse(res, 404, "No User found with this email!");
    }

    const correctPassword = await bcrypt.compare(password, findUser.password);
    if (!correctPassword) {
      return sendErrorResponse(res, 401, "Invalid password!");
    }

    await User.update({ id: findUser.id }, { last_login_at: new Date() });

    if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
      return sendErrorResponse(res, 500, "Missing JWT secret(s)");
    }

    const accessToken = generateToken(
      findUser.id,
      findUser.email,
      process.env.ACCESS_SECRET,
      "7d"
    );

    res.status(200).send({
      user: omit(findUser, ["password"]),
      accessToken,
    });
  } catch (err) {
    console.error(err);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const addUser = async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors });
    } else {
      const { first_name, last_name, email, password } = req.body;
      const existing = await User.findOneBy({ email: email });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.createQueryBuilder()
          .insert()
          .into(User)
          .values({ first_name, last_name, email, password: hashedPassword })
          .returning("first_name, last_name, email")
          .execute();
        if (process.env.ACCESS_SECRET && process.env.REFRESH_SECRET) {
          const generateAccessToken = jwt.sign(
            { userId: user.raw[0].id, email: user.raw[0].email },
            process.env.ACCESS_SECRET,
            { expiresIn: "7d" }
          );

          res.status(200).send({
            user: user.raw[0],
            accessToken: generateAccessToken,
          });
        }
      } else {
        res.status(401).send({ message: "User Already Exists" });
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const updatePassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.app.get("userId");
    const { password } = req.query;

    if (userId && password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.toString(), salt);
      const findUser = await User.findOneBy({ id: +userId });
      if (findUser) {
        await User.update({ id: +userId }, { password: hashedPassword });
        res
          .status(200)
          .send({ message: "Password has been updated successfully!" });
      } else {
        res.status(404).send({ message: "User doesn't exists!" });
      }
    } else {
      res.status(500).send({ message: "Something went wrong!" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getCurrentUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.app.get("userId");
    const findUser = await User.findOneBy({ id: userId });
    if (findUser) {
      res.status(200).send({ data: omit(findUser, ["password"]) });
    } else {
      res.status(404).send({ message: "User not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  userLogin,
  addUser,
  updatePassword,
  userById,
  getCurrentUser,
};

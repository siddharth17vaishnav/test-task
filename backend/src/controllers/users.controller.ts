import * as dotenv from "dotenv";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User } from "../models/User";
import { omit } from "lodash";

dotenv.config();
let refreshTokens: string[] = [];

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
      res.status(400).send({ errors });
    } else {
      const { email, password } = req.body;
      const findUser = await User.findOneBy({ email });
      if (findUser && process.env.ACCESS_SECRET) {
        const correctPassword = await bcrypt.compare(
          password,
          findUser.password
        );
        if (
          correctPassword &&
          process.env.ACCESS_SECRET &&
          process.env.REFRESH_SECRET
        ) {
          await User.update({ id: findUser.id }, { last_login_at: new Date() });
          const generateAccessToken = jwt.sign(
            {
              userId: findUser.id,
              email: findUser.email,
            },
            process.env.ACCESS_SECRET,
            { expiresIn: "7d" }
          );
          const generateRefreshToken = jwt.sign(
            {
              userId: findUser.id,
              email: findUser.email,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: "30d" }
          );
          refreshTokens.push(generateRefreshToken);

          res.status(200).send({
            user: omit(findUser, ["password"]),
            accessToken: generateAccessToken,
            refreshToken: generateRefreshToken,
          });
        } else {
          res.status(401).send({ message: "Invalid password!" });
        }
      } else {
        res.status(404).send({ message: "User not found!" });
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const addUser = async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors });
    } else {
      const { name, email, password } = req.body;
      const existing = await User.findOneBy({ email: email });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.createQueryBuilder()
          .insert()
          .into(User)
          .values({ name: name, email: email, password: hashedPassword })
          .returning("*")
          .execute();
        if (process.env.ACCESS_SECRET && process.env.REFRESH_SECRET) {
          const generateAccessToken = jwt.sign(
            { userId: user.raw[0].id, email: user.raw[0].email },
            process.env.ACCESS_SECRET,
            { expiresIn: "7d" }
          );
          const generateRefreshToken = jwt.sign(
            { userId: user.raw[0].id, email: user.raw[0].email },
            process.env.REFRESH_SECRET,
            { expiresIn: "30d" }
          );
          refreshTokens.push(generateRefreshToken);
          res.status(200).send({
            user: user.raw[0],
            accessToken: generateAccessToken,
            refreshToken: generateRefreshToken,
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

export const refreshToken = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken == null)
      res.status(400).send({
        message: "No refresh token available to generate access token",
      });
    if (!refreshToken.includes(refreshToken)) {
      res.status(401).send({ message: "Unauthenticated request" });
    } else if (process.env.REFRESH_SECRET && process.env.ACCESS_SECRET) {
      const validRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      ) as unknown as { userId: string; email: string };
      const newAccessToken = jwt.sign(
        { userId: validRefreshToken.userId, email: validRefreshToken.email },
        process.env.ACCESS_SECRET
      );
      const newRefreshToken = jwt.sign(
        { userId: validRefreshToken.userId, email: validRefreshToken.email },
        process.env.REFRESH_SECRET
      );
      res.status(200).send({ newAccessToken, newRefreshToken });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  userLogin,
  addUser,
  updatePassword,
  refreshToken,
  userById,
};

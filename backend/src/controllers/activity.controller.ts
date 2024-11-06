import { Request, Response } from "express";
import { Activity } from "../models/Activity";

export const getActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");
    const acitivity = await Activity.findBy({ user: { id: userId } });
    return res.status(200).json(acitivity);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = { getActivity };

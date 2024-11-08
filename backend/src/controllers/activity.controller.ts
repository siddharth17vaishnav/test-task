import { Request, Response } from "express";
import { Activity } from "../models/Activity";

export const getActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");
    const activities = await Activity.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
    return res.status(200).json(activities);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = { getActivity };

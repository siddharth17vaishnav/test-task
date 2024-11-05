import { Request, Response } from "express";
import { Friends, FriendStatus } from "../models/Friends";

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");
    const { id } = req.body;

    const existingRequest = await Friends.findOne({
      where: [
        { added_by: userId, user: id },
        { added_by: id, user: userId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .send({ message: "Friend request already exists." });
    }

    const newRequest = Friends.create({
      user: id,
      added_by: userId,
      status: FriendStatus.PENDING,
    });

    await newRequest.save();

    return res
      .status(201)
      .send({ message: "Friend request sent successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");
    const { id } = req.params;

    const friendRequest = await Friends.findOne({
      where: {
        id: parseInt(id),
        user: userId,
        status: FriendStatus.PENDING,
      },
    });

    if (!friendRequest) {
      return res
        .status(404)
        .send({ message: "Friend request not found or already processed." });
    }

    friendRequest.status = FriendStatus.ACCEPTED;
    await friendRequest.save();

    return res.status(200).send({ message: "Friend request accepted." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");
    const { id } = req.params;

    const friendRequest = await Friends.findOne({
      where: {
        id: parseInt(id),
        user: userId,
        status: FriendStatus.PENDING,
      },
    });

    if (!friendRequest) {
      return res
        .status(404)
        .send({ message: "Friend request not found or already processed." });
    }

    friendRequest.status = FriendStatus.REJECTED;
    await friendRequest.save();

    return res.status(200).send({ message: "Friend request rejected." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");

    const requests = await Friends.find({
      where: [{ added_by: userId }, { user: userId }],
      relations: ["user", "added_by"],
    });

    return res.status(200).send({ requests });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  getRequests,
};

import { Request, Response } from "express";
import { Friends, FriendStatus } from "../models/Friends";
import { User } from "../models/User";

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

    await Friends.delete({ id: friendRequest.id });

    return res.status(200).send({ message: "Friend request rejected." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");
    const requests = await Friends.createQueryBuilder("friends")
      .leftJoinAndSelect("friends.user", "user") // Join the `user` relation
      .leftJoinAndSelect("friends.added_by", "added_by") 
      .where("friends.userId = :userId", { userId })
      .orWhere("friends.addedById = :userId", { userId }) 
      .getMany();

    return res.status(200).send({ requests });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

export const findFriends = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const userId = req.app.get("userId");
    if (!search || typeof search !== "string") {
      return res.status(200).send([]);
    }

    const users = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.friendsAsUser", "friend")
      .leftJoinAndSelect("friend.added_by", "added_by")
      .where("user.first_name ILIKE :search OR user.last_name ILIKE :search", {
        search: `%${search}%`,
      })
      .andWhere("friend.status = :status", { status: FriendStatus.ACCEPTED }) // Optional: filter by accepted status
      .select([
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "user.last_login_at",
        "user.created_at",
        "user.updated_at",
        "friend.status",
      ])
      .getMany();

    const transformedUsers = users.map((user) => {
      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        last_login_at: user.last_login_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
        status:
          user?.friendsAsUser?.length > 0
            ? user?.friendsAsUser?.[0]?.status
            : null,
      };
    });

    return res
      .status(200)
      .json(transformedUsers.filter((i) => i.id !== userId));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Something went wrong!", error: err.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptRequest,
  rejectRequest,
  getRequests,
  findFriends,
};

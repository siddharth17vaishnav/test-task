import { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { Friends, FriendStatus } from "../models/Friends";
import { User } from "../models/User";

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.app.get("userId");
    const { id } = req.body;

    const findUser = await User.findOne({ where: { id: userId } });
    const findFriend = await User.findOne({ where: { id } });

    const existingRequest = await Friends.query(
      'SELECT * FROM friends WHERE friends."addedById" = $1 AND friends."userId"=$2 LIMIT 1',
      [userId, id]
    );

    if (existingRequest?.[0]) {
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
    if (findUser && findFriend) {
      await Activity.insert({
        user: findUser,
        type: "send-friend-request",
        description: `${findUser.first_name} sent friend request to ${findFriend?.first_name}`,
      });
      await Activity.insert({
        user: findFriend,
        type: "send-friend-request",
        description: `${findUser.first_name} sent you a friend request `,
      });
    }

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

    const findUser = await User.findOne({ where: { id: userId } });
    const findFriend = await User.findOne({ where: { id: parseInt(id) } });

    const friendRequest = await Friends.findOne({
      where: {
        added_by: { id: parseInt(id) },
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

    if (findUser && findFriend) {
      await Activity.insert({
        user: findFriend,
        type: "friend-request-accepted",
        description: `${findUser.first_name} has accepted your friend request`,
      });
    }

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
    const findUser = await User.findOne({ where: { id: userId } });
    const findFriend = await User.findOne({ where: { id: parseInt(id) } });

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
    if (findUser && findFriend) {
      await Activity.insert({
        user: findUser,
        type: "friend-request-rejected",
        description: `${findFriend.first_name} has rejected your friend request`,
      });
    }
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
      .andWhere("user.id != :userId", { userId })
      .getMany();

    const transformedUsers = await Promise.all(
      users.map(async (user) => {
        const requests = await Friends.createQueryBuilder("friends")
          .leftJoinAndSelect("friends.user", "user")
          .leftJoinAndSelect("friends.added_by", "added_by")
          .where("friends.userId = :userId", { userId: userId })
          .orWhere("friends.addedById = :userId", { userId: userId })
          .getMany();
        const status = requests.find(
          (i) => i.added_by.id === user.id || i.user.id === user.id
        )?.status;

        return {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          last_login_at: user.last_login_at,
          created_at: user.created_at,
          updated_at: user.updated_at,
          status: status || null,
          requests,
        };
      })
    );

    return res.status(200).json(transformedUsers);
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

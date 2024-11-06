import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export enum FriendStatus {
  ACCEPTED = "accepted",
  PENDING = "pending",
  REJECTED = "rejected",
}

@Entity("friends")
export class Friends extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friendsAsUser) // Define inverse relation here
  @JoinColumn({ name: "userId" }) // Make sure foreign key is correctly referenced
  user: User;

  @ManyToOne(() => User, (user) => user.friendsAsAddedBy) // Added by relation
  @JoinColumn({ name: "addedById" }) // Same for the added_by foreign key
  added_by: User;

  // Adding status with enum
  @Column({
    type: "enum",
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

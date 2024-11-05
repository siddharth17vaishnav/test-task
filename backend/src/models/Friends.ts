import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
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

  // Foreign key for user
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  // Foreign key for the user who added the friend
  @ManyToOne(() => User, (user) => user.id)
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

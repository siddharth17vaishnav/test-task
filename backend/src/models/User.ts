import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Activity } from "./Activity";
import { Friends } from "./Friends";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: new Date() })
  last_login_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Friends, (friend) => friend.user)
  friendsAsUser: Friends[];

  @OneToMany(() => Friends, (friend) => friend.user)
  friendsAsAddedBy: Friends[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}

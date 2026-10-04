import { User } from "../entities/user.entity.js";
import { Email } from "../value-objects/email.vo.js";
import { UserId } from "../value-objects/user-id.vo.js";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}

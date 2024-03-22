import { randomUUID } from "crypto";

class User {
  id: string;
  createdAt: number;
  constructor(id: string, createdAt: number) {
    this.id = id;
    this.createdAt = createdAt;
  }

  /** Create a new {@link User} with random {@link id} and current {@link createdAt} date */
  static createRandom(): User {
    return new User(randomUUID(), Date.now());
  }
}

export default User;

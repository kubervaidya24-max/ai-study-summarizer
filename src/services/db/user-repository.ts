import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
}

export class UserRepository {
  static async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  static async findById(id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }

  static async createUser(data: CreateUserData) {
    const passwordHash = await hashPassword(data.password);
    const email = data.email.toLowerCase().trim();
    const name = data.name || email.split("@")[0];
    const image = `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`;

    return db.user.create({
      data: {
        email,
        name,
        passwordHash,
        image,
      },
    });
  }
}

import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const saltRounds = 10;

class UserService {
  constructor(db) {
    this.collection = db.collection("users");
  }

  async createUser(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await this.collection.insertOne({
        username,
        email,
        password: hashedPassword,
      });
      return result.insertedId.toString();
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async getUserById(id) {
    try {
      const user = await this.collection.findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      throw new Error("Failed to get user");
    }
  }

  async getAllUsers() {
    try {
      const users = await this.collection.find().toArray();
      return users;
    } catch (error) {
      throw new Error("Failed to get users");
    }
  }

  async updateUser(id, username, email, password) {
    try {
      let updateFields = { username, email };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.password = hashedPassword;
      }
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async deleteUser(id) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
}

export default UserService;

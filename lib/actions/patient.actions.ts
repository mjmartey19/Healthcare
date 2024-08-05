"use server";

import { ID, Query } from "node-appwrite";

import {
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    console.log('New user created:', newUser);
    return parseStringify(newUser);
  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error);
    // Check if the error code indicates a conflict (user already exists)
    if (error?.code === 409) {
      console.log('User already exists, fetching existing user...');
      try {
        const existingUserList = await users.list([
          Query.equal("email", user.email)
        ]);

          const existingUser = existingUserList.users[0];
          console.log('Existing user found:', existingUser);
          return existingUser;
        
      } catch (listError: any) {
        console.error('An error occurred while fetching the existing user:', listError);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};


export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user)
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
}
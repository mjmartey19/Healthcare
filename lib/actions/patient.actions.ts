"use server";

import { ID, Query } from "node-appwrite";

import { InputFile } from "node-appwrite/file"

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
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

//GET USER AUTH INFO
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

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};
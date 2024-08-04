import { DATABASE_ID, databases, PATIENT_COLLECTION_ID } from "../appwrite.config";

export const createUser = async (user: CreateUserParams) => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            JSON.stringify(user),
            ['*']
        );

        return response;
    } catch (error) {
        console.error(error);
    }
}
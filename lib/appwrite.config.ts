import * as sdk from 'node-appwrite'

export const {
    PROJECT_ID, 
    API_KEY, 
    DATABASE_ID, 
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID, 
    APPOINTMENT_COLLECTION_ID, 
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID, 
    NEXT_PUBLIC_ENDPOINT: ENDPOINT

} = process.env //Destructure

const client = new sdk.Client();

client
    .setEndpoint(ENDPOINT!) //! means leting appwrite know the endpoint actually exist
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);


export const databases = new sdk.Databases(client); //Database functionality
export const storage = new sdk.Storage(client); //Storage Functionality
export const messaging = new sdk.Messaging(client); //Message Functionality
export const users = new sdk.Users(client); //Auth functionality
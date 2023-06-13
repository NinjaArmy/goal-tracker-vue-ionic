import { Client, Account, ID, Databases } from "appwrite";
import { ref } from "vue";

const accountRef = ref<Account>();
const databaseRef = ref<Databases>();
export const useAppwrite = () => {
    const client = new Client()
        .setEndpoint(import.meta.env.VITE_ENDPOINT) // Your API Endpoint
        .setProject(import.meta.env.VITE_PROJECT);               // Your project ID

    accountRef.value = new Account(client);
    databaseRef.value = new Databases(client);

    return {
        account : accountRef,
        database: databaseRef,
        ID,
        CONFIG: {
            DATABASE_ID : import.meta.env.VITE_DATABASE_ID,
            COLLECTION_ID : import.meta.env.VITE_COLLCTION_ID
        }
    }
}

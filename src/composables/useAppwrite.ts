import { Client, Account, ID } from "appwrite";
import { ref } from "vue";

const accountRef = ref();
export const useAppwrite = () => {
    const client = new Client()
        .setEndpoint(import.meta.env.VITE_ENDPOINT) // Your API Endpoint
        .setProject(import.meta.env.VITE_PROJECT);               // Your project ID

    accountRef.value = new Account(client);
    return {
        account : accountRef,
        ID,
    }
}

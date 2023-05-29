import { ref } from "vue";
import { useAppwrite } from "./useAppwrite";

const accountRef = ref();
export const useAppwriteAccount = () => {
    const { account, ID } = useAppwrite();

    const getCurrentUser = async() => {
        return account.value.get();
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await account.value.createEmailSession(
                email,
                password,
            );
            return { error: undefined, data: response }
        } catch (error) {
            return { error, data: undefined }
        }
    };
    
    const logout = async() => {
        try {
            const response = await account.value.deleteSession("current");
            return { error: undefined, data: response }
        } catch (error) {
            return { error, data: undefined }
        }
    };

    const createAccount = async (email: string, password: string, name: string) => {
        try {
            const response = await account.value.create(
                ID.unique(),
                email,
                password,
                name
            );
            return { error: undefined, data: response }
        } catch (error) {
            return { error, data: undefined }
        }

    }

    return {
        createAccount,
        getCurrentUser,
        login,
        logout,
    }
}

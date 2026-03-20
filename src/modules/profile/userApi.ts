import apiClient from "@/src/lib/apiClient";
import {ProfileInfo} from "@/src/modules/profile/useProfileHook";


const userApi = {
    getMe: () =>
        apiClient.get('/users/me'),

    updateInfo: (data: Pick<ProfileInfo, 'firstName' | 'lastName'>) =>
        apiClient.patch('/users/me', data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        apiClient.patch('/users/me/password', data),
};

export default userApi;

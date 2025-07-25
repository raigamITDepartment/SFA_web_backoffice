
import axios from 'axios';
import { AuthService_URL } from '../configs/Config';

export const fetchDepartments = async (token: string) => {

    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/department`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );
        return response.data.payload.map((dep: any) => ({
            label: dep.departmentName,
            value: dep.id,
        }));
    } catch (error: any) {
        console.error('Error fetching departments:', error);
        throw new Error(error.response?.data?.message || 'Failed to load departments.');
    }
};

export const fetchTerritories = async () => {
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/territory`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((territory: any) => ({
            label: territory.territoryName,
            value: territory.id,
        }));
    } catch (error: any) {
        console.error('Error fetching territories:', error);
        throw new Error(error.response?.data?.message || 'Failed to load territories.');
    }
};

export const fetchRegions = async () => {
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/region`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((region: any) => ({
            label: region.regionName,
            value: region.id,
        }));
    } catch (error: any) {
        console.error('Error fetching regions:', error);
        throw new Error(error.response?.data?.message || 'Failed to load regions.');
    }
}

export const fetchChannels = async () => {
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/channel`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );
        const activeChannels = response.data.payload.filter(
            (channel: any) => channel.isActive === true
        );

        return activeChannels.map((channel: any) => ({
            label: channel.channelName,
            value: channel.id,
        }));
    } catch (error: any) {
        console.error('Error fetching channels:', error);
        throw new Error(error.response?.data?.message || 'Failed to load channels.');
    }
}

export const fetchSubChannels = async () => {
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/subChannel`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((subChannel: any) => ({
            label: subChannel.subChannelName,
            value: subChannel.id,
        }));
    } catch (error: any) {
        console.error('Error fetching sub channels:', error);
        throw new Error(error.response?.data?.message || 'Failed to load sub channels.');
    }
}

export const fetchAreas = async () => {
    
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/area`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );
        const activeAreas = response.data.payload.filter(
            (channel: any) => channel.isActive === true
        );

        return activeAreas.map((area: any) => ({
            label: area.areaName,
            value: area.id,
        }));
    } catch (error: any) {
        console.error('Error fetching areas:', error);
        throw new Error(error.response?.data?.message || 'Failed to load areas.');
    }
}

export const fetchRanges = async () => {
    try {

        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/range`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((range: any) => ({
            label: range.rangeName,
            value: range.id,
        }));
    } catch (error: any) {
        console.error('Error fetching ranges:', error);
        throw new Error(error.response?.data?.message || 'Failed to load ranges.');
    }
}

export const fetchAgencies = async () => {
    try {

        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/agency`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((agency: any) => ({
            label: agency.agencyName,
            value: agency.id,
        }));
    } catch (error: any) {
        console.error('Error fetching agencies:', error);
        throw new Error(error.response?.data?.message || 'Failed to load agencies.');
    }
}

export const fetchUsers = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/user`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );
        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching users:', error);
        throw new Error(error.response?.data?.message || 'Failed to load users.');
    }
};

export const deleteUser = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/user/deactivateUser/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting user:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete user.');
    }
};

export const fetchUserTypes = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/user_type`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );
         return response.data.payload.map((userType: any) => ({
            label: userType.userTypeName,
            value: userType.id
        }));
    } catch (error: any) {
        console.error('Error fetching user types:', error);
        throw new Error(error.response?.data?.message || 'Failed to load user types.');
    }
};

export const fetchUserRoles = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/role`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );
         return response.data.payload.map((role: any) => ({
            label: role.roleName,
            value: role.id
        }));
    } catch (error: any) {
        console.error('Error fetching roles:', error);
        throw new Error(error.response?.data?.message || 'Failed to load roles.');
    }
};

export const fetchGrades = async (token: string) => {

    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/subRole`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );
        return response.data.payload.map((subRole: any) => ({
            label: subRole.subRoleName,
            value: subRole.id,
        }));
    } catch (error: any) {
        console.error('Error fetching sub roles:', error);
        throw new Error(error.response?.data?.message || 'Failed to load sub roles.');
    }
};

export const getTerritoriesByAreaId = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/territory/byAreaId/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );
         return response.data.payload.map((territory: any) => ({
            label: territory.territoryName,
            value: territory.id
        }));
    } catch (error: any) {
        console.error('Error fetching territory by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch territory by area Id.');
    }
};

//sign up user
export interface SignupPayload {
    roleId: number;
    subRoleId: number;
    continentId: number | null;
    countryId: number | null;
    channelId: number | null;
    subChannelId: number | null;
    regionId: number | null;
    rangeId: number | null;
    areaList: number[]
    territoryId: number | null;
    agencyId: number | null;
    userLevelId: number;
    userName: string;
    firstName: string;
    lastName: string;
    perMail: string;
    address1: string;
    address2: string;
    address3: string;
    perContact: string;
    email: string;
    password: string;
    mobileNo: string;
    isActive: boolean;
    gpsStatus: boolean;
    superUserId: number;
    
}

export const signupUser = async (payload: SignupPayload) => {
    try {
        const response = await axios.post(
            `${AuthService_URL}/api/v1/auth/signup`,
            payload,
            {
                timeout: 10000,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error during signup:', error, payload);
        throw new Error(error.response?.data?.message || 'Signup failed.');
    }
};

//edit user
export const getUserById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/user/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching user by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch user by Id.');
    }
};

export interface UpdateUserPayload {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobileNo: string;
    isActive: boolean;
    gpsStatus: boolean;
    superUserId: number;
}
export const updateUser = async (payload: UpdateUserPayload, token: string) => {
    try {
        const response = await axios.put(
            `${AuthService_URL}/api/v1/userDemarcation/user`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error during user update:', error, payload);
        throw new Error(error.response?.data?.message || 'User update failed.');
    }
};


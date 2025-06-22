import axios from 'axios';
import { AuthService_URL } from '../configs/Config';
import { channel } from 'diagnostics_channel';


//channel APIs
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
        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching channels:', error);
        throw new Error(error.response?.data?.message || 'Failed to load channels.');
    }
};

export const deleteChannel = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/channel`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting channel:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete channel.');
    }
};

export interface AddChannelPayload {
    userId: number;
    countryId: number | null;
    channelName: string;
    channelCode: string;
    isActive: boolean;    
}

export const addNewChannel = async (payload: AddChannelPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/channel`,
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
        console.error('Error during adding new channel:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new channel failed.');
    }
};


//sub channel APIs
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
        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching sub channels:', error);
        throw new Error(error.response?.data?.message || 'Failed to load sub channels.');
    }
};

export const deleteSubChannel = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/subChannel`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting subChannel:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete subChannel.');
    }
};

export interface AddChannelPayload {
    userId: number;
    channelId: number | null;
    subChannelName: string;
    subChannelCode: string;
    isActive: boolean;    
}

export const addNewSubChannel = async (payload: AddChannelPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/subChannel`,
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
        console.error('Error during adding new sub channel:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new sub channel failed.');
    }
};

export const getAllSubChannelsByChannelId = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/subChannel/byChannelId/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );
         return response.data.payload.map((subChannel: any) => ({
            label: subChannel.subChannelName,
            value: subChannel.id
        }));
    } catch (error: any) {
        console.error('Error fetching subchannel by channel Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch  subchannel by channel Id.');
    }
};



//region APIs
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
        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching regions:', error);
        throw new Error(error.response?.data?.message || 'Failed to load regions.');
    }
}
export interface AddRegionPayload {
    userId: number;
    channelId: number | null;
    subChannelId: number | null;
    regionName: string;
    regionCode: string;
    isActive: boolean;    
}

export const addNewRegion = async (payload: AddChannelPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/region`,
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
        console.error('Error during adding new sub channel:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new sub channel failed.');
    }
};

export const getAllRegionsBySubChannelId = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/region/bySubChannelId/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );
         return response.data.payload.map((subChannel: any) => ({
            label: subChannel.subChannelName,
            value: subChannel.id
        }));
    } catch (error: any) {
        console.error('Error fetching region by subchannel Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch region by subchannel.');
    }
};

export const deleteRegion = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/region`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting region:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete region.');
    }
};




//area APIs
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

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching areas:', error);
        throw new Error(error.response?.data?.message || 'Failed to load areas.');
    }
}

export interface AddAreaPayload {
    userId: number;
    regionId: number | null;
    areaName: string;
    areaCode: string;
    displayOrder: number,
    isActive: boolean;
}

export const addNewArea = async (payload: AddAreaPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/area`,
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
        console.error('Error during adding new sub channel:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new sub channel failed.');
    }
};

export const deleteArea = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/area`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting area:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete area.');
    }
};



//territories APIs
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

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching territories:', error);
        throw new Error(error.response?.data?.message || 'Failed to load territories.');
    }
};

export interface AddTerritoryPayload {
    userId: number;
    rangeId: number | null;
    areaId: number | null;
    territoryName: string;
    territoryCode: string,
    displayOrder: number,
    isActive: boolean;
}

export const addNewTerritory = async (payload: AddTerritoryPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/territory`,
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
        console.error('Error during adding new territory:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new territory failed.');
    }
};

export const deleteTerritory = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/territory`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting territory:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete territory.');
    }
};


//routes APIs
export const fetchRoutes = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/route`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching routes:', error);
        throw new Error(error.response?.data?.message || 'Failed to load routes.');
    }
};
export interface AddRoutePayload {
    userId: number;
    territoryId: number | null;
    routeName: string;
    routeCode: string,
    displayOrder: number,
    isActive: boolean;
}

export const addNewRoute = async (payload: AddRoutePayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/route`,
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
        console.error('Error during adding new route:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new route failed.');
    }
};

export const fetchRoutesOptions = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/route`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((route: any) => ({
            label: route.routeName,
            value: route.id
        }));
    } catch (error: any) {
        console.error('Error fetching route:', error);
        throw new Error(error.response?.data?.message || 'Failed to load route.');
    }
};

export const deleteRoute = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/route`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting route:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete route.');
    }
};



//agencies APIs
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

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching agencies:', error);
        throw new Error(error.response?.data?.message || 'Failed to load agencies.');
    }
};
export interface AddAgencyPayload {
    userId: number;
    channelId: number | null;
    agencyName: string;
    agencyCode: string,
    bankGuarantee: string,
    creditLimit: string,
    latitude: string,
    longitude: string,
    isActive: boolean;
}

export const addNewAgency = async (payload: AddAgencyPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/agency`,
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
        console.error('Error during adding new agency:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new agency failed.');
    }
};

export const deleteAgency = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/agency`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting agency:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete agency.');
    }
};



//country APIs
export const fetchCountry = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/country`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((country: any) => ({
            label: country.countryName,
            value: country.id
        }));
    } catch (error: any) {
        console.error('Error fetching country:', error);
        throw new Error(error.response?.data?.message || 'Failed to load country.');
    }
};












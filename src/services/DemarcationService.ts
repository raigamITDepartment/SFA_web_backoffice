import axios from 'axios';
import { AuthService_URL } from '../configs/Config';
import { channel } from 'diagnostics_channel';
import { co } from '@fullcalendar/core/internal-common';


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
            `${AuthService_URL}/api/v1/userDemarcation/channel/deactivateChannel/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
export const getChannelById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/channel/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching channel by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch channel by Id.');
    }
};
export interface UpdateChannelPayload {
    userId: number;
    countryId: number | null;
    channelName: string;
    channelCode: string;
    isActive: boolean;    
}
export const updateChannel = async (payload: UpdateSubChannelPayload, token: string) => {
    try {
        const response = await axios.put(
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
        console.error('Error during channel update:', error, payload);
        throw new Error(error.response?.data?.message || 'Channel update failed.');
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
            `${AuthService_URL}/api/v1/userDemarcation/subChannel/deactivateSubChannel/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
export interface AddSubChannelPayload {
    userId: number;
    channelId: number | null;
    subChannelName: string;
    subChannelCode: string;
    isActive: boolean;    
}
export const addNewSubChannel = async (payload: AddSubChannelPayload) => {
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
        const activeSubChannels = response.data.payload.filter(
            (channel: any) => channel.isActive === true
        );

        return activeSubChannels.map((subChannel: any) => ({
            label: subChannel.subChannelName,
            value: subChannel.id
        }));
    } catch (error: any) {
        console.error('Error fetching subchannel by channel Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch  subchannel by channel Id.');
    }
};
export interface UpdateSubChannelPayload {
    id: number;
    channelId: number | null;
    userId: number;
    subChannelName: string;
    subChannelCode: string;
    isActive: boolean;
}
export const updateSubChannel = async (payload: UpdateSubChannelPayload, token: string) => {
    try {
        const response = await axios.put(
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
        console.error('Error during channel update:', error, payload);
        throw new Error(error.response?.data?.message || 'Channel update failed.');
    }
};
export const getSubChannelById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/subChannel/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching subchannel by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch subchannel by Id.');
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
        const activeRegions = response.data.payload.filter(
            (channel: any) => channel.isActive === true
        );
         return activeRegions.map((regions: any) => ({
            label: regions.regionName,
            value: regions.id
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
            `${AuthService_URL}/api/v1/userDemarcation/region/deactivateRegion/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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

export const getRegionById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/region/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching region by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch region by Id.');
    }
};
export interface UpdateRegionPayload {
    id: number;
    channelId: number | null;
    subChannelId: number | null;
    userId: number;
    regionName: string;
    regionCode: string;
    isActive: boolean;
}
export const updateRegion = async (payload: UpdateRegionPayload, token: string) => {
    try {
        const response = await axios.put(
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
        console.error('Error during region update:', error, payload);
        throw new Error(error.response?.data?.message || 'Region update failed.');
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
            `${AuthService_URL}/api/v1/userDemarcation/area/deactivateArea/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
export interface UpdateAreaPayload {
    id: number;
    userId: number;
    areaName: string;
    areaCode: string;
    isActive: boolean;
    displayOrder: number;
}
export const updateArea = async (payload: UpdateAreaPayload, token: string) => {
    try {
        const response = await axios.put(
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
        console.error('Error during area update:', error, payload);
        throw new Error(error.response?.data?.message || 'Area update failed.');
    }
};
export const getAreaById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/area/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching area by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch area by Id.');
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
    subChannelId: number | null;
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
            `${AuthService_URL}/api/v1/userDemarcation/territory/deactivateTerritory/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
export interface UpdateTerritoryPayload {
    id: number;
    regionId: number | null;
    subChannelId: number | null;
    userId: number;
    areaName: string;
    areaCode: string;
    isActive: boolean;
    displayOrder: number;
}
export const updateTerritory = async (payload: UpdateTerritoryPayload, token: string) => {
    try {
        const response = await axios.put(
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
        console.error('Error during territory update:', error, payload);
        throw new Error(error.response?.data?.message || 'Territory update failed.');
    }
};
export const getTerritoryById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/territory/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching territory by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch territory by Id.');
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


//routes APIs  T id 
export const fetchRoutesByTerritoryId = async (territoryId: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/route/byTerritoryId/${territoryId}`,
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
    routeCode: number,
    oldRouteId: number;
    oldRouteCode: number;
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
            `${AuthService_URL}/api/v1/userDemarcation/route/deactivateRoute/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
export const getRouteById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/route/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching route by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch route by Id.');
    }
};

export interface UpdateRoutePayload {
    id: number;
    territoryId: number | null;
    userId: number;
    routeName: string;
    routeCode: string;
    isActive: boolean;
    displayOrder: number;
}
export const updateRoute = async (payload: UpdateRoutePayload, token: string) => {
    try {
        const response = await axios.put(
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
        console.error('Error during route update:', error, payload);
        throw new Error(error.response?.data?.message || 'Route update failed.');
    }
};

//Shop APIs 
export const fetchShopsbyRouteId = async (route: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/outlet/getAllOutletsByRouteId/${route}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        console.log("Fetched shops:", response.data.payload);
        return response.data.payload;

    } catch (error: any) {
        console.error('Error fetching routes:', error);
        throw new Error(error.response?.data?.message || 'Failed to load routes.');
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
    agencyCode: number | null,
    territoryId: number | null;
    oldAgencyCode: number | null;
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
            `${AuthService_URL}/api/v1/userDemarcation/agency/deactivateAgency/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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

export const getAgencyById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/agency/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching agency by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch agency by Id.');
    }
};

export interface UpdateAgencyPayload {
    userId: number;
    channelId: number | null;
    agencyName: string;
    agencyCode: number | null,
    territoryId: number | null;
    oldAgencyCode: number | null;
    isActive: boolean;
}
export const updateAgency = async (payload: UpdateAgencyPayload, token: string) => {
    try {
        const response = await axios.put(
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
        console.error('Error during agency update:', error, payload);
        throw new Error(error.response?.data?.message || 'Agency update failed.');
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





//arearegion mapping
export const fetchAreaRegion = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/areaRegions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching areaRegions:', error);
        throw new Error(error.response?.data?.message || 'Failed to load areaRegions.');
    }
};
export const deleteAreaRegion = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/areaRegions/deactivateAreaRegion/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting areaRegions:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete areaRegions.');
    }
};
export interface AreaRegionDTO {
    userId: number;
    areaId: number;
    regionId: number;
    isActive: boolean;
}

export interface MapAreaRegionPayload {
    areaRegionsDTOList: AreaRegionDTO[];
}

export const mapAreaRegion = async (payload: MapAreaRegionPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/areaRegions`,
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
        console.error('Error during mapping:', error, payload);
        throw new Error(error.response?.data?.message || 'Mapping failed.');
    }
};

export const getAreaRegionById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/areaRegions/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching areaRegions by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch areaRegions by Id.');
    }
};

export interface UpdateAreaRegionPayload {
    id: number;
    userId: number;
    areaId: number | null;
    regionId: number | null;
    isActive: boolean;
}
export const updateAreaRegion = async (payload: UpdateAreaRegionPayload, token: string) => {
    try {
        const response = await axios.put(
            `${AuthService_URL}/api/v1/userDemarcation/areaRegions`,
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
        console.error('Error during areaRegions update:', error, payload);
        throw new Error(error.response?.data?.message || 'areaRegions update failed.');
    }
};



//distributor mapping
//creation 
export const fetchDistributors = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/distributor`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching distributors:', error);
        throw new Error(error.response?.data?.message || 'Failed to load distributors.');
    }
};
export const deleteDistributor = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/distributor/deactivateDistributor/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting distributors:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete distributors.');
    }
};
export const distributorOptions = async () => {

    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/distributor`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );
        const activeDistributors= response.data.payload.filter(
            (distributor: any) => distributor.isActive === true
        );

        return activeDistributors.map((distributor: any) => ({
            label: distributor.distributorName,
            value: distributor.id,
        }));

    } catch (error: any) {
        console.error('Error fetching distributor:', error);
        throw new Error(error.response?.data?.message || 'Failed to load distributor.');
    }
};
export interface DistributorPayload {
    userId: number;
    distributorName: string;
    email: string;
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
    mobileNo: string;
    isActive: boolean;
}
export const addNewDistributor = async (payload: DistributorPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/distributor`,
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
        console.error('Error during adding new distributor:', error, payload);
        throw new Error(error.response?.data?.message || 'Add new distributor failed.');
    }
};
export const getDistributorById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/distributor/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching distributor by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch distributor by Id.');
    }
};
export interface UpdateDistributorPayload {
    userId: number;
    distributorName: string;
    email: string;
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
    mobileNo: string;
    isActive: boolean;
}
export const updateDistributor = async (payload: UpdateDistributorPayload, token: string) => {
    try {
        const response = await axios.put(
            `${AuthService_URL}/api/v1/userDemarcation/distributor`,
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
        console.error('Error during areaRegions update:', error, payload);
        throw new Error(error.response?.data?.message || 'areaRegions update failed.');
    }
};
//agency mapping
export const fetchAgencyDistributors = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/agencyDistributor`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching agency distributors:', error);
        throw new Error(error.response?.data?.message || 'Failed to load agency distributors.');
    }
};
export const deleteAgencyDistributors  = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/agencyDistributor/deactivateAgencyDistributor/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting distributors:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete distributors.');
    }
};
export interface AgencyMappingDTO {
    userId: number;
    agencyId: number | null;
    distributorId: number | null;
    isActive: boolean;
}
export interface MapAgencyPayload {
    agencyDistributorDTOList: AgencyMappingDTO[];
}
export const mapAgency = async (payload: MapAgencyPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.post(
            `${AuthService_URL}/api/v1/userDemarcation/agencyDistributor`,
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
        console.error('Error during mapping:', error, payload);
        throw new Error(error.response?.data?.message || 'Mapping failed.');
    }
};
export const findAgencyDistributorById = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/agencyDistributor/findById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error fetching agencyDistributor by Id:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch agencyDistributor by Id.');
    }
};
export interface UpdateDistributorAgencyPayload {
    userId: number;
    agencyId: number | null;
    distributorId: number | null;
    agencyCode:number | null;
    isActive: boolean;
}
export const updateDistributorAgency = async (payload: UpdateDistributorAgencyPayload, token: string) => {
    try {
        const response = await axios.put(
            `${AuthService_URL}/api/v1/userDemarcation/agencyDistributor`,
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
        console.error('Error during agencyDistributor update:', error, payload);
        throw new Error(error.response?.data?.message || 'agencyDistributor update failed.');
    }
};
//distributor warehouse
export const fetchDistributorWarehouses = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            `${AuthService_URL}/api/v1/userDemarcation/agencyWarehouse`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching agencyWarehouse:', error);
        throw new Error(error.response?.data?.message || 'Failed to load agencyWarehouse.');
    }
};

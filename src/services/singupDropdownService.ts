
import axios from 'axios';

export const fetchDepartments = async (token: string) => {
    try {
        const response = await axios.get(
            'https://api-gateway-711667297937.asia-south1.run.app/api/v1/userDemarcation/department',
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

export const fetchRegion = async (token: string) => {
    try {
        const response = await axios.get(
            'https://api-gateway-711667297937.asia-south1.run.app/api/v1/userDemarcation/region',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((reg: any) => ({
            label: reg.regionName,
            value: reg.id,
        }));
    } catch (error: any) {
        console.error('Error fetching region', error);
        throw new Error(error.response?.data?.message || 'Failed to load reagion.');
    }
};

export const fetchTerritories = async (token: string) => {
    try {
        const response = await axios.get(
            'https://api-gateway-711667297937.asia-south1.run.app/api/v1/userDemarcation/territory',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((territory: any) => ({
            label: territory.territoryName,
            value: territory.territoryCode,
        }));
    } catch (error: any) {
        console.error('Error fetching territories:', error);
        throw new Error(error.response?.data?.message || 'Failed to load territories.');
    }
};

export const fetchRegions = async (token: string) => {
    try {
        const response = await axios.get(
            'https://api-gateway-711667297937.asia-south1.run.app/api/v1/userDemarcation/region',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((region: any) => ({
            label: region.regionName,
            value: region.regionCode,
        }));
    } catch (error: any) {
        console.error('Error fetching regions:', error);
        throw new Error(error.response?.data?.message || 'Failed to load regions.');
    }
}

export const fetchChannels = async (token: string) => {
    try {
        const response = await axios.get(
            'https://api-gateway-711667297937.asia-south1.run.app/api/v1/userDemarcation/channel',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((channel: any) => ({
            label: channel.channelName,
            value: channel.channelCode,
        }));
    } catch (error: any) {
        console.error('Error fetching channels:', error);
        throw new Error(error.response?.data?.message || 'Failed to load channels.');
    }
}

export const fetchAreas = async (token: string) => {
    try {
        const response = await axios.get(
            'https://api-gateway-711667297937.asia-south1.run.app/api/v1/userDemarcation/area',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((area: any) => ({
            label: area.areaName,
            value: area.areaCode,
        }));
    } catch (error: any) {
        console.error('Error fetching areas:', error);
        throw new Error(error.response?.data?.message || 'Failed to load areas.');
    }
}

export const fetchRanges = async (token: string) => {
    try {
        const response = await axios.get(
            'https://api-gateway-711667297937.asia-south1.run.app/api/v1/userDemarcation/range',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            }
        );

        return response.data.payload.map((range: any) => ({
            label: range.rangeName,
            value: range.rangeCode,
        }));
    } catch (error: any) {
        console.error('Error fetching ranges:', error);
        throw new Error(error.response?.data?.message || 'Failed to load ranges.');
    }
}
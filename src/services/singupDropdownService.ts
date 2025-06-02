
import axios from 'axios';
import { getToken } from '../utils/authUtils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.8.90:8080';

export const fetchDepartments = async () => {
export const fetchDepartments = async () => {
    const token = getToken();
    if (!token) {
        throw new Error('No token provided or token has expired');
    }

    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.get(
            'https://api-gateway-441978242392.us-central1.run.app/api/v1/userDemarcation/department',
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

export const fetchRegion = async () => {
export const fetchRegion = async () => {
    const token = getToken();
    if (!token) {
        throw new Error('No token provided or token has expired');
    }

    try {

           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
<<<<<<< HEAD
            'https://api-gateway-441978242392.us-central1.run.app/api/v1/userDemarcation/region',
=======
            `${BASE_URL}/api/v1/userDemarcation/region`,
>>>>>>> 0602bd8cbb59c5407d8c479b4a31ee17f5267703
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

export const fetchTerritories = async () => {
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            'https://api-gateway-441978242392.us-central1.run.app/api/v1/userDemarcation/territory',
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

export const fetchRegions = async () => {
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            'https://api-gateway-441978242392.us-central1.run.app/api/v1/userDemarcation/region',
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

export const fetchChannels = async () => {
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            'https://api-gateway-441978242392.us-central1.run.app/api/v1/userDemarcation/channel',
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

export const fetchAreas = async () => {
    
    try {
           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            'https://api-gateway-441978242392.us-central1.run.app/api/v1/userDemarcation/area',
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

export const fetchRanges = async () => {
    try {

           const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');
        const response = await axios.get(
            'https://api-gateway-441978242392.us-central1.run.app/api/v1/userDemarcation/range',
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
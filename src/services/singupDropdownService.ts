import axios from 'axios';
import { getToken } from '../utils/authUtils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.8.90:8080';

export const fetchDepartments = async () => {
    const token = getToken();
    if (!token) {
        throw new Error('No token provided or token has expired');
    }

    try {
        const response = await axios.get(
            `${BASE_URL}/api/v1/arcation/department`,
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
    const token = getToken();
    if (!token) {
        throw new Error('No token provided or token has expired');
    }

    try {
        const response = await axios.get(
            `${BASE_URL}/api/v1/userDemarcation/region`,
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
        console.error('Error fetching region:', error);
        throw new Error(error.response?.data?.message || 'Failed to load region.');
    }
};
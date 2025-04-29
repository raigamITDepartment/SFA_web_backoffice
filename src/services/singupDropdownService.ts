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
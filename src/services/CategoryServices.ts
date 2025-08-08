import axios from 'axios'
import { AuthService_URL } from '../configs/Config'

//category APIs
export const fetchCategories = async () => {
    try {
        const token = sessionStorage.getItem('accessToken')

        if (!token) throw new Error('No access token found.')
        const response = await axios.get(
            `${AuthService_URL}/api/v1/sales/categoryType`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            },
        )
        console.log('Fetched categories successfully:', response.data)
        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching categories:', error)
        throw new Error(
            error.response?.data?.message || 'Failed to load categories.',
        )
    }
}

export const deleteCategory = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken')

        if (!token) throw new Error('No access token found.')

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/userDemarcation/channel/deactivateChannel/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            },
        )

        return response.data.payload
    } catch (error: any) {
        console.error('Error deleting category:', error)
        throw new Error(
            error.response?.data?.message || 'Failed to delete category.',
        )
    }
}
export interface AddCategoryPayload {
    userId: number
    categoryType: string
    isActive: boolean
}
export const addNewCategory = async (payload: AddCategoryPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken')

        if (!token) throw new Error('No access token found.')
        const response = await axios.post(
            `${AuthService_URL}/api/v1/sales/categoryType`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            },
        )
        console.log('New category added successfully:', response.data)
        return response.data
    } catch (error: any) {
        console.error('Error during adding new category:', error, payload)
        throw new Error(
            error.response?.data?.message || 'Add new category failed.',
        )
    }
}

export const fetchMainCategoriesAll = async () => {
    try {
        const token = sessionStorage.getItem('accessToken')

        if (!token) throw new Error('No access token found.')
        const response = await axios.get(
            `${AuthService_URL}/api/v1/sales/itemMainCategory`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            },
        )
        console.log('Fetched main categories successfully:', response.data)
        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching main categories:', error)
        throw new Error(
            error.response?.data?.message || 'Failed to load main categories.',
        )
    }
}

export interface UpdateMainCategoryPayload {
    id: string
    userId: number
    itemMainCat: string
    mainCatSeq: string
    isActive?: boolean
    catTypeId?: number | null
}
export const updateMainCategory = async (
    payload: UpdateMainCategoryPayload,
    token: string,
) => {
    try {
        const response = await axios.put(
            `${AuthService_URL}/api/v1/sales/itemMainCategory`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            },
        )
        return response.data
    } catch (error: any) {
        console.error('Error during main category update:', error, payload)
        throw new Error(
            error.response?.data?.message || 'Main category update failed.',
        )
    }
}

export interface AddMainCategoryPayload {
    userId: number;
    catTypeId: number | null;
    itemMainCat: string;
    isActive: boolean;
}
export const addNewMainCategory = async (payload: AddMainCategoryPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken')

        if (!token) throw new Error('No access token found.')
        const response = await axios.post(
            `${AuthService_URL}/api/v1/sales/itemMainCategory`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            },
        )
        console.log('New main category added successfully:', response.data)
        return response.data
    } catch (error: any) {
        console.error('Error during adding new main category:', error, payload)
        throw new Error(
            error.response?.data?.message || 'Add new main category failed.',
        )
    }
}


export const deleteMainCategory = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/sales/itemMainCategory/deactivateItemMainCategory/${id}`,
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




export const fetchSubCategoriesAll = async () => {
    try {
        const token = sessionStorage.getItem('accessToken')

        if (!token) throw new Error('No access token found.')
        const response = await axios.get(
            `${AuthService_URL}/api/v1/sales/itemSubCategoryOne`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000, // Set timeout to 10 seconds
            },
        )
        console.log('Fetched main categories successfully:', response.data)
        return response.data.payload
    } catch (error: any) {
        console.error('Error fetching Sub categories:', error)
        throw new Error(
            error.response?.data?.message || 'Failed to load Sub categories.',
        )
    }
}

export interface UpdateSubCategoryPayload {
    id: string;
    userId: number;
    mainCatId: number;
    subCatSeq: number;
    subCatOneName: string;
    isActive: boolean;
}
export const updateSubCategory = async (
    payload: UpdateSubCategoryPayload,
    token: string,
) => {
    try {
        const response = await axios.put(
            `${AuthService_URL}/api/v1/sales/itemSubCategoryOne`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            },
        )

        console.log('succ paylod.............. ', payload)
        return response.data
    } catch (error: any) {
        console.error('Error during sub category update:', error, payload)
        throw new Error(
            error.response?.data?.message || 'Sub category update failed.',
        )
    }
}

export interface AddSubCategoryPayload {
    userId: number
    mainCatId: number | null
    subCatOneName: string
    isActive: boolean
}
export const addNewSubCategory = async (payload: AddSubCategoryPayload) => {
    try {
        const token = sessionStorage.getItem('accessToken')

        if (!token) throw new Error('No access token found.')
        const response = await axios.post(
            `${AuthService_URL}/api/v1/sales/itemSubCategoryOne`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            },
        )
        console.log('New sub category added successfully:', response.data)
        return response.data
    } catch (error: any) {
        console.error('Error during adding sub category:', error, payload)
        throw new Error(
            error.response?.data?.message || 'Add new sub category failed.',
        )
    }
}


export const deleteSubCategory = async (id: number | string) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) throw new Error('No access token found.');

        const response = await axios.delete(
            `${AuthService_URL}/api/v1/sales/itemSubCategoryOne/deactivateItemSubCategoryOne/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000,
            }
        );

        return response.data.payload;
    } catch (error: any) {
        console.error('Error deleting subcategory:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete subcategory.');
    }
};


export const isTokenExpired = (token: string): boolean => {
    try {
        // Validate token format (must have 3 parts separated by dots)
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid token format');
            return true; // Treat invalid token as expired
        }

        const payload = JSON.parse(atob(parts[1])); // Decode JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return payload.exp < currentTime; // Check if token is expired
    } catch (error) {
        console.error('Invalid token:', error);
        return true; // Treat invalid token as expired
    }
};

export const getToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No token found in localStorage');
        return '';
    }

    if (isTokenExpired(token)) {
        console.error('Token has expired or is invalid');
        localStorage.removeItem('authToken'); // Clear invalid token
        return '';
    }

    return token;
};

export const clearToken = () => {
    localStorage.removeItem('authToken');
    console.log('Invalid token cleared from localStorage');
};
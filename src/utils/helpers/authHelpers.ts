export const getUserRole = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    return user?.role
}

export const getUserSubRole = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    return user?.subRole
}

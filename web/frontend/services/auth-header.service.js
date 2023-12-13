const AuthHeaderService = async () => {
    return `Bearer ${localStorage.getItem('token')}`
}

export {
    AuthHeaderService
}
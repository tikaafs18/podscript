export const registerAction = (data) => {
    localStorage.removeItem('eshopLog')
    return {
        type: "REGISTER_SUCCESS",
        payload: data
    }
}

export const loginAction = (data) => {
    return {
        type: "LOGIN_SUCCESS",
        payload: data
    }
}

export const logoutAction = () => {
    localStorage.removeItem('userLog')
    localStorage.removeItem('emailLog')
    localStorage.removeItem('verifLog')
    localStorage.removeItem('hasilVerifEmail')
    localStorage.removeItem('profileLog')

    return {
        type: "LOGOUT_SUCCESS"
    }
}

export const editProfileAction = (data) => {
    return {
        type: "EDITPROFILE_SUCCESS",
        payload: data
    }
}
const INITIAL_STATE = {
    username: '',
    email: '',
    idusers: '',
    status: 'UNVERIFIED',
    login: 'false',
    profilepic: '',
    fullname: '',
    bio: '',
    done: 'nok'
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "REGISTER_SUCCESS":
            return {
                ...state,
                ...action.payload,
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                ...action.payload,
            };
        case "EDITPROFILE_SUCCESS":
            return {
                ...state,
                ...action.payload,
            };
        case "LOGOUT_SUCCESS":
            return (INITIAL_STATE);
        default:
            return state;
    }
}
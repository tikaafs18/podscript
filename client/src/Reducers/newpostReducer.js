const INITIAL_STATE = {
    image: '',
    idpost: '',
    datecreated: '',
    caption:''
}

export const newpostReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "NEWPOST_SUCCESS":
            return {
                ...state,
                ...action.payload
            }
        case "UPLOAD_SUCCESS":
            return (INITIAL_STATE);
        default:
            return state;
    }
}
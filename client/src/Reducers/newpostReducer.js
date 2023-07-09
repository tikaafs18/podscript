// const INITIAL_STATE = {
//     username: '',
//     image: '',
//     idusers: '',
//     idpost: '',
//     profilepic: '',
//     caption:'',
//     datecreated:'',
//     like:0
// }

// export const newpostReducer = (state = INITIAL_STATE, action) => {
//     switch (action.type) {
//         case "COMMENT_SUCCESS":
//             // console.log("Ini data yang didapat di reducer Login", action);
//             // console.log("Ini data yang didapat di reducer REGISTER SUCCESS", action.payload);

//             return {
//                 ...state,
//                 ...action.payload,
//             };
//         default:
//             return state;
//     }
// }

const INITIAL_STATE = {
    image: '',
    idpost: '',
    datecreated: '',
    caption:''
}

export const newpostReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "NEWPOST_SUCCESS":
            console.log("Ini data yang didapat di reducer NEW POST", action.payload);

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
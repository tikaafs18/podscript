export const commentAction = (data) => {
    return {
        type: "COMMENT_SUCCESS",
        payload: data
    }
}

export const newpostAction = (data) => {
    return {
        type: "NEWPOST_SUCCESS",
        payload: data
    }
}

export const uploadedAction = () => {
    return {
        type: "UPLOAD_SUCCESS",
    }
}
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { newpostReducer } from "./newpostReducer";

export const rootStore = configureStore({
    reducer:{
        userReducer,
        newpostReducer
    }
})
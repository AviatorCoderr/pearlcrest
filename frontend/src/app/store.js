import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/authentication.js'
export const store = configureStore({
    reducer: authReducer
})
import { createSlice, nanoid } from "@reduxjs/toolkit";
const initialState = {
    users: {
        flatnumber: null,
        position: null
    }
}

export const authenticationSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUser: (state, action) => {
            const user = {
                flatnumber: action.payload.flatnumber,
                position: action.payload.position
            }
            state.users = user
        },
        logoutUser: (state, action) => {
            const user = {
                flatnumber: null,
                position: null
            }
            state.users = user
        }
    }
})

export const {getUser, logoutUser} = authenticationSlice.actions
export default authenticationSlice.reducer
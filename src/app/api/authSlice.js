import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: false,
  user: null
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload.user
    },
    loggedOut: (state) => {
      state.isAuthenticated = false
      state.user = null
    }
  }
})

export const { loggedIn, loggedOut } = authSlice.actions

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token

export default authSlice.reducer

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: false,
  user: null
}

const authSlice = createSlice({
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
export default authSlice.reducer

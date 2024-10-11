import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null // Optional: for token-based auth
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
    },
    loggedOut: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
    }
  }
})

// Export actions for use in components
export const { loggedIn, loggedOut } = authSlice.actions

// Selectors to access auth state
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token

export default authSlice.reducer

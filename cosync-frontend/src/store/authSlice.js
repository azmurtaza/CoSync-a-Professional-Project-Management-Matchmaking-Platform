import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem('cosync_token')
const user = JSON.parse(localStorage.getItem('cosync_user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user,
    token: token,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('cosync_token', action.payload.token)
      localStorage.setItem('cosync_user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('cosync_token')
      localStorage.removeItem('cosync_user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
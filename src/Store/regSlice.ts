import { createSlice } from '@reduxjs/toolkit'

const storedUser = JSON.parse(localStorage.getItem('user') || '{}') || {
  email: '',
  userName: '',
  urlImage: '',
  password: '',
}

const regSlice = createSlice({
  name: 'reg',
  initialState: {
    user: storedUser,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

export const { setUser, logout } = regSlice.actions
export default regSlice.reducer

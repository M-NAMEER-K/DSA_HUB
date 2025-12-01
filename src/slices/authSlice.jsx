import {createSlice} from "@reduxjs/toolkit"


const savedSignup = localStorage.getItem("signupData");

const initialState = {
  signupData: savedSignup ? JSON.parse(savedSignup) : null,
  loading: false,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
};










const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

// Function to retrieve stored user credentials from localStorage
const getStoredCredentials = () => {
  const storedCredentials = localStorage.getItem('userCredentials');
  return storedCredentials ? JSON.parse(storedCredentials) : {
    token: null,
    name: null,
    email: null,
    role: null
  }; // Default to null values if no credentials are stored
};

const authSlice = createSlice({
  name: 'userDetail',
  initialState: getStoredCredentials(), // Initialize state with stored credentials or default values
  reducers: {
    login: (state, action) => {
      const { token, name, email, role } = action.payload;
      state.token = token;
      state.name = name;
      state.email = email;
      state.role = role;

      // Save user credentials to localStorage
      localStorage.setItem('userCredentials', JSON.stringify({ token, name, email, role }));
      console.log("Login successful");
    },
    logout: (state) => {
      state.token = null;
      state.name = null;
      state.email = null;
      state.role = null;

      // Remove user credentials from localStorage
      localStorage.removeItem('userCredentials');
      console.log("Logged out");
    }
  },
});

// Export the actions for use in components
export const { login, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;

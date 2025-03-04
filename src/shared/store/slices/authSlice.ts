import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "shared/api/api";
import Cookies from "js-cookie";

// const API_BASE_URL = "https://consult-fozz.onrender.com/";
const API_BASE_URL = "http://127.0.0.1:8000/";

export const register = createAsyncThunk(
  "auth/register",
  async (
    { role, formData }: { role: string; formData: any },
    { rejectWithValue }
  ) => {
    try {
      const endpoint =
        role === "specialists"
          ? "ru/auth/users/student/registration/"
          : "ru/auth/users/business/";

      const response = await axiosInstance.post(
        `${API_BASE_URL}${endpoint}`,
        formData
      );
      // const response = await axiosInstance.post(endpoint, formData);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { general: "Something went wrong" }
      );
    }
  }
);

interface ErrorType {
  [key: string]: string;
}


//Login


export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("ru/auth/token/login/", {
        username,
        password,
      });

      const token = response.data.auth_token;

      Cookies.set("auth_token", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      console.log("Token saved in cookies:", Cookies.get("auth_token")); // Проверка
    } catch (error) {
      console.error("Login failed:", error);
      return rejectWithValue(
        error.response?.data || { general: "Invalid credentials" }
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null as ErrorType | null,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object" && action.payload !== null
            ? (action.payload as ErrorType)
            : { general: String(action.payload || "Unknown error") };
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "object" && action.payload !== null
            ? (action.payload as ErrorType)
            : { general: String(action.payload || "Invalid credentials") };
      });
  },
});

export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { ErrorType } from "@/src/types/error.type";

import {
  saveTokenToSessionStorage,
  removeTokenFromSessionStorage,
  decodeTokenToUser,
} from "../utils/handleToken";

import {
  saveUserToSessionStorage,
  removeUserFromSessionStorage,
} from "../utils/handleUser";
import { OtpType } from "@/src/types/otp.type";
import {
  getOtpFromSessionStorage,
  removeOtpFromSessionStorage,
  saveOtpToSessionStorage,
} from "../utils/handleOtp";

export interface AuthState {
  isLogin: boolean;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  isLogin: false,
  loading: false,
  error: "",
};

interface SignInResponse {
  accessToken: string;
  role_name?: string;
}

export const login = createAsyncThunk<
  SignInResponse,
  { email: string; password: string }
>("auth/signIn", async (data, thunkAPI) => {
  try {
    const response = await http.post<SignInResponse>("/auth/signin", {
      email: data.email,
      password: data.password,
    });

    saveTokenToSessionStorage(response.data.accessToken);

    const user = decodeTokenToUser(response.data.accessToken);
    saveUserToSessionStorage(user);

    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as ErrorType)?.response?.data?.message
    );
  }
});

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (accessToken: any, thunkAPI) => {
    try {
      const response = await http.post<SignInResponse>("/auth/google/login", {
        token: accessToken,
      });

      saveTokenToSessionStorage(response.data.accessToken);

      const user = decodeTokenToUser(response.data.accessToken);
      saveUserToSessionStorage(user);

      return user;
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const register = createAsyncThunk<any, any>(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await http.post<any>("/auth/signup", {
        email: data.email,
        password: data.password,
      });

      // console.log(response);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const sendOtpRegister = createAsyncThunk<OtpType, any>(
  "auth/sendOtpRegister",
  async (data, thunkAPI) => {
    try {
      const response = await http.post<OtpType>("/email/sendOtpRegister", {
        email: data.email,
      });

      saveOtpToSessionStorage(response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const verifyOtp = createAsyncThunk<string, any>(
  "auth/verifyOtp",
  async (data, thunkAPI) => {
    try {
      const otp = getOtpFromSessionStorage();

      const response = await http.post<any>("/email/verifyOtp", {
        ...data,
        ...otp,
      });

      removeOtpFromSessionStorage();

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      removeTokenFromSessionStorage();
      removeUserFromSessionStorage();
    },
  },
  extraReducers: (builder) => {
    //login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isLogin = true;
      state.error = "";
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    //login With Google
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.isLogin = true;
      state.error = "";
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    //register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //send Otp Register
    builder.addCase(sendOtpRegister.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(sendOtpRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(sendOtpRegister.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //verify Otp
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

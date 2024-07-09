import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { ErrorType } from "@/src/types/error.type";

import {
  saveTokenToSessionStorage,
  removeTokenFromSessionStorage,
  decodeTokenToUser,
  getConfigHeader,
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
  status?: boolean;
}

export const login = createAsyncThunk(
  "auth/signIn",
  async (data: any, thunkAPI) => {
    try {
      const response = await http.post<SignInResponse>("/auth/signin", {
        email: data.email,
        password: data.password,
      });

      const configHeader = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${response.data.accessToken}`,
        },
      };

      const resGetProfile = await http.get<any>(
        `/users/${data.email}`,
        configHeader
      );

      console.log("resGetProfile", resGetProfile);

      saveTokenToSessionStorage(response.data.accessToken);

      const userData = {
        ...resGetProfile.data,
        ...decodeTokenToUser(response.data.accessToken),
      };

      saveUserToSessionStorage(userData);

      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

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
      console.log(error);
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

export const checkEmailExist = createAsyncThunk(
  "auth/checkEmailExist",
  async (email: string, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/auth/checkEmailExist?email=${email}`,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getAllAdmin = createAsyncThunk(
  "auth/getAllAdmin",
  async (_, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/auth/all/admin`,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const createNewBusinessByBusinessName = createAsyncThunk(
  "auth/createNewBusinessByBusinessName",
  async (data: any, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `auth/createNewBusiness`,
        data,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (dataBody: any, thunkAPI) => {
    try {
      const response = await http.patch<any>(
        `auth/changePassword`,
        dataBody,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      console.log(error);
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

    //checkEmailExist
    builder.addCase(checkEmailExist.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(checkEmailExist.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(checkEmailExist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //getAllAdmin
    builder.addCase(getAllAdmin.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getAllAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(getAllAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //createNewBusinessByBusinessName
    builder.addCase(createNewBusinessByBusinessName.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(
      createNewBusinessByBusinessName.fulfilled,
      (state, action) => {
        state.loading = false;
        state.error = "";
      }
    );
    builder.addCase(
      createNewBusinessByBusinessName.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );
    //changePassword
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { UserType } from "@/src/types/user.type";
import {
  getConfigHeader,
  getTokenFromSessionStorage,
} from "../utils/handleToken";
import { ErrorType } from "@/src/types/error.type";

export interface UserState {
  token: string | null;
  loadingUser: boolean;
  error: string;
}

const initialState: UserState = {
  token: null,
  loadingUser: false,
  error: "",
};

interface SearchUserByEmailParams {
  roleName: string;
  searchEmail: string;
}

export const getAllUser = createAsyncThunk(
  "user/getAllUser",
  async (page: number, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/users/?page=${page}`,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      // console.log('error', error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const searchUserByEmail = createAsyncThunk(
  "user/searchUserByEmail",
  async ({ roleName, searchEmail }: SearchUserByEmailParams, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // console.log('api', searchEmail);
    try {
      const response = await http.get<any>(
        `/users/search/${roleName}/${searchEmail}`,
        configHeader
      );

      return response.data;
    } catch (error) {
      // console.log('error', error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getProfileUser = createAsyncThunk(
  "user/getProfileUser",
  async (email: any, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(`/users/${email}`, configHeader);

      return response.data;
    } catch (error) {
      // console.log('error', error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (data: any, thunkAPI) => {
    try {
      const response = await http.patch<any>(
        `/users/update-profile`,
        data,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get All User by admin
    builder.addCase(getAllUser.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllUser.rejected, (state, action) => {
      state.loadingUser = false;
      state.error = action.payload as string;
    });

    //search User By Email
    builder.addCase(searchUserByEmail.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(searchUserByEmail.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(searchUserByEmail.rejected, (state, action) => {
      state.loadingUser = false;
      state.error = action.payload as string;
    });

    //get Profile User
    builder.addCase(getProfileUser.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(getProfileUser.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getProfileUser.rejected, (state, action) => {
      state.loadingUser = false;
      state.error = action.payload as string;
    });

    //updateUserProfile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loadingUser = false;
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;

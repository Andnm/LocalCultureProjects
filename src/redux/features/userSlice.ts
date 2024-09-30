import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import {
  BusinessInfoListSheet,
  CheckBusinessInfoType,
  CheckResponsibleInfoType,
  ProviderAccountType,
  UserType,
} from "@/src/types/user.type";
import {
  getConfigHeader,
  getConfigHeaderMultipartFormData,
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
  async (_, thunkAPI) => {
    try {
      const response = await http.get<any>(`/users`, getConfigHeader());

      return response.data;
    } catch (error) {
      // console.log('error', error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

//check xem có match với những thông tin đã có trong database
export const checkBusinessInfo = createAsyncThunk(
  "user/checkBusinessInfo",
  async (businessInfo: CheckBusinessInfoType, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/users/checkBusinessInfo`,
        businessInfo,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

//check xem có match với những thông tin đã có trong database
export const checkResponsibleInfo = createAsyncThunk(
  "user/checkResponsibleInfo",
  async (responsiblePersonInfo: CheckResponsibleInfoType, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/users/checkResponsibleInfo`,
        responsiblePersonInfo,
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

export const searchResponsibleByEmail = createAsyncThunk(
  "user/searchResponsibleByEmail",
  async (searchEmail: any, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/users/searchResponsible/${searchEmail}`,
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

export const searchUserForAdmin = createAsyncThunk(
  "user/searchUserForAdmin",
  async ({ roleName, searchEmail }: SearchUserByEmailParams, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/users/searchUserForAdmin/${searchEmail}/${roleName}`,
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

export const providerAccount = createAsyncThunk(
  "user/providerAccount",
  async (dataBody: ProviderAccountType, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/auth/providerAccount/admin`,
        dataBody,
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

export const provideAccountResponsible = createAsyncThunk(
  "user/provideAccountResponsible",
  async (dataBody: ProviderAccountType, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/auth/provideAccountResponsible/admin`,
        dataBody,
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

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (email: any, thunkAPI) => {
    try {
      const response = await http.delete<any>(
        `/users/deleteAccount/${email}`,
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

export const banAccount = createAsyncThunk(
  "user/banAccount",
  async (email: any, thunkAPI) => {
    try {
      const response = await http.patch<any>(
        `users/banAccount/${email}`,
        [],
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

export const unBanAccount = createAsyncThunk(
  "user/unBanAccount",
  async (email: any, thunkAPI) => {
    try {
      const response = await http.patch<any>(
        `users/unBanAccount/${email}`,
        [],
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

export const updateProfileNotAuth = createAsyncThunk(
  "user/updateProfileNotAuth",
  async (data: any, thunkAPI) => {
    // console.log("data update", data);
    try {
      const response = await http.patch<any>(
        `users/update-profile-not-auth`,
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

export const getAllBusinessInfo = createAsyncThunk(
  "user/getAllBusinessInfo",
  async (_, thunkAPI) => {
    // console.log("data update", data);
    try {
      const response = await http.get<BusinessInfoListSheet[]>(
        `business`,
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

export const uploadFileBusinessInfo = createAsyncThunk(
  "user/uploadFileBusinessInfo",
  async (data: any, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `business/import`,
        data,
        getConfigHeaderMultipartFormData()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const clearBusinessInfo = createAsyncThunk(
  "user/clearBusinessInfo",
  async (_, thunkAPI) => {
    try {
      const response = await http.delete<any>(
        `business/`,
        getConfigHeaderMultipartFormData()
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

    //check Business Info
    builder.addCase(checkBusinessInfo.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(checkBusinessInfo.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(checkBusinessInfo.rejected, (state, action) => {
      state.loadingUser = false;
      state.error = action.payload as string;
    });

    //check Responsible Info
    builder.addCase(checkResponsibleInfo.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(checkResponsibleInfo.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(checkResponsibleInfo.rejected, (state, action) => {
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

    //search Responsible By Email
    builder.addCase(searchResponsibleByEmail.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(searchResponsibleByEmail.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(searchResponsibleByEmail.rejected, (state, action) => {
      state.loadingUser = false;
      state.error = action.payload as string;
    });

    //search User For Admin
    builder.addCase(searchUserForAdmin.pending, (state) => {
      state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(searchUserForAdmin.fulfilled, (state, action) => {
      state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(searchUserForAdmin.rejected, (state, action) => {
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

    //deleteUser
    builder.addCase(deleteUser.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });

    //banAccount
    builder.addCase(banAccount.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(banAccount.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(banAccount.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });

    //unBanAccount
    builder.addCase(unBanAccount.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(unBanAccount.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(unBanAccount.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });

    //updateProfileNotAuth
    builder.addCase(updateProfileNotAuth.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(updateProfileNotAuth.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateProfileNotAuth.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });

    //providerAccount
    builder.addCase(providerAccount.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(providerAccount.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(providerAccount.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });

    //provideAccountResponsible
    builder.addCase(provideAccountResponsible.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(provideAccountResponsible.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(provideAccountResponsible.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });

    //getAllBusinessInfo
    builder.addCase(getAllBusinessInfo.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(getAllBusinessInfo.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllBusinessInfo.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });

    //uploadFileBusinessInfo
    builder.addCase(uploadFileBusinessInfo.pending, (state) => {
      // state.loadingUser = true;
      state.error = "";
    });
    builder.addCase(uploadFileBusinessInfo.fulfilled, (state, action) => {
      // state.loadingUser = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(uploadFileBusinessInfo.rejected, (state, action) => {
      // state.loadingUser = false;
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;

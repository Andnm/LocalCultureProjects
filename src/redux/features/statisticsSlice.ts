import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { UserType } from "@/src/types/user.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { ErrorType } from "@/src/types/error.type";

export interface StatisticsState {
  token: string | null;
  loadingStatistics: boolean;
  error: string;
}

const initialState: StatisticsState = {
  token: null,
  loadingStatistics: false,
  error: "",
};

export const statisticsAccount = createAsyncThunk(
  "statistics/statisticsAccount",
  async (_, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(
        `/users/admin/statisticsAccount`,
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

export const statisticsBusinessFollowProvince = createAsyncThunk(
  "statistics/statisticsBusinessFollowProvince",
  async (_, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(
        `/users/admin/statisticsBusinessFollowProvince`,
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

export const statisticsProject = createAsyncThunk(
  "statistics/statisticsProject",
  async (_, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(
        `/projects/admin/statisticsProject`,
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

export const statisticsSpecializationField = createAsyncThunk(
  "statistics/statisticsSpecializationField",
  async (_, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(
        `/projects/admin/statisticsSpecializationField`,
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

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //statistics Account
    builder.addCase(statisticsAccount.pending, (state) => {
      state.loadingStatistics = true;
      state.error = "";
    });
    builder.addCase(statisticsAccount.fulfilled, (state, action) => {
      state.loadingStatistics = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(statisticsAccount.rejected, (state, action) => {
      state.loadingStatistics = false;
      state.error = action.payload as string;
    });

    //statisticsBusinessFollowProvince
    builder.addCase(statisticsBusinessFollowProvince.pending, (state) => {
      state.loadingStatistics = true;
      state.error = "";
    });
    builder.addCase(
      statisticsBusinessFollowProvince.fulfilled,
      (state, action) => {
        state.loadingStatistics = false;
        // state.data = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      statisticsBusinessFollowProvince.rejected,
      (state, action) => {
        state.loadingStatistics = false;
        state.error = action.payload as string;
      }
    );

    //statisticsProject
    builder.addCase(statisticsProject.pending, (state) => {
      state.loadingStatistics = true;
      state.error = "";
    });
    builder.addCase(statisticsProject.fulfilled, (state, action) => {
      state.loadingStatistics = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(statisticsProject.rejected, (state, action) => {
      state.loadingStatistics = false;
      state.error = action.payload as string;
    });

    //statisticsSpecializationField
    builder.addCase(statisticsSpecializationField.pending, (state) => {
      state.loadingStatistics = true;
      state.error = "";
    });
    builder.addCase(
      statisticsSpecializationField.fulfilled,
      (state, action) => {
        state.loadingStatistics = false;
        // state.data = action.payload;
        state.error = "";
      }
    );
    builder.addCase(statisticsSpecializationField.rejected, (state, action) => {
      state.loadingStatistics = false;
      state.error = action.payload as string;
    });
  },
});

export default statisticsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { ErrorType } from "@/src/types/error.type";
import { getConfigHeader } from "../utils/handleToken";

export interface ResponsiblePersonState {
  data: any | null;
  loadingSupport: boolean;
  error: string;
}

const initialState: ResponsiblePersonState = {
  data: null,
  loadingSupport: false,
  error: "",
};

export const createNewSupport = createAsyncThunk(
  "support/createNewSupport",
  async (dataBody: any, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/support`,
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

export const getAllSupport = createAsyncThunk(
  "support/getAllSupport",
  async (_, thunkAPI) => {
    try {
      const response = await http.get<any>(`/support`, getConfigHeader());

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createNewSupport
    builder.addCase(createNewSupport.pending, (state) => {
      state.loadingSupport = true;
      state.error = "";
    });
    builder.addCase(createNewSupport.fulfilled, (state, action) => {
      state.loadingSupport = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createNewSupport.rejected, (state, action) => {
      state.loadingSupport = false;
      state.error = action.payload as string;
    });

    //getAllSupport
    builder.addCase(getAllSupport.pending, (state) => {
      state.loadingSupport = true;
      state.error = "";
    });
    builder.addCase(getAllSupport.fulfilled, (state, action) => {
      state.loadingSupport = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllSupport.rejected, (state, action) => {
      state.loadingSupport = false;
      state.error = action.payload as string;
    });
  },
});

export default supportSlice.reducer;

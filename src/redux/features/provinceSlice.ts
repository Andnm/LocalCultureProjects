import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { ErrorType } from "@/src/types/error.type";
import { getConfigHeader } from "../utils/handleToken";
import axios from "axios";

export interface ResponsiblePersonState {
  data: any | null;
  loadingProvince: boolean;
  error: string;
}

const initialState: ResponsiblePersonState = {
  data: null,
  loadingProvince: false,
  error: "",
};

export const getPublicProvinces = createAsyncThunk(
  "province/getPublicProvinces",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "https://vapi.vnappmob.com/api/province/"
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

export const getPublicDistrict = createAsyncThunk<any>(
  "province/getPublicDistrict",
  async (provinceId, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/district/${provinceId}`
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

export const getPublicWard = createAsyncThunk<any>(
  "province/getPublicWard",
  async (districtId, thunkAPI) => {

    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/ward/${districtId}`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const provinceSlice = createSlice({
  name: "province",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //getPublicProvinces
    builder.addCase(getPublicProvinces.pending, (state) => {
      state.loadingProvince = true;
      state.error = "";
    });
    builder.addCase(getPublicProvinces.fulfilled, (state, action) => {
      state.loadingProvince = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getPublicProvinces.rejected, (state, action) => {
      state.loadingProvince = false;
      state.error = action.payload as string;
    });

    //getPublicDistrict
    builder.addCase(getPublicDistrict.pending, (state) => {
      state.loadingProvince = true;
      state.error = "";
    });
    builder.addCase(getPublicDistrict.fulfilled, (state, action) => {
      state.loadingProvince = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getPublicDistrict.rejected, (state, action) => {
      state.loadingProvince = false;
      state.error = action.payload as string;
    });

    //getPublicWard
    builder.addCase(getPublicWard.pending, (state) => {
      state.loadingProvince = true;
      state.error = "";
    });
    builder.addCase(getPublicWard.fulfilled, (state, action) => {
      state.loadingProvince = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getPublicWard.rejected, (state, action) => {
      state.loadingProvince = false;
      state.error = action.payload as string;
    });
  },
});

export default provinceSlice.reducer;

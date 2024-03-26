import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import {
  getConfigHeader,
  getTokenFromSessionStorage,
} from "../utils/handleToken";
import { EvidenceType } from "@/src/types/evidence.type";

export interface ResponsiblePersonState {
  data: any | null;
  loadingResPerson: boolean;
  error: string;
}

const initialState: ResponsiblePersonState = {
  data: null,
  loadingResPerson: false,
  error: "",
};

export const createResponsiblePerson = createAsyncThunk(
  "responsiblePerson/createResponsiblePerson",
  async (dataBody: any, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/responsible-person`,
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

export const checkExistResponsiblePersonByEmail = createAsyncThunk(
  "responsiblePerson/checkExistResponsiblePersonByEmail",
  async (email: string, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/responsible-person/check-responsible-person-exist/${email}`,
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

export const responsiblePersonSlice = createSlice({
  name: "responsiblePerson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createResponsiblePerson
    builder.addCase(createResponsiblePerson.pending, (state) => {
      state.loadingResPerson = true;
      state.error = "";
    });
    builder.addCase(createResponsiblePerson.fulfilled, (state, action) => {
      state.loadingResPerson = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createResponsiblePerson.rejected, (state, action) => {
      state.loadingResPerson = false;
      state.error = action.payload as string;
    });
  },
});

export default responsiblePersonSlice.reducer;

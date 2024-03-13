import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { EvidenceType } from "@/src/types/evidence.type";

export interface SummaryReportStatus {
  data: EvidenceType | null;
  loadingSummaryReport: boolean;
  error: string;
}

const initialState: SummaryReportStatus = {
  data: null,
  loadingSummaryReport: false,
  error: "",
};

export const getSummaryReportByProjectId = createAsyncThunk(
  "summaryReport/getSummaryReportByProjectId",
  async (projectId: number, thunkAPI) => {
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
        `/summary-report/${projectId}`,
        configHeader
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const upSummaryReportByLeader = createAsyncThunk(
  "summaryReport/upSummaryReportByLeader",
  async (bodyData: any, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.post<any>(
        `/summary-report`,
        bodyData,
        configHeader
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const updateSummaryReportByLeader = createAsyncThunk(
  "summaryReport/updateSummaryReportByLeader",
  async (bodyData: any, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.patch<any>(
        `/summary-report`,
        bodyData,
        configHeader
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const confirmSummaryReport = createAsyncThunk(
  "summaryReport/confirmSummaryReport",
  async (bodyData: any, thunkAPI) => {
    console.log(bodyData)
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.patch<any>(
        `/summary-report/confirm/`,
        bodyData,
        configHeader
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const summaryReportSlice = createSlice({
  name: "summaryReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //getSummaryReportByProjectId
    builder.addCase(getSummaryReportByProjectId.pending, (state) => {
      state.loadingSummaryReport = true;
      state.error = "";
    });
    builder.addCase(getSummaryReportByProjectId.fulfilled, (state, action) => {
      state.loadingSummaryReport = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getSummaryReportByProjectId.rejected, (state, action) => {
      state.loadingSummaryReport = false;
      state.error = action.payload as string;
    });

    //up Summary Report By Leader
    builder.addCase(upSummaryReportByLeader.pending, (state) => {
      state.loadingSummaryReport = true;
      state.error = "";
    });
    builder.addCase(upSummaryReportByLeader.fulfilled, (state, action) => {
      state.loadingSummaryReport = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(upSummaryReportByLeader.rejected, (state, action) => {
      state.loadingSummaryReport = false;
      state.error = action.payload as string;
    });

    //update Summary Report By Leader
    builder.addCase(updateSummaryReportByLeader.pending, (state) => {
      state.loadingSummaryReport = true;
      state.error = "";
    });
    builder.addCase(updateSummaryReportByLeader.fulfilled, (state, action) => {
      state.loadingSummaryReport = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateSummaryReportByLeader.rejected, (state, action) => {
      state.loadingSummaryReport = false;
      state.error = action.payload as string;
    });
  },
});

export default summaryReportSlice.reducer;

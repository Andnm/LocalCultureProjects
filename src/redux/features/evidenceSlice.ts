import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { EvidenceType } from "@/src/types/evidence.type";

export interface EvidenceStatus {
  data: EvidenceType | null;
  loadingEvidence: boolean;
  error: string;
}

const initialState: EvidenceStatus = {
  data: null,
  loadingEvidence: false,
  error: "",
};

interface CreateEvidenceBody {
    description: string,
    evidence_url: string,
    costId: number
}

export const createEvidence = createAsyncThunk(
  "evidence/createEvidence",
  async (dataBody: CreateEvidenceBody, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.post<any>(`/evidences`, dataBody, configHeader);

      console.log("dataBody", dataBody)
      return response.data;
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getEvidenceInCost = createAsyncThunk(
  "evidence/getEvidenceInCost",
  async (costId: number, thunkAPI) => {
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
        `/evidences/cost/${costId}`,
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

export const evidenceSlice = createSlice({
  name: "evidence",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create evidence
    builder.addCase(createEvidence.pending, (state) => {
      state.loadingEvidence = true;
      state.error = "";
    });
    builder.addCase(createEvidence.fulfilled, (state, action) => {
      state.loadingEvidence = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createEvidence.rejected, (state, action) => {
      state.loadingEvidence = false;
      state.error = action.payload as string;
    });

    //get all evidence in phase 
    builder.addCase(getEvidenceInCost.pending, (state) => {
      state.loadingEvidence = true;
      state.error = "";
    });
    builder.addCase(getEvidenceInCost.fulfilled, (state, action) => {
      state.loadingEvidence = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getEvidenceInCost.rejected, (state, action) => {
      state.loadingEvidence = false;
      state.error = action.payload as string;
    });
  },
});

export default evidenceSlice.reducer;

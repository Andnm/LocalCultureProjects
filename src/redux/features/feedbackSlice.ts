import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import {
  getConfigHeader,
  getTokenFromSessionStorage,
} from "../utils/handleToken";
import { EvidenceType } from "@/src/types/evidence.type";
import {
  PostFeedbackType,
  UpdateFeedbackType,
} from "@/src/types/feedback.type";

export interface MessageStatus {
  data: any | null;
  loadingFeedback: boolean;
  error: string;
}

const initialState: MessageStatus = {
  data: null,
  loadingFeedback: false,
  error: "",
};

export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async (dataBody: PostFeedbackType, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/feedback`,
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

export const getFeedbackByProjectId = createAsyncThunk(
  "feedback/getFeedbackByProjectId",
  async (projectId: number, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/feedback/project/${projectId}`,
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

interface UpdateFeedbackRequest {
  dataBody: UpdateFeedbackType;
  feedbackId: number;
}

export const updateFeedbackByProjectId = createAsyncThunk(
  "feedback/updateFeedbackByProjectId",
  async ({ dataBody, feedbackId }: UpdateFeedbackRequest, thunkAPI) => {
    try {
      const response = await http.patch<any>(
        `/feedback/${feedbackId}`,
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

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create feedback
    builder.addCase(createFeedback.pending, (state) => {
      state.loadingFeedback = true;
      state.error = "";
    });
    builder.addCase(createFeedback.fulfilled, (state, action) => {
      state.loadingFeedback = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createFeedback.rejected, (state, action) => {
      state.loadingFeedback = false;
      state.error = action.payload as string;
    });
    //getFeedbackByProjectId
    builder.addCase(getFeedbackByProjectId.pending, (state) => {
      state.loadingFeedback = true;
      state.error = "";
    });
    builder.addCase(getFeedbackByProjectId.fulfilled, (state, action) => {
      state.loadingFeedback = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getFeedbackByProjectId.rejected, (state, action) => {
      state.loadingFeedback = false;
      state.error = action.payload as string;
    });
    //updateFeedbackByProjectId
    builder.addCase(updateFeedbackByProjectId.pending, (state) => {
      state.loadingFeedback = true;
      state.error = "";
    });
    builder.addCase(updateFeedbackByProjectId.fulfilled, (state, action) => {
      state.loadingFeedback = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateFeedbackByProjectId.rejected, (state, action) => {
      state.loadingFeedback = false;
      state.error = action.payload as string;
    });
  },
});

export default feedbackSlice.reducer;

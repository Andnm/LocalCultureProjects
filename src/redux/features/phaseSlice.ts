import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";

export interface PhaseState {
  data: PhaseType | null;
  loadingPhase: boolean;
  error: string;
}

const initialState: PhaseState = {
  data: null,
  loadingPhase: false,
  error: "",
};

interface CreatePhaseBody {
  phase_start_date: string;
  phase_expected_end_date: string;
  projectId: number;
  groupId: number;
}

export const createPhase = createAsyncThunk(
  "phase/createPhase",
  async (dataBody: CreatePhaseBody, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log(dataBody)

    try {
      const response = await http.post<any>(`/phases`, dataBody, configHeader);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getPhaseByProjectId = createAsyncThunk(
  "phase/getProjectById",
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
        `/phases/${projectId}`,
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

interface ChangeStatusProps {
  phaseId: number;
  phaseStatus: string;
}

export const changeStatusPhaseByBusiness = createAsyncThunk(
  "phase/changeStatusPhaseByBusiness",
  async ({ phaseId, phaseStatus }: ChangeStatusProps, thunkAPI) => {
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
        `/phases/changeStatus/${phaseId}/${phaseStatus}`,
        [],
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

interface UploadFeedbackProps {
  phaseId: number;
  feedback: string;
}
export const uploadFeedback = createAsyncThunk(
  "phase/uploadFeedback",
  async (dataBody: UploadFeedbackProps, thunkAPI) => {
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
        `/phases/uploadFeedback`,
        dataBody,
        configHeader
      );

      return response.data;
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const phaseSlice = createSlice({
  name: "phase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create phase
    builder.addCase(createPhase.pending, (state) => {
      state.loadingPhase = true;
      state.error = "";
    });
    builder.addCase(createPhase.fulfilled, (state, action) => {
      state.loadingPhase = false;
      state.error = "";
    });
    builder.addCase(createPhase.rejected, (state, action) => {
      state.loadingPhase = false;
      state.error = action.payload as string;
    });

    //get phase by project id
    builder.addCase(getPhaseByProjectId.pending, (state) => {
      state.loadingPhase = true;
      state.error = "";
    });
    builder.addCase(getPhaseByProjectId.fulfilled, (state, action) => {
      state.loadingPhase = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getPhaseByProjectId.rejected, (state, action) => {
      state.loadingPhase = false;
      state.error = action.payload as string;
    });

    //change Status Phase By Business
    builder.addCase(changeStatusPhaseByBusiness.pending, (state) => {
      state.loadingPhase = true;
      state.error = "";
    });
    builder.addCase(changeStatusPhaseByBusiness.fulfilled, (state, action) => {
      state.loadingPhase = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(changeStatusPhaseByBusiness.rejected, (state, action) => {
      state.loadingPhase = false;
      state.error = action.payload as string;
    });

    //upload feedback
    builder.addCase(uploadFeedback.pending, (state) => {
      state.loadingPhase = true;
      state.error = "";
    });
    builder.addCase(uploadFeedback.fulfilled, (state, action) => {
      state.loadingPhase = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(uploadFeedback.rejected, (state, action) => {
      state.loadingPhase = false;
      state.error = action.payload as string;
    });
  },
});

export default phaseSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { NotificationType } from "@/src/types/notification.type";

export interface NotificationStatus {
  data: NotificationType | null;
  loadingNotification: boolean;
  error: string;
}

const initialState: NotificationStatus = {
  data: null,
  loadingNotification: false,
  error: "",
};

export const getAllNotification = createAsyncThunk(
  "notification/getAllNotification",
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
      const response = await http.get<any>(`/notifications`, configHeader);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

interface DataBodyNotiType {
  notification_type: string;
  information: string;
  sender_email: string | undefined;
  receiver_email: string;
  note?: number
}

export const createNewNotification = createAsyncThunk(
  "notification/createNewNotification",
  async (dataBodyNoti: DataBodyNotiType, thunkAPI) => {
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
        `/notifications`,
        dataBodyNoti,
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

export const updateAllNotification = createAsyncThunk(
  "notification/updateAllNotification",
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
      const response = await http.patch<any>(
        `/notifications/read-all`,
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

export const updateSelectedNotification = createAsyncThunk(
  "notification/updateSelectedNotification",
  async (id: number, thunkAPI) => {
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
        `/notifications/read/${id}`,
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

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get All Notification
    builder.addCase(getAllNotification.pending, (state) => {
      state.loadingNotification = true;
      state.error = "";
    });
    builder.addCase(getAllNotification.fulfilled, (state, action) => {
      state.loadingNotification = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllNotification.rejected, (state, action) => {
      state.loadingNotification = false;
      state.error = action.payload as string;
    });

    //create New Notification
    builder.addCase(createNewNotification.pending, (state) => {
      state.loadingNotification = true;
      state.error = "";
    });
    builder.addCase(createNewNotification.fulfilled, (state, action) => {
      state.loadingNotification = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createNewNotification.rejected, (state, action) => {
      state.loadingNotification = false;
      state.error = action.payload as string;
    });

    //update All Notification
    builder.addCase(updateAllNotification.pending, (state) => {
      state.loadingNotification = true;
      state.error = "";
    });
    builder.addCase(updateAllNotification.fulfilled, (state, action) => {
      state.loadingNotification = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateAllNotification.rejected, (state, action) => {
      state.loadingNotification = false;
      state.error = action.payload as string;
    });

    //update Selected Notification
    builder.addCase(updateSelectedNotification.pending, (state) => {
      state.loadingNotification = true;
      state.error = "";
    });
    builder.addCase(updateSelectedNotification.fulfilled, (state, action) => {
      state.loadingNotification = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateSelectedNotification.rejected, (state, action) => {
      state.loadingNotification = false;
      state.error = action.payload as string;
    });
  },
});

export default notificationSlice.reducer;

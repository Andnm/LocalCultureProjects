import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { EvidenceType } from "@/src/types/evidence.type";

export interface MessageStatus {
  data: any | null;
  loadingMessage: boolean;
  error: string;
}

const initialState: MessageStatus = {
  data: null,
  loadingMessage: false,
  error: "",
};


export const createMessage = createAsyncThunk(
  "message/createMessage",
  async (dataBody: any, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.post<any>(`/message`, dataBody, configHeader);

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

export const getAllMessages = createAsyncThunk(
  "message/getAllMessages",
  async (identifierUserChat: any, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.get<any>(`/message/${identifierUserChat}`, configHeader);

      return response.data;
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create message
    builder.addCase(createMessage.pending, (state) => {
      state.loadingMessage = true;
      state.error = "";
    });
    builder.addCase(createMessage.fulfilled, (state, action) => {
      state.loadingMessage = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createMessage.rejected, (state, action) => {
      state.loadingMessage = false;
      state.error = action.payload as string;
    });

    //get all messages
    builder.addCase(getAllMessages.pending, (state) => {
      state.loadingMessage = true;
      state.error = "";
    });
    builder.addCase(getAllMessages.fulfilled, (state, action) => {
      state.loadingMessage = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllMessages.rejected, (state, action) => {
      state.loadingMessage = false;
      state.error = action.payload as string;
    });
  },
});

export default messageSlice.reducer;

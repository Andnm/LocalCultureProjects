import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { EvidenceType } from "@/src/types/evidence.type";

export interface UserChatStatus {
  data: any | null;
  loadingUserChat: boolean;
  error: string;
}

const initialState: UserChatStatus = {
  data: null,
  loadingUserChat: false,
  error: "",
};

export const createUserChat = createAsyncThunk(
  "userChat/createUserChat",
  async (dataBody: any, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("dataBody", dataBody);
    console.log("configHeader", configHeader);

    try {
      const response = await http.post<any>(
        `/user-chat`,
        dataBody,
        configHeader
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

export const updateUserChat = createAsyncThunk(
  "userChat/updateUserChat",
  async ({ identifierUserChat, dataBody }: any, thunkAPI) => {
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
        `/user-chat/${identifierUserChat}`,
        dataBody,
        configHeader
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

export const getUserChat = createAsyncThunk(
  "userChat/getUserChat",
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
      const response = await http.get<any>(`/user-chat`, configHeader);

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const userChatSlice = createSlice({
  name: "userChat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create user chat
    builder.addCase(createUserChat.pending, (state) => {
      state.loadingUserChat = true;
      state.error = "";
    });
    builder.addCase(createUserChat.fulfilled, (state, action) => {
      state.loadingUserChat = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createUserChat.rejected, (state, action) => {
      state.loadingUserChat = false;
      state.error = action.payload as string;
    });

    //get UserChat
    builder.addCase(getUserChat.pending, (state) => {
      state.loadingUserChat = true;
      state.error = "";
    });
    builder.addCase(getUserChat.fulfilled, (state, action) => {
      state.loadingUserChat = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getUserChat.rejected, (state, action) => {
      state.loadingUserChat = false;
      state.error = action.payload as string;
    });

    //update UserChat
    builder.addCase(updateUserChat.pending, (state) => {
      state.loadingUserChat = true;
      state.error = "";
    });
    builder.addCase(updateUserChat.fulfilled, (state, action) => {
      state.loadingUserChat = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateUserChat.rejected, (state, action) => {
      state.loadingUserChat = false;
      state.error = action.payload as string;
    });
  },
});

export default userChatSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { RegisterPitchingType } from "@/src/types/register-pitching.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";

export interface PitchingState {
  data: any;
  loadingPitching: boolean;
  error: string;
}

const initialState: PitchingState = {
  data: null,
  loadingPitching: false,
  error: "",
};

//get all register pitching by student
// cái này là sẽ show ra danh sách những DỰ ÁN mà nhóm của student này đã đăng kí
//có thể dùng cho cả LECTURE
export const getAllRegisterPitchingByStudent = createAsyncThunk(
  "pitching/getAllRegisterPitching",
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
      const response = await http.get<any>(`/register-pitching`, configHeader);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getAllRegisterPitchingOfStudentByProjectId = createAsyncThunk(
  "pitching/getAllRegisterPitchingOfStudentByProjectId",
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
        `/register-pitching/student/${projectId}`,
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

//get all register pictching by business (truyền vào project id)
// cái này thì lại sẽ show ra những group đăng kí pitching của dự án nào đó của DN nào đó

export const getAllRegisterPitchingByBusiness = createAsyncThunk(
  "pitching/getAllRegisterPitchingByBusiness",
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
        `/register-pitching/${projectId}`,
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

//register pitching
interface RegisterPitchingBody {
  groupId: number;
  document_url?: string;
  subject_code?: string;
  lecturer_email?: string;
  projectId: number;
}

export const registerPitching = createAsyncThunk(
  "pitching/registerPitching",
  async (dataBody: RegisterPitchingBody, thunkAPI) => {
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
        `/register-pitching`,
        dataBody,
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

//business choose group
export const chooseGroupByBusiness = createAsyncThunk(
  "pitching/chooseGroupByBusiness",
  async ({ groupId, projectId }: RegisterPitchingBody, thunkAPI) => {
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
        `/register-pitching/chooseGroup/${groupId}/${projectId}`,
        [],
        configHeader
      );

      return response.data;
    } catch (error) {
      // console.log(error)
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const pitchingSlice = createSlice({
  name: "pitching",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get all register pitching by student
    builder.addCase(getAllRegisterPitchingByStudent.pending, (state) => {
      state.loadingPitching = true;
      state.error = "";
    });
    builder.addCase(
      getAllRegisterPitchingByStudent.fulfilled,
      (state, action) => {
        state.loadingPitching = false;
        state.error = "";
      }
    );
    builder.addCase(
      getAllRegisterPitchingByStudent.rejected,
      (state, action) => {
        state.loadingPitching = false;
        state.error = action.payload as string;
      }
    );

    //get all register pitching of student BY PROJECT ID
    builder.addCase(getAllRegisterPitchingOfStudentByProjectId.pending, (state) => {
      state.loadingPitching = true;
      state.error = "";
    });
    builder.addCase(
      getAllRegisterPitchingOfStudentByProjectId.fulfilled,
      (state, action) => {
        state.loadingPitching = false;
        state.error = "";
      }
    );
    builder.addCase(
      getAllRegisterPitchingOfStudentByProjectId.rejected,
      (state, action) => {
        state.loadingPitching = false;
        state.error = action.payload as string;
      }
    );

    //get all register pitching by business
    builder.addCase(getAllRegisterPitchingByBusiness.pending, (state) => {
      state.loadingPitching = true;
      state.error = "";
    });
    builder.addCase(
      getAllRegisterPitchingByBusiness.fulfilled,
      (state, action) => {
        state.loadingPitching = false;
        state.error = "";
      }
    );
    builder.addCase(
      getAllRegisterPitchingByBusiness.rejected,
      (state, action) => {
        state.loadingPitching = false;
        state.error = action.payload as string;
      }
    );

    //create register pitching
    builder.addCase(registerPitching.pending, (state) => {
      state.loadingPitching = true;
      state.error = "";
    });
    builder.addCase(registerPitching.fulfilled, (state, action) => {
      state.loadingPitching = false;
      state.error = "";
    });
    builder.addCase(registerPitching.rejected, (state, action) => {
      state.loadingPitching = false;
      state.error = action.payload as string;
    });

    //choose group by business
    builder.addCase(chooseGroupByBusiness.pending, (state) => {
      state.loadingPitching = true;
      state.error = "";
    });
    builder.addCase(chooseGroupByBusiness.fulfilled, (state, action) => {
      state.loadingPitching = false;
      state.error = "";
    });
    builder.addCase(chooseGroupByBusiness.rejected, (state, action) => {
      state.loadingPitching = false;
      state.error = action.payload as string;
    });
  },
});

export default pitchingSlice.reducer;

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
  AddResponsiblePersonType,
  UpdateResponsibleStatusType,
} from "@/src/types/user.type";

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

export const addMoreResponsiblePersonByAdmin = createAsyncThunk(
  "responsiblePerson/addMoreResponsiblePersonByAdmin",
  async (dataBody: AddResponsiblePersonType, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/projects/addResponsiblePersonToProject`,
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

export const removeResponsiblePerson = createAsyncThunk(
  "responsiblePerson/removeResponsiblePerson",
  async ({ projectId, userId }: any, thunkAPI) => {
    try {
      const response = await http.delete<any>(
        `/user-project/removeUser/${projectId}/${userId}`,
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

export const updateResponsibleStatus = createAsyncThunk(
  "responsiblePerson/updateResponsibleStatus",
  async (dataBody: UpdateResponsibleStatusType, thunkAPI) => {
    try {
      const response = await http.put<any>(
        `/user-project/updateResponsibleStatus`,
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

export const checkResponsiblePersonBelongsToBusiness = createAsyncThunk(
  "responsiblePerson/checkResponsiblePersonBelongsToBusiness",
  async (data: any, thunkAPI) => {
    try {
      const response = await http.get<any>(
        `/responsible-person/checkResponsiblePersonBelongsToBusiness?responsiblePersonEmail=${data.responsiblePersonEmail}&businessEmail=${data.businessEmail}`,
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

    //addMoreResponsiblePersonByAdmin
    builder.addCase(addMoreResponsiblePersonByAdmin.pending, (state) => {
      state.loadingResPerson = true;
      state.error = "";
    });
    builder.addCase(
      addMoreResponsiblePersonByAdmin.fulfilled,
      (state, action) => {
        state.loadingResPerson = false;
        //   state.data = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      addMoreResponsiblePersonByAdmin.rejected,
      (state, action) => {
        state.loadingResPerson = false;
        state.error = action.payload as string;
      }
    );

    //removeResponsiblePerson
    builder.addCase(removeResponsiblePerson.pending, (state) => {
      state.loadingResPerson = true;
      state.error = "";
    });
    builder.addCase(removeResponsiblePerson.fulfilled, (state, action) => {
      state.loadingResPerson = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(removeResponsiblePerson.rejected, (state, action) => {
      state.loadingResPerson = false;
      state.error = action.payload as string;
    });

    //updateResponsibleStatus
    builder.addCase(updateResponsibleStatus.pending, (state) => {
      state.loadingResPerson = true;
      state.error = "";
    });
    builder.addCase(updateResponsibleStatus.fulfilled, (state, action) => {
      state.loadingResPerson = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateResponsibleStatus.rejected, (state, action) => {
      state.loadingResPerson = false;
      state.error = action.payload as string;
    });
  },
});

export default responsiblePersonSlice.reducer;

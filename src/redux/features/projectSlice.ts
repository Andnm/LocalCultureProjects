import { createSlice, createAsyncThunk, createAction, PayloadAction } from "@reduxjs/toolkit";
import http from "../utils/https";
import { ProjectType } from "@/src/types/project.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";

export interface ListProjectState {
  data: ProjectType[];
  loadingProjectList: boolean;
  loadingProject: boolean;
  error: string;
}

const initialState: ListProjectState = {
  data: [],
  loadingProjectList: false,
  loadingProject: false,
  error: "",
};

export const createNewProject = createAsyncThunk(
  "listProject/createNewProject",
  async (dataBody: ProjectType, thunkAPI) => {
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
        "/projects",
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

export const getProjectById = createAsyncThunk(
  "listProject/getProjectById",
  async (id: number, thunkAPI) => {
    try {
      const response = await http.get<any>(`/projects/${id}`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getAllProjectByBusiness = createAsyncThunk(
  "listProject/getAllProjectByBusiness",
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
      const response = await http.get<any>("/projects/business", configHeader);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getAllProjectByEveryOne = createAsyncThunk(
  "listProject/getAllProjectByEveryOne",
  async (_, thunkAPI) => {
    try {
      const response = await http.get<any>(`/projects`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getAllProjectByAdmin = createAsyncThunk(
  "listProject/getAllProjectByAdmin",
  async (pageIndex: number, thunkAPI) => {
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
        `/projects/admin?page=${pageIndex}`,
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

export const confirmProjectByAdmin = createAsyncThunk(
  "listProject/confirmProjectByAdmin",
  async (id: number, thunkAPI) => {
    try {
      const token = getTokenFromSessionStorage();
      // console.log("token", token);

      const configHeader = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await http.patch<any>(
        `/projects/confirm-project/${id}`,
        [],
        configHeader
      );

      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const updateProjectByAdmin = createAsyncThunk(
  "listProject/updateProjectByAdmin",
  async (dataResponse: any, thunkAPI) => {
    const { id, data } = dataResponse;
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
        `/projects/${id}`,
        data,
        configHeader
      );
      // console.log("response");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

interface ChangeStatusParams {
  projectId: number;
  projectStatus: string;
  groupId?: number;
}

export const changeStatusProjectByAdmin = createAsyncThunk(
  "listProject/changeStatusProjectByAdmin",
  async ({ projectId, projectStatus }: ChangeStatusParams, thunkAPI) => {
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
        `/projects/changeStatus/${projectId}/${projectStatus}`,
        [],
        configHeader
      );
      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const checkProjectCanDone = createAsyncThunk(
  "listProject/checkProjectCanDone",
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
        `/phases/checkProjectCanDone/${projectId}`,
        configHeader
      );
      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const changeStatusProjectByLecturer = createAsyncThunk(
  "listProject/changeStatusProjectByLecturer",
  async (
    { projectId, projectStatus, groupId }: ChangeStatusParams,
    thunkAPI
  ) => {
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
        `/projects/changeStatus/${projectId}/${projectStatus}/${groupId}`,
        [],
        configHeader
      );
      return response.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

interface SetNoErrorPayload {
  error: string;
}
export const setNoError = createAction<SetNoErrorPayload>("project/setNoError");

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setNoError: (state, action: PayloadAction<SetNoErrorPayload>) => {
      state.error = action.payload.error || "";
    },
  },
  extraReducers: (builder) => {
    //create New Project
    builder.addCase(createNewProject.pending, (state) => {
      state.loadingProject = true;
      state.error = "";
    });
    builder.addCase(createNewProject.fulfilled, (state, action) => {
      state.loadingProject = false;
      state.data = [action.payload];
      state.error = "";
    });
    builder.addCase(createNewProject.rejected, (state, action) => {
      state.loadingProject = false;
      state.error = action.payload as string;
    });

    //get Project By Id
    builder.addCase(getProjectById.pending, (state) => {
      state.loadingProject = true;
      state.error = "";
    });
    builder.addCase(getProjectById.fulfilled, (state, action) => {
      state.loadingProject = false;
      // state.data = [action.payload];
      state.error = "";
    });
    builder.addCase(getProjectById.rejected, (state, action) => {
      state.loadingProject = false;
      state.error = action.payload as string;
    });

    //get all project by business
    builder.addCase(getAllProjectByBusiness.pending, (state) => {
      state.loadingProjectList = true;
      state.error = "";
    });
    builder.addCase(getAllProjectByBusiness.fulfilled, (state, action) => {
      state.loadingProjectList = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllProjectByBusiness.rejected, (state, action) => {
      state.loadingProjectList = false;
      state.error = action.payload as string;
    });

    //get All Project By EveryOne
    builder.addCase(getAllProjectByEveryOne.pending, (state) => {
      state.loadingProjectList = true;
      state.error = "";
    });
    builder.addCase(getAllProjectByEveryOne.fulfilled, (state, action) => {
      state.loadingProjectList = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllProjectByEveryOne.rejected, (state, action) => {
      state.loadingProjectList = false;
      state.error = action.payload as string;
    });

    //get All Project By Admin
    builder.addCase(getAllProjectByAdmin.pending, (state) => {
      state.loadingProjectList = true;
      state.error = "";
    });
    builder.addCase(getAllProjectByAdmin.fulfilled, (state, action) => {
      state.loadingProjectList = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllProjectByAdmin.rejected, (state, action) => {
      state.loadingProjectList = false;
      state.error = action.payload as string;
    });

    //confirm project by admin
    builder.addCase(confirmProjectByAdmin.pending, (state) => {
      state.loadingProject = true;
      state.error = "";
    });
    builder.addCase(confirmProjectByAdmin.fulfilled, (state, action) => {
      state.loadingProject = false;
      state.error = "";
    });
    builder.addCase(confirmProjectByAdmin.rejected, (state, action) => {
      state.loadingProject = false;
      state.error = action.payload as string;
    });

    //update and confirm project by admin
    builder.addCase(updateProjectByAdmin.pending, (state) => {
      state.loadingProject = true;
      state.error = "";
    });
    builder.addCase(updateProjectByAdmin.fulfilled, (state, action) => {
      state.loadingProject = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateProjectByAdmin.rejected, (state, action) => {
      state.loadingProject = false;
      state.error = action.payload as string;
    });

    //change Status Project By Admin
    builder.addCase(changeStatusProjectByAdmin.pending, (state) => {
      state.loadingProject = true;
      state.error = "";
    });
    builder.addCase(changeStatusProjectByAdmin.fulfilled, (state, action) => {
      state.loadingProject = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(changeStatusProjectByAdmin.rejected, (state, action) => {
      state.loadingProject = false;
      state.error = action.payload as string;
    });

    //check Project Can Done
    builder.addCase(checkProjectCanDone.pending, (state) => {
      state.loadingProject = true;
      state.error = "";
    });
    builder.addCase(checkProjectCanDone.fulfilled, (state, action) => {
      state.loadingProject = false;
      // state.data = action.payload;
      state.error = "";
    });
    builder.addCase(checkProjectCanDone.rejected, (state, action) => {
      state.loadingProject = false;
      state.error = action.payload as string;
    });

    //change Status Project By Lecturer
    builder.addCase(changeStatusProjectByLecturer.pending, (state) => {
      state.loadingProject = true;
      state.error = "";
    });
    builder.addCase(
      changeStatusProjectByLecturer.fulfilled,
      (state, action) => {
        state.loadingProject = false;
        // state.data = action.payload;
        state.error = "";
      }
    );
    builder.addCase(changeStatusProjectByLecturer.rejected, (state, action) => {
      state.loadingProject = false;
      state.error = action.payload as string;
    });
  },
});

export default projectSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getConfigHeader, getTokenFromSessionStorage } from "../utils/handleToken";
import { CategoryType } from "@/src/types/category.type";

export interface CategoryStatus {
  data: CategoryType | null;
  loadingCategory: boolean;
  error: string;
}

const initialState: CategoryStatus = {
  data: null,
  loadingCategory: false,
  error: "",
};

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (dataBody: CategoryType, thunkAPI) => {
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
        `/categories`,
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

export const getAllCategoryOfPhase = createAsyncThunk(
  "category/getAllCategoryOfPhase",
  async (phaseId: number, thunkAPI) => {
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
        `/categories/all/${phaseId}`,
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

interface UpdateCategoryProps {
  dataBody: CategoryType;
  id: number;
}

export const updateCategoryInformation = createAsyncThunk(
  "category/updateCategoryInformation",
  async ({ dataBody, id }: UpdateCategoryProps, thunkAPI) => {
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
        `/categories/${id}`,
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

interface ChangeStatusProps {
  categoryId: number;
  categoryStatus: string;
}

export const changeStatusCategory = createAsyncThunk(
  "category/changeStatusCategory",
  async ({ categoryId, categoryStatus }: ChangeStatusProps, thunkAPI) => {
    try {
      const response = await http.patch<any>(
        `/categories/changeStatus/${categoryId}/${categoryStatus}`,
        [],
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const updateActualResult = createAsyncThunk(
  "category/updateActualResult",
  async (dataBody: any, thunkAPI) => {
    try {
      const response = await http.patch<any>(
        `/categories/updateActualResult`,
        dataBody,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (cateId: number, thunkAPI) => {
    try {
      const response = await http.delete<any>(
        `/categories/${cateId}`,
        getConfigHeader()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create category
    builder.addCase(createCategory.pending, (state) => {
      state.loadingCategory = true;
      state.error = "";
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.loadingCategory = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loadingCategory = false;
      state.error = action.payload as string;
    });

    //get phase by project id
    builder.addCase(getAllCategoryOfPhase.pending, (state) => {
      state.loadingCategory = true;
      state.error = "";
    });
    builder.addCase(getAllCategoryOfPhase.fulfilled, (state, action) => {
      state.loadingCategory = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getAllCategoryOfPhase.rejected, (state, action) => {
      state.loadingCategory = false;
      state.error = action.payload as string;
    });

    //updateCategoryInformation
    builder.addCase(updateCategoryInformation.pending, (state) => {
      state.loadingCategory = true;
      state.error = "";
    });
    builder.addCase(updateCategoryInformation.fulfilled, (state, action) => {
      state.loadingCategory = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateCategoryInformation.rejected, (state, action) => {
      state.loadingCategory = false;
      state.error = action.payload as string;
    });

    //updateActualResult
    builder.addCase(updateActualResult.pending, (state) => {
      state.loadingCategory = true;
      state.error = "";
    });
    builder.addCase(updateActualResult.fulfilled, (state, action) => {
      state.loadingCategory = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateActualResult.rejected, (state, action) => {
      state.loadingCategory = false;
      state.error = action.payload as string;
    });

    //deleteCategory
    builder.addCase(deleteCategory.pending, (state) => {
      state.loadingCategory = true;
      state.error = "";
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.loadingCategory = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loadingCategory = false;
      state.error = action.payload as string;
    });
  },
});

export default categorySlice.reducer;

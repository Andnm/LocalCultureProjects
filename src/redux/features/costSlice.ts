import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { PhaseType } from "@/src/types/phase.type";
import { ErrorType } from "@/src/types/error.type";
import { getTokenFromSessionStorage } from "../utils/handleToken";
import { CategoryType } from "@/src/types/category.type";
import { CostType } from "@/src/types/cost.type";

export interface CostStatus {
  data: CostType | null;
  loadingCost: boolean;
  error: string;
}

const initialState: CostStatus = {
  data: null,
  loadingCost: false,
  error: "",
};

interface CreateCostBody {
  expected_cost: number;
  categoryId: number;
  phaseId: number;
}

export const createCost = createAsyncThunk(
  "cost/createCost",
  async (dataBody: CreateCostBody, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await http.post<any>(`/cost`, dataBody, configHeader);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as ErrorType)?.response?.data?.message
      );
    }
  }
);

export const getCostInCategory = createAsyncThunk(
  "cost/getCostInCategory",
  async (categoryId: number, thunkAPI) => {
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
        `/cost/all/${categoryId}`,
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

export const updateCost = createAsyncThunk(
  "cost/updateCost",
  async (req: any, thunkAPI) => {
    const token = getTokenFromSessionStorage();
    const configHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { id, dataBody } = req;

    try {
      const response = await http.patch<any>(
        `/cost/${id}`,
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

interface ChangeStatusCostParams {
  id: number;
  costStatus: string;
}

export const changeStatusCost = createAsyncThunk(
  "cost/changeStatusCost",
  async ({ id, costStatus }: ChangeStatusCostParams, thunkAPI) => {
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
        `/cost/changeStatus/${id}/${costStatus}`,
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

export const costSlice = createSlice({
  name: "cost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create cost
    builder.addCase(createCost.pending, (state) => {
      state.loadingCost = true;
      state.error = "";
    });
    builder.addCase(createCost.fulfilled, (state, action) => {
      state.loadingCost = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createCost.rejected, (state, action) => {
      state.loadingCost = false;
      state.error = action.payload as string;
    });

    //get cost in category
    builder.addCase(getCostInCategory.pending, (state) => {
      state.loadingCost = true;
      state.error = "";
    });
    builder.addCase(getCostInCategory.fulfilled, (state, action) => {
      state.loadingCost = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(getCostInCategory.rejected, (state, action) => {
      state.loadingCost = false;
      state.error = action.payload as string;
    });

    //update expected cost
    builder.addCase(updateCost.pending, (state) => {
      state.loadingCost = true;
      state.error = "";
    });
    builder.addCase(updateCost.fulfilled, (state, action) => {
      state.loadingCost = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(updateCost.rejected, (state, action) => {
      state.loadingCost = false;
      state.error = action.payload as string;
    });

    //change status cost
    builder.addCase(changeStatusCost.pending, (state) => {
      state.loadingCost = true;
      state.error = "";
    });
    builder.addCase(changeStatusCost.fulfilled, (state, action) => {
      state.loadingCost = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(changeStatusCost.rejected, (state, action) => {
      state.loadingCost = false;
      state.error = action.payload as string;
    });
  },
});

export default costSlice.reducer;

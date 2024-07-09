import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/https";
import { ErrorType } from "@/src/types/error.type";
import { getConfigHeader } from "../utils/handleToken";
import { PaymentType } from "@/src/types/payment.type";

export interface PaymentState {
  data: any | null;
  loadingPayment: boolean;
  error: string;
}

const initialState: PaymentState = {
  data: null,
  loadingPayment: false,
  error: "",
};

export const createPaymentUrl = createAsyncThunk(
  "payment/createPaymentUrl",
  async ({ paymentMethod, phaseId }: PaymentType, thunkAPI) => {
    try {
      const response = await http.post<any>(
        `/payment/${paymentMethod}/${phaseId}`,
        [],
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

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createNewSupport
    builder.addCase(createPaymentUrl.pending, (state) => {
      state.loadingPayment = true;
      state.error = "";
    });
    builder.addCase(createPaymentUrl.fulfilled, (state, action) => {
      state.loadingPayment = false;
      //   state.data = action.payload;
      state.error = "";
    });
    builder.addCase(createPaymentUrl.rejected, (state, action) => {
      state.loadingPayment = false;
      state.error = action.payload as string;
    });
  },
});

export default paymentSlice.reducer;

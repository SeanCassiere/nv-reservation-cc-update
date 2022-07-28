import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthSliceState {
  access_token: string | null;
  token_type: string;
}

const initialState: IAuthSliceState = {
  access_token: null,
  token_type: "Bearer",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<{ access_token: string; token_type: string }>) => {
      state.access_token = action.payload.access_token;
      state.token_type = action.payload.token_type;
    },
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice;

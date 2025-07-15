// src/redux/features/auth/authModalSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  showAuthModal: boolean;
  currentStep: "welcome" | "login" | "register" | "verify" | "forgot" | "reset";
}

const initialState: ModalState = {
  showAuthModal: false,
  currentStep: "welcome",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openAuthModal(state, action: { payload: ModalState["currentStep"] }) {
      state.showAuthModal = true;
      state.currentStep = action.payload;
    },
    closeAuthModal(state) {
      state.showAuthModal = false;
      state.currentStep = "welcome";
    },
    setAuthStep(state, action: { payload: ModalState["currentStep"] }) {
      state.currentStep = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setAuthStep } =
  authModalSlice.actions;
export default authModalSlice.reducer;

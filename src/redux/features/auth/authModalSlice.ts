// src/redux/features/auth/authModalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  showAuthModal: boolean;
  modalType?: string;
}

const initialState: ModalState = {
  showAuthModal: false,
  modalType: undefined,
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openAuthModal(state, action?: PayloadAction<string>) {
      state.showAuthModal = true;
      state.modalType = action?.payload || "welcome";
    },
    closeAuthModal(state) {
      state.showAuthModal = false;
      state.modalType = undefined;
    },
  },
});

export const { openAuthModal, closeAuthModal } =
  authModalSlice.actions;
export default authModalSlice.reducer;

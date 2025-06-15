import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isChatOpen: false,
};

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    openChat: (state) => {
      state.isChatOpen = true;
    },
    closeChat: (state) => {
      state.isChatOpen = false;
    },
  },
});
export const { openChat, closeChat } = inboxSlice.actions;
export default inboxSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

interface FeedInteractionState {
  hasInteracted: boolean;
  interactions: {
    postClicks: number;
    scrollDepth: number;
    timeSpent: number;
  };
}

const initialState: FeedInteractionState = {
  hasInteracted: false,
  interactions: {
    postClicks: 0,
    scrollDepth: 0,
    timeSpent: 0,
  },
};

const feedInteractionSlice = createSlice({
  name: "feedInteraction",
  initialState,
  reducers: {
    recordPostClick(state) {
      state.interactions.postClicks += 1;
      state.hasInteracted = true;
    },
    recordScrollDepth(state, action) {
      state.interactions.scrollDepth = Math.max(
        state.interactions.scrollDepth,
        action.payload
      );
      if (action.payload > 20) {
        state.hasInteracted = true;
      }
    },
    recordTimeSpent(state, action) {
      state.interactions.timeSpent = action.payload;
      if (action.payload > 10000) { // 10 seconds
        state.hasInteracted = true;
      }
    },
    resetInteractions(state) {
      state.hasInteracted = false;
      state.interactions = {
        postClicks: 0,
        scrollDepth: 0,
        timeSpent: 0,
      };
    },
  },
});

export const {
  recordPostClick,
  recordScrollDepth,
  recordTimeSpent,
  resetInteractions,
} = feedInteractionSlice.actions;

export default feedInteractionSlice.reducer;
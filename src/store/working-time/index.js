import { createSlice } from "@reduxjs/toolkit";
import { postWorkingTime } from "./post-time";
import { postMeetingTime } from "./add-meeting";
import { fetchMeetings } from "./fetch-meetings";

const initialState = {
  startTime: null,
  endTime: null,
  fetched: false,
  loading: false,
  error: false,
  meetings: [],
  otherFetched: false,
  otherLoading: false,
};

const workTimeSlide = createSlice({
  name: "work time",
  initialState,
  reducers: {
    setStartTime(state, action) {
      state.startTime = new Date();
    },
    setEndTime(state, action) {
      state.endTime = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(postWorkingTime.fulfilled, (state, action) => {
      state.otherLoading = false;
      state.error = false;
    });
    builder.addCase(postWorkingTime.pending, (state, action) => {
      state.otherLoading = true;
    });
    builder.addCase(postWorkingTime.rejected, (state, action) => {
      state.otherLoading = false;
      state.error = true;
    });
    builder.addCase(postMeetingTime.fulfilled, (state, action) => {
      state.meetings.push(action.payload?.data);
      state.otherLoading = false;
      state.error = false;
    });
    builder.addCase(postMeetingTime.pending, (state, action) => {
      state.otherLoading = true;
    });
    builder.addCase(postMeetingTime.rejected, (state, action) => {
      state.otherLoading = false;
      state.error = true;
    });
    builder.addCase(fetchMeetings.fulfilled, (state, action) => {
      state.meetings = action.payload;
      state.loading = false;
      state.error = false;
      state.fetched = true;
    });
    builder.addCase(fetchMeetings.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchMeetings.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export default workTimeSlide.reducer;

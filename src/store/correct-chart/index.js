import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  charts: [
    {
      id: 1,
      chart: "PurchaseSale",
    },
    {
      id: 2,
      chart: "SalesDynamics",
    },
    {
      id: 3,
      chart: "PurchaseAnalytics",
    },
    {
      id: 4,
      chart: "PriceAnalytics",
    },
    {
      id: 5,
      chart: "SalesPercentage",
    },
  ],
};

const chartsSlide = createSlice({
  name: "charts",
  initialState,
  reducers: {
    updateCharts: (state, action) => {
      const { idToReplace, item, isLast } = action.payload;
      const indexToReplace = state.charts.findIndex(
        (chart) => chart.id === idToReplace
      );
      state.charts.splice(item?.index, 1);
      if (indexToReplace > 0 && indexToReplace > item?.index) {
        state.charts.splice(indexToReplace - 1, 0, item?.chart);
      } else if (isLast) {
        state.charts.push(item?.chart);
      } else {
        state.charts.splice(indexToReplace, 0, item?.chart);
      }
    },
  },
});

export const { updateCharts } = chartsSlide.actions;
export default chartsSlide.reducer;

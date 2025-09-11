export const getChartState = (
  isDouble,
  mainColor = "rgba(240, 164, 88, 0.40)",
  bar = "$",
  year = new Date().getFullYear()
) => ({
  legend: {
    show: false,
  },
  chart: {
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: isDouble
    ? ["rgba(240, 164, 88, 0.40)", "transparent", "rgba(11, 130, 155, 0.40)"]
    : [mainColor],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "16px",
      endingShape: "rounded",
      borderRadius: 8,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: isDouble ? ["#C08346", "transparent", "#0B829B"] : [mainColor],
  },
  grid: {
    borderColor: "#F1F1F1",
  },
  yaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  xaxis: {
    categories: [
      `Jan ${year}`,
      `Feb ${year}`,
      `Mar ${year}`,
      `Apr ${year}`,
      `May ${year}`,
      `Jun ${year}`,
      `Jul ${year}`,
      `Aug ${year}`,
      `Sep ${year}`,
      `Oct ${year}`,
      `Nov ${year}`,
      `Dec ${year}`,
    ],
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return bar + " " + val;
      },
    },
  },
});

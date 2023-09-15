/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

import classes from "./graph.module.css";

Chart.register(...registerables);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const Graph = ({ details }) => {
  const [graphData, getGraphData] = useState({
    dates: [],
    prices: [],
  });

  useEffect(() => {
    const dates = [];
    const prices = [];
    if (details) {
      // sort transactions buy date first
      details.sort((a, b) => {
        return a.txDate - b.txDate;
      });

      details.forEach((e) => {
        if (e.type === "Listing" || e.type === "Sale") {
          const date = new Date(e.txDate * 1000);

          dates.push(`${date.getDate()}/${MONTHS[date.getMonth()]}`);
          prices.push(e.price);
        }
      });

      getGraphData({ dates, prices });
    }
  }, [details]);

  const data = {
    labels: graphData.dates,
    datasets: [
      {
        data: graphData.prices,
        fill: false,
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(147, 163, 248, 0.08)",
        tension: 1,
      },
    ],
  };
  const options = {
    scales: {
      yAxes: {
        grid: {
          color: "rgba(147, 163, 248, 0.08)",
        },
        ticks: {
          color: "white",
          fontSize: 12,
        },
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0,
        loop: false,
      },
    },
    plugins: {
      responsive: true,
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      {graphData.prices?.length > 0 ? (
        <div className={classes.chart}>
          <Line data={data} width={null} height={300} options={options} />
        </div>
      ) : (
        <div className={classes.nodata}>No Price History Available</div>
      )}
    </>
  );
};

export default Graph;

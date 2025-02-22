import React from "react";
import StatsGrid from "./ui/StatsGrid";
import Charts from "./ui/Charts";

const StatisticsPage = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      <StatsGrid />
      {/* Pastda komplekslar bo`yicha musobaqa */}
      {/* <Charts /> */}
    </div>
  );
};

export default StatisticsPage;
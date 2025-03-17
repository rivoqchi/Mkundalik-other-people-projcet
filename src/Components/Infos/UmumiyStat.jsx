import React from "react";
import Card from "./ui/Card";
import StatsGrid from "./ui/StatsGrid";
import Charts from "./ui/Charts";
import Charts2 from "./ui/Charts2";
import { useTranslation } from "react-i18next";
const StatisticsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Statistika</h1>
      <Card />
      <StatsGrid />
      {/* Pastda komplekslar bo`yicha musobaqa */}
      <div className="row">
        <div className="col-12 col-md-6"><Charts/></div>
        <div className="col-12 col-md-6"><Charts2/></div>
      </div>
    </div>
  );
};

export default StatisticsPage;
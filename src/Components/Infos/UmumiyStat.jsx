import React from "react";
import Card from "./ui/Card";
import StatsGrid from "./ui/StatsGrid";
import { useTranslation } from "react-i18next";
const StatisticsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Statistika</h1>
      <Card />
      <StatsGrid />
    </div>
  );
};

export default StatisticsPage;
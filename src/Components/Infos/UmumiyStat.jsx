import React from "react";
import Card from "./ui/Card";
import StatsGrid from "./ui/StatsGrid";
import { useTranslation } from "react-i18next";
const StatisticsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="bgred m-3 stat-page">
      <h1 className="text-2xl text-center font-bold m-4">Statistika</h1>
      <h3 className="text-center m-2">"Toshkent metropoliteni" DUK</h3>
      <Card />
      <StatsGrid />
    </div>
  );
};

export default StatisticsPage;
import React from "react";
import Card from "./ui/Card";
import StatsGrid from "./ui/StatsGrid";
import { useTranslation } from "react-i18next";
const StatisticsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="stat-page">
      <h1 className="ml-2 page-title">{t("statistics")}</h1>
      <Card />
      <StatsGrid />
    </div>
  );
};

export default StatisticsPage;
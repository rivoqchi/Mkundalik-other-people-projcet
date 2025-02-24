import React from "react";
import Card from "./Card";

const stats = [
  { title: "Xodim tizimda", value: "12,345", icon: <i className="fa-solid fa-users"></i> },
  { title: "Bugun yozilgan hisobotlar", value: "34,567", icon: <i className="fa-solid fa-chart-pie"></i> },
  { title: "Umumiy hisobotlar", value: "$56,789", icon: <i className="fa-solid fa-chart-simple"></i> },
  { title: "Xodim hisobot yozyapti", value: "45%", icon: <i className="fa-solid fa-user-group"></i> },
];

const StatsGrid = () => {
  return (
    <></>
    // <div className="container mt-4">
    //   <div className="row">
    //     {stats.map((stat, index) => (
    //       <Card key={index} title={stat.title} value={stat.value} icon={stat.icon} />
    //     ))}
    //   </div>
    // </div>
  );
};

export default StatsGrid;
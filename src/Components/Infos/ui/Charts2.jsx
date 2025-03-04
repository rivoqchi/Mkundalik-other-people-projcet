import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import axios from "axios";
import { API } from "../../../config";

const chartSetting = {
  yAxis: [
    {
      label: "O`rtacha ball:",
    },
  ],
  series: [{ dataKey: "miqdor", label: "O`rtacha ball:", valueFormatter: (value) => `${value} ball` }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function TickPlacementBars() {
  const [dataset, setDataset] = useState([]); // Ma'lumotlarni saqlash uchun state

  useEffect(() => {
    const getLengthData = async () => {
      try {
        const { data } = await axios.get(`${API}/statistics/getbyrated/`);
        // Backenddan kelgan ma'lumotni to'g'ri formatga o'tkazamiz
        const formattedData = data.data.map((item) => ({
          name: item.department || "Noma'lum", // Agar department bo‘sh bo‘lsa, "Noma'lum" deb yozamiz
          miqdor: item.averageRated || 0, // Agar amount bo‘sh bo‘lsa, 0 qo‘yiladi
        }));

        setDataset(formattedData); // Ma'lumotni state ga saqlaymiz
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getLengthData(); // Ma'lumotlarni yuklash
  }, []);

  return (
    <div className="p-3 statdiv statdiv2">
      <h5 className="stath1 text-center">Kundalik hisobotlarning o`rtacha bahosi bo`yicha top 10 tarkibiy tuzilmalar</h5>
        <div style={{ width: "100%" }}>
      <BarChart
        dataset={dataset} // API dan kelgan ma'lumotlar
        xAxis={[{ scaleType: "band", dataKey: "name", tickPlacement: "middle", tickLabelPlacement: "middle" }]}
        {...chartSetting}
      />
    </div>
    </div>
  );
}
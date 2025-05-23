import React from 'react';
import { useTranslation } from "react-i18next";
function Dashboard() {
    const { t } = useTranslation();
    return ( 
        <>
            <h1 className="text-center">
            {t("boshliqprof")}
            </h1>
        </>
     );
}

export default Dashboard;
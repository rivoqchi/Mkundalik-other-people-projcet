import React from 'react';
import { useTranslation } from "react-i18next";
import AiMotivation from "../Additional/AiMotivation";
function Dashboard() {
    const { t } = useTranslation();
    return ( 
        <div className="def-page">
            <h1 className="text-center mb-4">
            {t("boshliqprof")}
            </h1>
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <AiMotivation />
                </div>
            </div>
        </div>
     );
}

export default Dashboard;
import React from 'react';
import {Link} from 'react-router-dom';
import { useTranslation } from "react-i18next";
function NotAllowed() {
    
const { t } = useTranslation();
    
    return ( 
        <>
            <div className="page404 align-items-center   text-center">
                <h1 className='h1404 pt-5'><b>403</b></h1>
                <h3><i className="fa-solid fa-triangle-exclamation i404"></i> 
                {t("taqiqtopildi")}!</h3>
                <p>{t("tokenexpired")}...</p>
                <Link to="/login"><button className='defaultbutton'>{t("login")}</button></Link><br /><br />
            </div>
        </>
     );
}

export default NotAllowed;
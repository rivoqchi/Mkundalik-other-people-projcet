import React from 'react';
import {Link} from 'react-router-dom';
import { useTranslation } from "react-i18next";
function NotFound404() {
    
const { t } = useTranslation();
    return ( 
        <>
            <div className="page404 align-items-center   text-center">
                <h1 className='h1404 pt-5'><b>404</b></h1>
                <h3><i className="fa-solid fa-triangle-exclamation i404"></i> {t("pagenotfound")}</h3>
                <p>{t("pagedoesntexist")}!</p>
                <Link to="/login"><button className='defaultbutton'>{t("login")}</button></Link><br /><br />
            </div>
        </>
     );
}

export default NotFound404;
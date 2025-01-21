import axios from 'axios';
import {API} from '../../config';
import React, { useState, useEffect, useRef } from "react";
import logo from '../Images/logo2.png'
function Profile() {
      const [myData, setMyData] = useState([]);
    const id = window.localStorage.getItem("user_id")
    const getMyData = async () =>{
        const {data} = await axios.get(`${API}/auth/mydata/${id}`)
        setMyData(data.user)
      }
      useEffect(() =>{
        getMyData()
      }, [])

    return ( 
        <>
        <div className="profil">
            <div className="d-flex justify-content-center align-items-center">
                <img className='profiledagilogo' src={logo} alt="logo" />
            <h1>Xodim profili</h1>
            </div>
            <h5>Umumiy ma'lumotlar</h5>

            <div className="profiledatum">
                <div className="datum">
                    <p className="ours">F.I.Sh</p>
                    <p className="theirs">{myData.name}</p>
                </div>

                <div className="datum">
                    <p className="ours">Telefon raqam</p>
                    <p className="theirs">{myData.phone}</p>
                </div>

                <div className="datum">
                    <p className="ours">Bo`lim</p>
                    <p className="theirs">{myData.section}</p>
                </div>

                <div className="datum">
                    <p className="ours">Lavozim</p>
                    <p className="theirs">{myData.degree}</p>
                </div>

                <div className="datum">
                    <p className="ours">Ro`yxatdan o`tgan sana</p>
                    <p className="theirs">{myData.firstAct}</p>
                </div>

                <h5>Shaxsiy ma'lumotlar</h5>

                <div className="datum">
                    <p className="ours">Millati</p>
                    <p className="theirs">{myData.nationality}</p>
                </div>

                <div className="datum">
                    <p className="ours">Ma'lumot</p>
                    <p className="theirs">{myData.education}</p>
                </div>

                <div className="datum">
                    <p className="ours">Yo`nalish</p>
                    <p className="theirs">{myData.speciality}</p>
                </div>

                <div className="datum">
                    <p className="ours">Tug`ilgan sana</p>
                    <p className="theirs">{myData.dateOfBirth}</p>
                </div>

                <div className="datum">
                    <p className="ours">Tug`ilgan manzil</p>
                    <p className="theirs">{myData.placeOfBirth}</p>
                </div>

                <div className="datum">
                    <p className="ours">Yashash manzil</p>
                    <p className="theirs">{myData.address}</p>
                </div>

                <div className="datum">
                    <p className="ours">Lavozim yo`riqnomasi:</p>
                    <p className="theirs">Yo`riqnoma</p>
                </div>
            </div>
        </div>
        </>
     );
}

export default Profile;
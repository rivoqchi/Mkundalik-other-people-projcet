import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Carusel from './Carousel';
import {API} from '../config';
import logo from './Images/logo2.png'
import { useNavigate } from "react-router-dom";
function Main() {
    const navigate = useNavigate();
    const myId = window.localStorage.getItem("user_id") 
    const getMyData = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/mydata/${myId}`);
        console.log(data);
        if(data.user.role === "admin"){
          navigate("/admin")
        }else if(data.user.role === "employee"){
          navigate("/employee")
        }else if(data.user.role === "superadmin"){
          navigate("/superadmin")
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };  
    useEffect(() => {
      getMyData();
    }, []);

  return (
    <>
      <Carusel />
      <img className="mainlogo" src={logo} alt="" />
      <div className="logss">
        <h4 className="text-light m-3">Kundalik vazifalarni qayd etish virtual platformasi</h4>
        <Link to="/login">
          <button className="mainlogin">Kirish</button>
        </Link>
      </div>
    </>
  );
}

export default Main;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API } from "../../config";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
function SeeSelectedSchedules() {
  const myId = window.localStorage.getItem("user_id");
  const [mySectionSchedules, setMySectionSchedules] = useState([]);
  const [mySectionBeginner, setMySectionBeginner] = useState([]);
  const [myData, setMyData] = useState([]);
  const [myRole, setMyRole] = useState([]);
  const id = window.localStorage.getItem("user_id")
  let thescheduleid = useParams();
    
  const getMySectionSchedules = async () => {
    try {
      const { data } = await axios.get(`${API}/schedules/getallbyuserid/${thescheduleid.id}`);
      console.log(data);
      setMySectionBeginner(data.beginner);
      setMySectionSchedules(data.history);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getMySectionSchedules();
  }, []);
  const getMyData = async () =>{
    const {data} = await axios.get(`${API}/auth/mydata/${myId}`)
    
    setMyData(data.user)
    if (data.user.role === 'employee') {
    setMyRole("user")
    }else if (data.user.role === 'admin') {
        setMyRole("admin")
    }else if (data.user.role === 'superadmin') {
      setMyRole("superadmin")
    }else if (data.user.role === 'complex') {
    setMyRole("complex")
    }else if (data.user.role === 'department') {
      setMyRole("department")
    }else if (data.user.role === 'hr') {
      setMyRole("hr")
    }else if (data.user.role === 'boss') {
      setMyRole("boss")
    }else if (data.user.role === 'commission') {
      setMyRole("commission")
    }
  }
  useEffect(() =>{
    getMyData()
  }, [])
  return (
    <>
    <div className="userdata">
      <div className="row">
        <div className="col-12 userdatadiv col-md-6">
        <p><i class="fa-solid fa-user-tie"></i> {mySectionBeginner.name}</p>
        <p><i class="fa-solid fa-address-card"></i> {mySectionBeginner.degree}</p>
        <p><i class="fa-solid fa-phone-volume"></i> {mySectionBeginner.phone?.length > 5 ? "+998*****" +mySectionBeginner.phone.slice(9, 13) : mySectionBeginner.phone}</p>
        <p><i class="fa-solid fa-briefcase"></i> {mySectionBeginner.speciality}</p>
        </div>
        <div className="col-12 userdatadiv col-md-6">
        <p><i class="fa-solid fa-users-rectangle"></i> {mySectionBeginner.complex}</p>
        <p><i class="fa-solid fa-users-line"></i> {mySectionBeginner.department}</p>
        <p><i class="fa-solid fa-layer-group"></i> {mySectionBeginner.section}</p>
        <p><i class="fa-solid fa-house"></i> {mySectionBeginner.address?.length > 5 ? mySectionBeginner.address.slice(0, 20) + "*****" : mySectionBeginner.address}</p>
        </div>
      </div>
    </div>
    <div className="calendardaysandselectoptions"></div>
      <div className="ratedschedulescount d-flex mx-3 justify-content-between">
        <p>Jami: {mySectionSchedules.length}</p>
        <span>Baholangan: {mySectionSchedules.filter((item) => item.rated).length}</span>
      </div>

      <div className="scheduleshistory">
        {mySectionSchedules.map((i) => (
          <>
            <Link
              className="text-decoration-none"
              to={`/${myRole}/archive/schedule/${i._id}`}
              key={i._id}
            >
              <button
                className={`schedulehistorybtn ${
                  !i.rated ? "unrated" : "rated"
                }`}
              >
                {i.startedAt.slice(0, 10)} da bajargan ishlar hisoboti
                {i.rated && <span className="yulduzcha"><i className="fa-regular fa-star"></i> {i.rated}</span>}
              </button>
            </Link>
          </>
        ))}
      </div>
    </>
  );
}

export default SeeSelectedSchedules;

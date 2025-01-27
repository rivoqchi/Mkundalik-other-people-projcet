const id = window.localStorage.getItem("user_id")
const [myData, setMyData] = useState([]);
const [myRole, setMyRole] = useState([]);
const getMyData = async () =>{
    const {data} = await axios.get(`${API}/auth/mydata/${id}`)
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
}
  }
  useEffect(() =>{
    getMyData()
  }, [])

import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {API} from '../../config';
import axios from 'axios'
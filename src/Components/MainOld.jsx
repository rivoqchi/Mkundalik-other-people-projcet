import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import {API} from '../config'
import axios from "axios";
import Alert from './Additional/Alert';
function Main() {
  const [allData, setAllData] = useState([])
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  
  const getAllData = async () => {
    try {
      const { data } = await axios.get(`${API}/travel`);
      setAllData(data.travels)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };  
  const deleteThis = async (id) => { 
    try {
      await axios.delete(`${API}/travel/delete/${id}`)
      setAlert({ show: true, type: "success", message: "Muvaffaqiyatli o`chirildi!" });
      getAllData()
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Xatolik!" });
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <>
    {alert.show && <Alert type={alert.type} message={alert.message} />}
    <div className="container-sm m-5">
      {allData.map(i =>(
      <Card key={i._id} className="m-5">
        <Card.Img variant="top" src={i.image} alt="Parij" />
        <Card.Header as="h5">{i.title}</Card.Header>
        <Card.Body>
          <Card.Text>
            {i.description}
          </Card.Text>
          <div className="d-flex justify-content-between">
            <div> </div>
            <div>
              <Link to={`/edit/${i._id}`}>
                <Button variant="primary">Edit</Button>
              </Link>
              <Button className="mx-3" onClick={() =>{deleteThis(i._id)}} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      ))}
    </div>
    </>
  );
}

export default Main;
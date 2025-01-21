import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useParams} from 'react-router-dom';
import {API} from '../../config';
import { fetchRole } from '../Auth/CheckAuth';
import Alert from '../Additional/Alert';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
function Confirm() {
    const [allSections, setAllSections] = useState([])
    const navigate = useNavigate();
    const {id} = useParams()
    
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [name, setName] = useState("");
    const [section, setSection] = useState("");
    const [degree, setDegree] = useState("");
    const [phone, setPhone] = useState("");
    
    const getAllSections = async () => {
      try {
        const { data } = await axios.get(`${API}/sections/getall`);
        setAllSections(data.sections)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };  
    useEffect(() => {
      getAllSections();
    }, []);

        useEffect(() => {
            const fetchData = async () => {
              const data = await fetchRole();
            };
        
            fetchData();
          });

    const getData = async () =>{
      const {data} = await axios.get(`${API}/auth/getuser/${id}`)
      setName(data.user.name)
      setPhone(data.user.phone)
      setSection(data.user.section)
      setDegree(data.user.degree)
    }
    useEffect(() =>{
      getData()
    }, [])
    let acceptedBy = window.localStorage.getItem("fullName")
    
    const handleUpdate = async (e) =>{
      e.preventDefault()
      await axios.put(`${API}/auth/activateuser/${id}`, {
        name,
        phone,
        section,
        degree,
        acceptedBy
      })
      navigate("/admin/employees/registered-users")
      setAlert({ show: true, type: "success", message: "Muvaffaqiyatli yangilandi!" });
    }
  return (
    <>
          {alert.show && <Alert type={alert.type} message={alert.message} />}
    <h1 className='m-5'>Edit Page</h1>
    <div className="container m-5">
        <Form onSubmit={handleUpdate}>
      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>F.I.Sh.</Form.Label>
        <Form.Control onChange={e => {setName(e.target.value)}} defaultValue={name} type="text" placeholder="F.I.Sh. kiriting:" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>Telefon raqami</Form.Label>
        <Form.Control onChange={e => {setPhone(e.target.value)}} defaultValue={phone} type="text" placeholder="Telefonni kiriting:" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>Bo`lim</Form.Label>
      <div className="selectstatus">
                            <select 
                            className=''
                                name="sections" 
                                id="sections" 
                                 onChange={e => {setSection(e.target.value)}}
                                value={section}
                            >
                                 <option disabled selected value="">Tanlang:</option>

                                {allSections.map(i => (
                                    <option key={i._id} value={i.name}>
                                        {i.name}
                                    </option>
                                ))}
                            </select>
                        </div>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>Lavozim</Form.Label>
        <Form.Control onChange={e => {setDegree(e.target.value)}} defaultValue={degree} type="text" placeholder="Lavozimni kiriting:" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>Tasdiqlayman</Form.Label>
        <Form.Control disabled defaultValue={acceptedBy} type="text" />
      </Form.Group>


      <Button variant="primary" type="submit">
        Yuborish
      </Button>
    </Form>
    </div>
    </>
  );
}

export default Confirm;
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
// import axios, { AxiosInstance } from "axios";
import Table from "react-bootstrap/Table";

import axios from "axios";
import FormTable from "./FormTable";

axios.defaults.baseURL = "http://localhost:8080/";
// const ServiceInstance = axios.create({
//   baseURL: "http://localhost:8080/",
//   headers: {
//     "content-type": "application/json",
//     accept: "application/json",
//   },
// });

function Example() {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [dataList, setDataList] = useState([]);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    // id: "",
  });

  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    mobile: "",
    id: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("Submitting form data:", formDataEdit);
    try {
      const response = await axios.put(
        `api/users/${formDataEdit._id}`,
        formDataEdit
      );
      console.log(response.data);
      if (response.data) {
        alert("data update successfully", response.data.message);
        getFetchData();
      }
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const handleEditOnchange = async (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShow(false);
    setEditShow(false);
  };
  const handleShow = () => setShow(true);
  const handleEditShow = (el) => {
    setFormDataEdit(el);
    setEditShow(true);
  };

  
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // useEffect(async () => {
  //   console.log("gete");
  // }, []);
  const handleSubmit = async (e) => {
    // ServiceInstance({ method: "GET", url: `api/users` });
    // const get = await axios.get("api/users");
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      const response = await axios.post("api/users", formData);
      console.log(response.data);
      if (response.data) {
        alert("data save successfully", response.data.message);
        getFetchData();
      }
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const getFetchData = async (e) => {
    try {
      const response = await axios.get("api/users");
      console.log(response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  useEffect(() => {
    getFetchData();
  }, []);

  console.log(dataList);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`api/users/${id}`);
      alert(
        "Are you sure you want to delete this record?",
        response.data.message
      );
      getFetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="Add_button">
        Add
      </Button>

      <Modal show={show || editShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{show ? "Add Form" : "Edit Form"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {show && (
            <FormTable
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleClose={handleClose}
              rest={formData}
            />
          )}

          {editShow && (
            <FormTable
              handleSubmit={handleUpdate}
              handleChange={handleEditOnchange}
              handleClose={handleClose}
              rest={formDataEdit}
            />
          )}
        </Modal.Body>
      </Modal>

      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataList[0] ? (
            dataList.map((el, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{el.name}</td>
                  <td>{el.email}</td>
                  <td>{el.mobile}</td>
                  <td>
                    {" "}
                    <Button
                      variant="warning"
                      onClick={() => handleEditShow(el)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="delete"
                      onClick={() => handleDelete(el._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <p style={{ textalign: "center" }}>No Data</p>
          )}
        </tbody>
      </Table>
     
    </>
  );
}

export default Example;

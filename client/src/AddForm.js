import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
// import axios, { AxiosInstance } from "axios";
import Table from "react-bootstrap/Table";
import axios from "axios";
import FormTable from "./FormTable";
import Calender from "./Calender";
import BookingDetail from "./BookingDetail";
import Chatbox from "./Chat";

axios.defaults.baseURL = "http://localhost:8080/";

function Example() {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [showBookingDetail, setShowBookingDetail] = useState(false);

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

  const handleChatbox = () => {
    setShowChatBox(true);
  };

  const handleBookingClick = () => {
    setShowDatepicker(true);
  };

  const handleImportCsv = async () => {
    if (!csvFile) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await axios.post("api/users/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        alert("CSV Imported Successfully");
        getFetchData(); // Refresh the data
      }
    } catch (error) {
      console.error("Error importing CSV:", error);
    }
  };

  const handleDownlod = async () => {
    try {
      const response = await axios.get("api/users/export", {
        responseType: "blob", // Important: specify responseType as 'blob' to handle binary data
      });

      // Create a new Blob object using the response data
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "usersData.csv"); // Name of the file to be downloaded
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up and remove the link element
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

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

  const handleBookingDetailClick = () => {
    setShowBookingDetail(true); // Toggle BookingDetail visibility
  };

  const handleClose = () => {
    setShow(false);
    setEditShow(false);
    setShowDatepicker(false);
    setShowBookingDetail(false);
    setShowChatBox(false);
  };
  const handleShow = () => setShow(true);
  const handleEditShow = (el) => {
    setFormDataEdit(el);
    setEditShow(true);
  };

  const handleChange = (e) => {
    const { value, name, files } = e.target;
    if (name === "file") {
      setCsvFile(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      <div className="form-detail">
        <Form>
          <input
            type="file"
            name="file"
            className="file-input"
            onChange={handleChange}
            accept=".csv"
          />
          <Button
            variant="primary"
            onClick={handleImportCsv}
            className="import"
          >
            Import
          </Button>
        </Form>

        <div className="button">
          <Button variant="primary" onClick={handleShow} className="Add_button">
            Add
          </Button>

          <Button
            variant="primary"
            className="download_button"
            onClick={handleDownlod}
          >
            Download
          </Button>
          <Button variant="primary" className="chat" onClick={handleChatbox}>
            chatBox
          </Button>
        </div>
      </div>
      <div className="book">
        <Button
          variant="primary"
          // className="booking"
          onClick={handleBookingClick}
        >
          Booking
        </Button>

        <Button
          variant="primary"
          className="details"
          onClick={handleBookingDetailClick}
        >
          Booking Details
        </Button>
      </div>
      {/* {showDatepicker && <Calender handleClose={handleClose} />} */}

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

      {/* chat box */}
      <Modal show={showChatBox} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>chat Box</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Chatbox handleClose={handleClose} />
        </Modal.Body>
      </Modal>

      {/* calender component */}
      <Modal show={showDatepicker} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>calender Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calender handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      {/* Conditional rendering of BookingDetail */}
      {/* Booking Detail Modal */}
      <Modal show={showBookingDetail} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BookingDetail handleClose={handleClose} />
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

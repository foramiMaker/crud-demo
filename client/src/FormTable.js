import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";




function FormTable({ handleSubmit, handleChange, handleClose, rest }) {
 
  return (
    <div>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={rest.name}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              value={rest.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMobile">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter your mobile number"
              name="mobile"
              value={rest.mobile}
              onChange={handleChange}
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </div>
  );
}

export default FormTable;

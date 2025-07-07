import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

const UdateAddressModal = ({
  Formname,
  address,
  language,
  countries,
  handleAddressInputChange,
  updateAddress,
  GetAllUserAddressesByUserId,
  showError,
}) => {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);


  const handleClose = () => {
    setShow(false);
    GetAllUserAddressesByUserId();
  };
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      updateAddress(address);
    }
    setValidated(true);
  };

  return (
    <>
      <Button className="editTxt btn btn-address" onClick={handleShow}>
        <Pencil />
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>

            {Formname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            id="editAddressForm"
            onSubmit={handleSubmit}
            className="custom-invalid"
          >
            <div className="row row-vw">
              <div className="col-md-12">
                <Form.Group
                  controlId="billingAddressLine1"
                  className="mrg-b-30"
                >
                  <Form.Control
                    type="text"
                    placeholder={
                      language === "en" ? "Address line 1" : "العنوان 1"
                    }
                    className="cstInput"
                    value={address.AddressLine1}
                    minLength="4"
                    required
                    onChange={(e) =>
                      handleAddressInputChange(
                        address.AddressId,
                        "AddressLine1",
                        e.target.value
                      )
                    }
                  />
                  {showError.AddressLine1 && (
                    <div className="error-message">
                      {showError.AddressLine1}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-12">
                <Form.Group
                  controlId="billingAddressLine2"
                  className="mrg-b-30"
                >
                  <Form.Control
                    type="text"
                    placeholder={
                      language === "en" ? "Address line 2" : "العنوان 2"
                    }
                    className="cstInput"
                    value={address.AddressLine2}
                    minLength="4"
                    required
                    onChange={(e) =>
                      handleAddressInputChange(
                        address.AddressId,
                        "AddressLine2",
                        e.target.value
                      )
                    }
                  />
                  {showError.AddressLine2 && (
                    <div className="error-message">
                      {showError.AddressLine2}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-12">
                <Form.Group controlId="billingCountry" className="mrg-b-30">
                  <Form.Control
                    as="select"
                    className="cstInput"
                    value={address.Country}
                    required
                    onChange={(e) =>
                      handleAddressInputChange(
                        address.AddressId,
                        "Country",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      {language === "en"
                        ? "Select Country"
                        : "اختر الدولة"}
                    </option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="billingState" className="mrg-b-30 ">
                  <Form.Control
                    type="text"
                    placeholder={
                      language === "en" ? "Enter State" : "ادخل الدولة"
                    }
                    className="cstInput"
                    value={address.State}
                    required
                    onChange={(e) =>
                      handleAddressInputChange(
                        address.AddressId,
                        "State",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="billingCity" className="mrg-b-30">
                  <Form.Control
                    type="text"
                    placeholder={language === "en" ? "City" : "المدينة"}
                    className="cstInput"
                    value={address.City}
                    required
                    onChange={(e) =>
                      handleAddressInputChange(
                        address.AddressId,
                        "City",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-12">
                <Form.Group controlId="billingPostCode" className="mrg-b-30">
                  <Form.Control
                    type="text"
                    placeholder={
                      language === "en" ? "Post Code" : "رمز البريد"
                    }
                    pattern="[0-9]*"
                    className="cstInput"
                    value={address.PostCode}
                    required
                    onChange={(e) =>
                      handleAddressInputChange(
                        address.AddressId,
                        "PostCode",
                        e.target.value
                      )
                    }
                  />
                  {showError.PostCode && (
                    <div className="error-message">{showError.PostCode}</div>
                  )}
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="submitBtn"
            form="editAddressForm"
          >
            {language === "en" ? "Update Address" : "تحديث العنوان"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UdateAddressModal;

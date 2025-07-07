import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Loader from "../components/Loader";
import { Form, Button, Row, Col } from "react-bootstrap";
 
 
 
 
const AddAddressModal = ({
  formtag,
  Formname,
  Addresses,
  language,
  countries,
  handleSubmit,
  handleChange,
  addressData,
  errors,
  formValid,
  loading,
  Formnamebefore,
}) => {
  const [modalshow, setmodalshow] = useState(false);
 
  const handleshow = () => {
    setmodalshow(true);
  };
 
  const modalclose = () => {
    setmodalshow(false);
  };
 
 
  return (
    <>
      {Addresses && Addresses.length > 0 ? (
        <div className="editBtn_wrap">
          <a className="editTxt" onClick={handleshow}>
            {Formname}
          </a>
        </div>
      ) : (
        <div>
          <a className="editTxt" onClick={handleshow}>
            {Formnamebefore}
          </a>
        </div>
      )}
 
      <Modal show={modalshow} onHide={modalclose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formtag}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="editAddressForm">
            {loading ? (
              <Loader />
            ) : (
              <Form
                onSubmit={handleSubmit}
                noValidate
                // validated={formValid}
         
                id="addAddress"
              >
                <Row className="row-vw">
                  <Col md={12}>
                    <Form.Group controlId="addressLine1" className="mrg-b-30">
                      <Form.Control
                        type="text"
                        placeholder={
                          language === "en"
                            ? "Address line 1"
                            : "العنوان 1"
                        }
                        className="cstInput"
                        name="AddressLine1"
                        value={addressData.AddressLine1}
                        onChange={handleChange}
                        isInvalid={!!errors.AddressLine1}
                        minLength="4"
                        required
                      />
                      <div className="error-message">{errors.AddressLine1}</div>
                    </Form.Group>
                  </Col>
 
                  <Col md={12}>
                    <Form.Group controlId="addressLine2" className="mrg-b-30">
                      <Form.Control
                        type="text"
                        placeholder={
                          language === "en"
                            ? "Address line 2"
                            : "العنوان 2"
                        }
                        className="cstInput"
                        name="AddressLine2"
                        value={addressData.AddressLine2}
                        onChange={handleChange}
                        isInvalid={!!errors.AddressLine2}
                        minLength="4"
                        required
                      />
                      <div className="error-message">{errors.AddressLine2}</div>
                    </Form.Group>
                  </Col>
 
                  <Col md={12}>
                    <Form.Group controlId="country" className="mrg-b-30">
                      <Form.Control
                        as="select"
                        className="cstInput"
                        name="Country"
                        value={addressData.Country}
                        onChange={handleChange}
                        required
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
                  </Col>
 
                  <Col md={6}>
                    <Form.Group controlId="state" className="mrg-b-30">
                      <Form.Control
                        type="text"
                        placeholder={
                          language === "en"
                            ? "Enter State"
                            : "ادخل الدولة"
                        }
                        className="cstInput"
                        name="State"
                        value={addressData.State}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
 
                  <Col md={6}>
                    <Form.Group controlId="city" className="mrg-b-30">
                      <Form.Control
                        type="text"
                        placeholder={
                          language === "en" ? "City" :"المدينة"
                        }
                        className="cstInput"
                        name="City"
                        value={addressData.City}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
 
                  <Col md={12}>
                    <Form.Group controlId="postCode" className="mrg-b-30">
                      <Form.Control
                        type="text"
                        placeholder={
                          language === "en" ? "Post Code" : "رمز البريد"
                        }
                        pattern="[0-9]*"
                        className="cstInput"
                        name="PostCode"
                        value={addressData.PostCode}
                        onChange={handleChange}
                        required
                      />
 
                      <div className="error-message">{errors.PostCode}</div>
                    </Form.Group>
                  </Col>
 
                  {formtag ===
                    (language === "en"
                      ? "  Shipping Address    "
                      : "عنوان الشحن") && (
                    <Col md={12}>
                      <div className="form-group mt-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="sameAddressCheckbox"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="sameAddressCheckbox"
                          >
                            {language === "en"
                              ? "Use same address for billing"
                              : "استخدم نفس عنوان الشحن"}
                          </label>
                        </div>
                      </div>
                    </Col>
                  )}
 
                  <Col md={12}>
                    <Form.Group>
                      <button
                        className="submitBtn"
                        type="submit"
                        disabled={!formValid}
                        form="addAddress"
                      >
                        {language === "en"
                          ? "Add Address"
                          : " أضف الشحن"}
                      </button>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </div>
 
        </Modal.Body>
      </Modal>
    </>
  );
};
 
export default AddAddressModal;
 
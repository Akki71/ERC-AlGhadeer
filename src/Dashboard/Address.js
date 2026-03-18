import React, { useEffect, useState } from 'react';
import DashboardNav from './DashboardNav';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Trash } from 'react-bootstrap-icons';
import Modal from "react-bootstrap/Modal";
import Loader from '../components/Loader';
import BASE_PATH from '../serviceurls';
import UdateAddressModal from './AddressModal';
import AddAddressModal from './AddAddress';
import { useLanguage } from '../redux/LanguageContext';
 
const Address = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [con, setLoading] = useState(false)
  const { language } = useLanguage();

  const UserID = localStorage.getItem('UserID');
  const tokenlogin = localStorage.getItem('loginToken');

  const [addressData, setAddressData] = useState({
 
    AddressLine1: '',
    AddressLine2: '',
    Country: 'Select Country',
    State: '',
    City: '',
    PostCode: '',
  });
  const [addressData2, setAddressData2] = useState({
 
    AddressLine1: '',
    AddressLine2: '',
    Country: 'Select Country',
    State: '',
    City: '',
    PostCode: '',
  });
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [errorsB, setErrorsB] = useState({
    AddressLine1: '',
    AddressLine2: '',
    PostCode: '',
    // Add other fields if needed
  });
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [errorsS, setErrorsS] = useState({
    AddressLine1: '',
    AddressLine2: '',
    PostCode: '',
    // Add other fields if needed
  });
  const [formValidB, setFormValidB] = useState(false);
  const [formValidS, setFormValidS] = useState(false);
 
  const handleChange = (e) => {
 
    let errorMessage = '';
 
    // Validation logic for Address Line 1
    if (e.target.name === 'AddressLine1') {
      if (e.target.value.length < 4) {
 
        errorMessage = 'Address line 1 must be add characters.';
      }
    }
    if (e.target.name === 'AddressLine2') {
      if (e.target.value.length < 4) {
 
        errorMessage = 'Address line 2 must be add characters.';
      }
    }
    if (e.target.name === 'PostCode') {
      const numericRegex = /^[0-9]+$/;
 
      if (!numericRegex.test(e.target.value)) {
        errorMessage = 'Pincode is in Numeric, ';
      }
    }
 
    setFormValidB(
      (addressData.AddressLine1.length >= 4) &&
      (addressData.AddressLine2.length >= 4)
    );
 
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
 
    setErrorsB({ ...errorsB, [e.target.name]: errorMessage });
  };
 
  const handleChange2 = (e) => {
 
 
    let errorMessage = '';
 
    if (e.target.name === 'AddressLine1') {
      if (e.target.value.length < 4) {
 
        errorMessage = (language === "en" ? "Address line 1 must be add characters." : "اضف بيانات لعنوان رقم 1");
 
      }
    }
    if (e.target.name === 'AddressLine2') {
      if (e.target.value.length < 4) {
 
        errorMessage = (language === "en" ? "Address line 2 must be add characters." : "اضف بيانات لعنوان رقم 2");
 
      }
    }
    if (e.target.name === 'PostCode') {
      const numericRegex = /^[0-9]+$/;
 
      if (!numericRegex.test(e.target.value)) {
        errorMessage = 'Pincode is in Numeric ';
      }
    }
 
    setFormValidS(
      (addressData2.AddressLine1.length >= 4) &&
      (addressData2.AddressLine2.length >= 4)
    );
 
 
 
    setAddressData2({
      ...addressData2,
      [e.target.name]: e.target.value,
    });
    setErrorsS({ ...errorsS, [e.target.name]: errorMessage });
  };
 
  const handleSubmit = (e) => {
 
    e.preventDefault();
    e.stopPropagation();
 
    setLoading(true);
    const requiredFields = ['AddressLine1', 'Country', 'State', 'City', 'PostCode'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    // console.log(addressData);
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => {
        return language === "en" ? field : "حقل " + field;
      }).join(", ");
 
      // Show message for missing fields
      toast.error(language === "en" ? `Please fill in the following fields: ${missingFieldNames}` : `يرجى تعبئة الخانات التالية:   : ${missingFieldNames}`);
 
      setLoading(false);
      return; // Exit function if fields are missing
    }
    const UserID = localStorage.getItem('UserID');
    const tokenlogin = localStorage.getItem('loginToken');
    fetch(`${BASE_PATH}Security/AddAddress`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${tokenlogin}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify({
        UserId: parseInt(UserID),
        IsDefault: true,
        IsSameAsBilling: false,
        AddressTypeId: 1,
 
        ...addressData,
      }),
    })
      .then(response => response.json())
      .then(data => {
 
        GetAllUserAddressesByUserId();
        setAddressData({
          AddressLine1: '',
          AddressLine2: '',
          Country: 'Select Country',
          State: '',
          City: '',
          PostCode: ''
        });
        toast.success(language === "en" ? "Address Added" : "تم إضافة العنوان");
 
        setLoading(false);
 
 
      })
      .catch(error => {
        console.error('Error:', error);
 
        toast.error(language === "en" ? "Failed to add Address" : "فشل في اضافة العنوان");
 
      });
 
 
  };
 
  const handleSubmit2 = (e) => {
    e.preventDefault();
    e.stopPropagation();
 
    setLoading(true);
   
 
    const requiredFields = ['AddressLine1', 'Country', 'State', 'City', 'PostCode'];
    const missingFields = requiredFields.filter(field => !addressData2[field]);
 
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => {
        return language === "en" ? field : "حقل " + field;
      }).join(", ");
 
      // Show message for missing fields
      toast.error(language === "en" ? `Please fill in the following fields: ${missingFieldNames}` : `يرجى تعبئة الخانات التالية: ${missingFieldNames}`);
      setLoading(false);
 
      return; // Exit function if fields are missing
    }
 
    const UserID = localStorage.getItem('UserID');
    const tokenlogin = localStorage.getItem('loginToken');
 
    const bodyData = {
      UserId: parseInt(UserID),
      ...addressData2,
      AddressTypeId: "2",
      IsDefault: true,
      IsSameAsBilling: document.getElementById('sameAddressCheckbox').checked // Set IsSameAsBilling based on checkbox
    };
 
    fetch(`${BASE_PATH}Security/AddAddress`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${tokenlogin}`,
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(bodyData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
 
      })
      .then(data => {
        // console.log(data);
 
        const latestAddressId = data.AddressId;
        // console.log(latestAddressId);
        setAddressAsDefault(latestAddressId);
 
        setAddressData2({
          AddressLine1: '',
          AddressLine2: '',
          Country: 'Select Country',
          State: '',
          City: '',
          PostCode: ''
        });
        GetAllUserAddressesByUserId();
 
        toast.success(language === "en" ? "Address Added" : "تم اضافة العنوان");
        // Handle redirection if needed
        setLoading(false);
      })
      .catch(error => {
        toast.error(language === "en" ? "Failed to add Address" : "فشل في إضافة العنوان");
        console.error('Error:', error);
 
      });
  };
 
 
  const GetAllUserAddressesByUserId = async () => {
    try {
      const response = await fetch(`${BASE_PATH}Security/GetAllUserAddressesByUserId?userId=${UserID}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${tokenlogin}`,
          'Content-Type': 'application/json-patch+json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const dataadd = await response.json();
      // console.log("GetAllUserAddresses", dataadd);
      // Assuming `dataadd` contains the array of address objects
 
      const billingAddresses = dataadd.filter(address => address.AddressTypeId === 1);
      const shippingAddresses = dataadd.filter(address => address.AddressTypeId === 2);
 
 
      setBillingAddresses(billingAddresses);
 
      setShippingAddresses(shippingAddresses);
 
    } catch (error) {
      console.error('GetAllUserAddressesByUserId', error);
      fetchUserDetails();
      // localStorage.removeItem("loginToken");
      // localStorage.removeItem("UserID");
      // language === "en" ?
      //   navigate("/login/en") :
      //   navigate("/login/ar");
 
    }
  };
  const updateAddress = (address) => {
 
    const requiredProperties = [
      'AddressId',
      'UserId',
      'AddressTypeId',
      'AddressLine1',
      'AddressLine2',
      'Country',
      'State',
      'City',
      'PostCode',
    ];
    const isMissingProperty = requiredProperties.some(prop => address[prop] === undefined);
    if (isMissingProperty) {
      console.error('Missing required fields in address data');
      return;
    }
    const apiUrl = `${BASE_PATH}Security/UpdateAddress`;
 
    const addressData = {
      AddressId: address.AddressId,
      UserId: address.UserId,
      AddressTypeId: address.AddressTypeId,
      AddressLine1: address.AddressLine1,
      AddressLine2: address.AddressLine2,
      Country: address.Country,
      State: address.State,
      City: address.City,
      PostCode: address.PostCode,
      IsDefault: true,
    };
    // console.log(addressData);
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json-patch+json',
        Authorization: `Bearer ${tokenlogin}`,
      },
      body: JSON.stringify(addressData),
    })
      .then((response) => response.json())
      .then((data) => {
        const latestAddressId = data.AddressId;
        // console.log(latestAddressId);
        setAddressAsDefault(latestAddressId);
        // console.log(' updating address:', data);
 
        toast.success(language === "en" ? "Address updated" : "تم تحديث العنوان");
      })
      .catch((error) => {
        console.error('Error updating address:', error);
        toast.error(language === "en" ? "Failed to update address" : "فشل في تحديث العنوان");
      });
  };
  const [showErrorB, setShowErrorb] = useState({
    AddressLine1: "",
    AddressLine2: "",
    PostCode: "",
  });
  const handleBillingAddressInputChange = (addressId, field, value) => {
 
    let errorMessage = '';
 
    if (field === 'AddressLine1') {
      if (value.length < 4) {
 
        errorMessage = (language === "en" ? "Address line 1 must be add characters." : "اضف بيانات لعنوان رقم 1");
 
      }
    }
    if (field === 'AddressLine2') {
      if (value.length < 4) {
 
        errorMessage = (language === "en" ? "Address line 2 must be add characters." : "اضف بيانات لعنوان رقم 2");
 
      }
    }
    if (field === 'PostCode') {
      const numericRegex = /^[0-9]+$/;
 
      if (!numericRegex.test(value)) {
        errorMessage = 'Pincode is in Numeric ';
      }
    }
    const updatedBillingAddresses = billingAddresses.map((address) => {
      if (address.AddressId === addressId) {
        return { ...address, [field]: value };
      }
      return address;
    });
    setBillingAddresses(updatedBillingAddresses);
 
    setShowErrorb({ ...showErrorB, [field]: errorMessage });
  };
 
  const [showErrorS, setShowErrors] = useState({
    AddressLine1: "",
    AddressLine2: "",
    PostCode: "",
  });
  const handleShippingAddressInputChange = (addressId, field, value) => {
    let errorMessage = '';
 
    if (field === 'AddressLine1') {
      if (value.length < 4) {
 
        errorMessage = (language === "en" ? "Address line 1 must be add characters." : "اضف بيانات لعنوان رقم 1");
 
      }
    }
    if (field === 'AddressLine2') {
      if (value.length < 4) {
 
        errorMessage = (language === "en" ? "Address line 2 must be add characters." : "اضف بيانات لعنوان رقم 2");
 
      }
    }
    if (field === 'PostCode') {
      const numericRegex = /^[0-9]+$/;
 
      if (!numericRegex.test(value)) {
        errorMessage = 'Pincode is in Numeric ';
      }
    }
 
    const updatedShippingAddresses = shippingAddresses.map((address) => {
      if (address.AddressId === addressId) {
        return { ...address, [field]: value };
      }
      return address;
    });
    setShippingAddresses(updatedShippingAddresses);
    setShowErrors({ ...showErrorS, [field]: errorMessage });
 
  };
 

 
  useEffect(() => {
    GetAllUserAddressesByUserId();
  }, []);
 
  const [show, setShow] = useState(false);
  const [add, setadd] = useState()
 
  const DeletingAddress = (AddressId) => {
    setadd(AddressId);
    let addressId = AddressId
    const addressOfTypeAddress = billingAddresses.find(address => address.AddressId === addressId) || shippingAddresses.find(address => address.AddressId === addressId);
 
    if (addressOfTypeAddress) {
      if (addressOfTypeAddress.IsDefault === false) {
        setShow(true);
      } else {
        setModalModalforDefaultAddress(true)
      }
    }
  }
 
  const handleClose1 = () => setShow(false);
  const handleDeleteAddress = () => {
 
    let addressId = add
 
    setLoading(true)
    fetch(`${BASE_PATH}Security/DeleteAddress?addressId=${addressId}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${tokenlogin}`,
      },
    })
      .then(response => {
        if (response.ok) {
          setBillingAddresses(billingAddresses.filter(address => address.AddressId !== addressId));
          setShippingAddresses(shippingAddresses.filter(address => address.AddressId !== addressId));
          setLoading(false)
        } else {
          throw new Error('Failed to delete address');
        }
      })
      .catch(error => console.error('Error deleting address:', error));
    setShow(false)
  };
  const [error, setError] = useState(null);
  const [ModalModalforDefaultAddress, setModalModalforDefaultAddress] =
    useState(false);
 
  const handleClosefordefaultModal = () =>
    setModalModalforDefaultAddress(false);
 
  const [countries, setCountries] = useState([]);
  const setAddressAsDefault = async (addressId) => {
 
    setLoading(true);
    try {
      const response = await fetch(`${BASE_PATH}Security/SetAddressAsDefault?addressId=${addressId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${tokenlogin}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      // console.log('SetAddressAsDefault response:', responseData);
      setLoading(false);
 
      GetAllUserAddressesByUserId();
 
    } catch (error) {
      console.error('SetAddressAsDefault', error);
    }
  };
  const fetchShippingData = () => {
    const apiUrl = `${BASE_PATH}Security/GetAllShippingCost`;
 
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenlogin}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized. Redirecting to login page...');
          } else {
            throw new Error('Failed to fetch shipping data');
          }
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Shipping costs data:", data);
        const countries = data.map((item) => item.Country);
 
        setCountries(countries);
      })
      .catch((error) => {
        console.error("Error fetching shipping data:", error);
        setError(error);
        if (error.message === 'Unauthorized. Redirecting to login page...') {
          // localStorage.removeItem("loginToken");
          // localStorage.removeItem("UserID");
          // navigate("/login")
        }
      });
  };
 
  useEffect(() => {
    window.scrollTo(0, 300);
 
    fetchShippingData();
    if (!UserID) {
      const loginPath = "/login";
      navigate(loginPath);
    }
  }, [UserID, tokenlogin, navigate, language]);
  const [firstName, setFirstName] = useState('');
 
  const fetchUserDetails = async () => {
    try {
      const apiUrlUser = `${BASE_PATH}Security/GetUserById?id=${UserID}`;
 
      const response = await fetch(apiUrlUser, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenlogin}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData.FirstName) {
          setFirstName(userData.FirstName);
        } else {
          setFirstName();
          // localStorage.removeItem('loginToken');
          // localStorage.removeItem('UserID');
          // If first name not found, navigate to login page based on selected language
          navigate("/login")
        }
      } else {
        console.error('Error fetching user details:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred during fetch:', error);
    }
  };
 
  return (
    <>
      <div>
        <ToastContainer />
        <div className="topBanner_sec">
          <div className="topBanner_inn">
            <img src={`${BASE_PATH}Images/Product/dashboard-bg.jpg`} className="w-100" alt="" />
          </div>
        </div>
        <div className="section_dashboard secBg">
          <div className="full-container container">
            <div className="row justify-content-center">
              <div className="col-md-3 col-xl-3 col-xxl-2">
                <DashboardNav />
              </div>
              <div className="col-md-9 col-xl-8 col-xxl-8">
                <div className="rightdashboard">
                  <>
                    {loading ? (
                      <Loader />
                    ) : (
                     
                          <>
                            <div className="row">
                              <div className="col-md-8">
                                <div className="shiping-adBox mrg-b-20">
                                  <div className="mrg-b-20">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="billtingTitle f-W-B">
                                        {language === "en"
                                          ? "Shipping Address"
                                          : " عنوان الشحن"}
                                      </div>
                                      <div className="select-default-address">
                                      </div>
                                    </div>
                                  </div>
 
                                  {shippingAddresses && shippingAddresses.length > 0 ? (
                                    shippingAddresses.slice().reverse().map((address) => (
 
                                      <div className="" key={address.AddressId} >
                                        <div className=" d-flex gap-2 mb-3 align-items-center">
                                          <div className="redio-item mb-0">
                                            <input
                                              type="radio"
                                              name="defaultShippingAddress"
                                              className="cstRedio"
                                              id={`shippingCheckBox-${address.AddressId}`}
                                              checked={address.IsDefault}
                                              onChange={() => setAddressAsDefault(address.AddressId)}
                                            />
                                            <label className="checkLable" htmlFor={`shippingCheckBox-${address.AddressId}`}>
                                              <div>
                                                {address.AddressLine1},
                                                {address.AddressLine2}, <br />
                                                {address.City}, {address.State}, {address.Country}, {address.PostCode}
                                              </div>
                                            </label>
                                          </div>
                                          <UdateAddressModal
                                            Formname={language === "en"
                                              ? "Shipping Address"
                                              : "عنوان الشحن"}
                                            handleAddressInputChange={handleShippingAddressInputChange}
                                            showError={showErrorS}
                                            address={address}
                                            countries={countries}
                                            language={language}
                                            updateAddress={updateAddress}
                                            GetAllUserAddressesByUserId={GetAllUserAddressesByUserId}
                                          />
                                          <button
                                            type="button"
                                            className="btn w-10  font-Lyon btn-address"
                                            onClick={() => (DeletingAddress(address.AddressId, address.AddressTypeId))}
                                          >
                                            <Trash />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div></div>
                                  )}
 
                                  <AddAddressModal
                                    formtag={language === "en"
                                      ? "  Shipping Address    "
                                      : "عنوان الشحن"}
                                    Formnamebefore={language === "en" ? "Add Shipping Address" : "أضف عنوان الشحن"}
                                    Formname={language === "en"
                                      ? "Add new shipping address"
                                      : "أضف عنوان الشحن"}
                                    Addresses={shippingAddresses}
                                    handleSubmit={handleSubmit2}
                                    handleChange={handleChange2}
                                    addressData={addressData2}
                                    errors={errorsS}
                                    formValid={formValidS}
                                    language={language}
                                    countries={countries}
                                    loading={loading}
                                  />
 
                                </div>
                              </div>
                              <div className="col-md-8">
                                <div className="shiping-adBox mrg-b-20">
                                  <div className="mrg-b-20">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="billtingTitle f-W-B">
                                        {language === "en"
                                          ? "  Billing Address    "
                                          : " عنوان وصول الفواتير "}
                                      </div>
                                      <div className="select-default-address"></div>
                                    </div>
                                  </div>
                                  {billingAddresses && billingAddresses.length > 0 ? (
                                    billingAddresses.slice().reverse().map((address) => (
                                      <div className="" key={address.AddressId}>
                                        <div className=" d-flex gap-2 align-items-center mb-3">
                                          <div className="redio-item mb-0">
                                            <input
                                              type="radio"
                                              name="defaultBillingAddressytfuydfy"
                                              className="cstRedio"
                                              id={`billingCheckBox-${address.AddressId}`}
                                              checked={address.IsDefault}
                                              // checked={true}
                                              onChange={() => setAddressAsDefault(address.AddressId)}
                                            />
                                            <label className="checkLable" htmlFor={`billingCheckBox-${address.AddressId}`}>
                                              <div>
                                                {address.AddressLine1},
                                                {address.AddressLine2}, <br />
                                                {address.City}, {address.State}, {address.Country}, {address.PostCode}
                                              </div>
                                            </label>
                                          </div>
                                          <div className="editBtn_wrap">
                                            <UdateAddressModal
                                              Formname={language === "en"
                                                ? "  Billing Address    "
                                                : " عنوان وصول الفواتير: "}
                                              handleAddressInputChange={handleBillingAddressInputChange}
                                              showError={showErrorB}
                                              address={address}
                                              countries={countries}
                                              language={language}
                                              updateAddress={updateAddress}
                                              GetAllUserAddressesByUserId={GetAllUserAddressesByUserId}
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            className="btn w-10  font-Lyon btn-address"
 
                                            onClick={() => DeletingAddress(address.AddressId, address.AddressTypeId)}
                                          >
                                            <Trash />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div></div>
                                  )}
 
                                  <AddAddressModal
                                    formtag={language === "en"
                                      ? "Billing Address"
                                      : "عنوان وصول الفواتير"}
                                    Formnamebefore={language === "en"
                                      ? "Add Billing Address "
                                      : "إضافة عنوان الفواتير"}
                                    Formname={language === "en"
                                      ? "Add New Billing Address"
                                      : "إضافة عناوين الفواتير  "}
                                    Addresses={billingAddresses}
                                    handleSubmit={handleSubmit}
                                    handleChange={handleChange}
                                    addressData={addressData}
                                    errors={errorsB}
                                    formValid={formValidB}
                                    language={language}
                                    countries={countries}
                                    loading={loading}
                                  />
                                  <Modal
                                    show={ModalModalforDefaultAddress}
                                    onHide={handleClosefordefaultModal}
                                    backdrop="static"
                                    keyboard={false}
                                    centered
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title>  {language === "en" ? "Default Address Cannot Be Deleted " : "العنوان الأساسي لا يمكن حذفه"}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      {language === "en" ? "This address is set as the default. " : "تم إضافة هذا العنوان كعنوان أساسي"}
                                      <br />  {language === "en" ? "To delete it, please designate another address as the default first. " : "للحذف، يرجى إضافة عنوان آخر كعنوان أساسي"}
 
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <button className="submitBtn" onClick={handleClosefordefaultModal}>
                                        {language === "en" ? " ok" : " نعم "}
                                      </button>
                                    </Modal.Footer>
                                  </Modal>
 
                                  <Modal
                                    show={show}
                                    onHide={handleClose1}
                                    backdrop="static"
                                    keyboard={false}
                                    centered
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title> {language === "en" ? "Delete Address Confirmation " : "  عنوان وصول الفواتير  "}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      {language === "en" ? "   This will delete the address from your account." : "This will delete the address from your account."}
                                      <br /> {language === "en" ? "Are you sure? " : " هل أنت متأكد؟"}
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <button className="submitBtn" onClick={() => handleDeleteAddress()}>
                                        {language === "en" ? "Yes" : "نعم"}
 
                                      </button>
                                      <button className="submitBtn" onClick={handleClose1}>
                                        {language === "en" ? "No" : "لا"}
 
                                      </button>
                                    </Modal.Footer>
                                  </Modal>
                                </div>
                              </div>
                            </div>
                          </>
                      )}
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default Address;
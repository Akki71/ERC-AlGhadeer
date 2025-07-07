import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import BASE_PATH from "../serviceurls";
import { useLanguage } from '../redux/LanguageContext';

const API_URL = `${BASE_PATH}Security`;
const UAE_PASS_AUTH_URL =
  'https://stg-id.uaepass.ae/idshub/authorize?response_type=code&client_id=sandbox_stage&scope=urn:uae:digitalid:profile:general&state=HnlHOJTkTb66Y5H&redirect_uri=https://stg-selfcare.uaepass.ae&acr_values=urn:safelayer:tws:policies:authentication:level:low';

let registrationDetails = null;

const AuthService = {
  register: async (FirstName, LastName, EmailId, Password) => {
    const data = {
      FirstName,
      LastName,
      EmailId,
      Password,
    };

    try {
      const response = await axios.post(`${API_URL}/AddUser`, data);
      return response; 
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  initiateUaePassLogin: async () => {
    try {
      const response = await axios.get(UAE_PASS_AUTH_URL, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      // console.log('UAE Pass Auth Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('UAE Pass Auth Failed:', error);
      throw error;
    }
  },

  getRegistrationDetails: () => {
    return registrationDetails;
  },

  login: async (EmailId, Password, FirstName, language) => {
    try {
      const response = await axios.post(`${API_URL}/LoginUser`, {
        EmailId: EmailId,
        Password: Password,
        FirstName: FirstName,
        Token: '',
      });
      return response;
    } catch (error) {
      if (error.response.data.error === "Password is invalid.") {
        toast.error(language === "en" ? "Password is invalid." : "كلمة السر غير صحيحة");
        // console.log("Invalid password error:", error.response.data.error);
      } else if (error.response.data.error === "User Not Found. Please Signup.") {
        toast.error(language === "en" ? "User Not Found. Please Signup." : "مستخدم غير موجود، يرجى تسجيل الدخول");
        // console.log("User not found error:", error.response.data.error);
      } else {
        console.error('Login failed:', error);
        throw error;
      }
    }
  },

  logout: (navigate) => {
    localStorage.removeItem('Token');
    navigate('/login');
  },

  getCurrentUser: () => {
    const user = JSON.parse(localStorage.getItem('Token'));
    return user;
  },
};

export const useAuthService = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const register = async (FirstName, LastName, EmailId, Password) => {
    return AuthService.register(FirstName, LastName, EmailId, Password);
  };

  const initiateUaePassLogin = async () => {
    return AuthService.initiateUaePassLogin();
  };

  const login = async (EmailId, Password, FirstName) => {
    return AuthService.login(EmailId, Password, FirstName, language);
  };

  const logout = () => {
    AuthService.logout(navigate);
  };

  const getRegistrationDetails = () => {
    return AuthService.getRegistrationDetails();
  };

  const getCurrentUser = () => {
    return AuthService.getCurrentUser();
  };

  return {
    register,
    initiateUaePassLogin,
    login,
    logout,
    getRegistrationDetails,
    getCurrentUser,
  };
};

export default AuthService;

import React, { useEffect } from 'react'
// import AuthService from './AuthService';
import handleClick from '../components/links';
import { useLanguage } from '../redux/LanguageContext';
const TermsCondition = () => {
const { language} = useLanguage();  useEffect(() => { handleClick() }, [handleClick])
  useEffect(() => { window.scrollTo(0, 0); }, []);
  // const handleLogout = async () => {
  //   try {
  //     await AuthService.logout();

  //     console.log('Logout successful');
  //     window.location.href = '/login';
  //   } catch (error) {
  //     console.error('Logout failed:', error);

  //   }
  // };

  return (

    <div className="privacyPolicy_sec secBg">
      <div className="full-container container">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="privacyTxt_wrap">
              <div className="secTitle_wrap mrg-b-30">
                <div className="sec_subTitle font-Lyon f-s-20">
                  {language === "en"
                    ? "Terms and Condition"
                    : "الأحكام والشروط" }


                </div>
                {/* <div className="secTitle f-s-30"> Terms and Conditions </div> */}
              </div>
              {/* <div className="privacyTxt mrg-b-30 f-s-20">
                <p> The customer acknowledges the validity of all his data, including name, address, phone number, email address, and credit card numbers used for purchases.  </p>
              
              </div> */}
            </div>
            <div className="privacyTxt_wrap">
              <div className="secTitle_wrap">
                <div className="secTitle f-s-30">
                  {language === "en"
                    ? "Terms and Condition"
                    : "الأحكام والشروط"}
                </div>
              </div>
              <div className="privacyTxt mrg-b-30 f-s-20">
                <p> 
                {language === "en"
                  ? " The customer acknowledges the validity of all his data, including name, address, phone number, email address, and credit card numbers used for purchases. "
                  : " يقر العميل بصحة كافة بياناته، الاسم والعنوان ورقم الهاتف وعنوان البريد الإلكتروني وأرقام بطاقات الائتمان المستخدمة في عمليات الشراء "}
              </p>
              </div>
            </div>
            <div className="privacyTxt_wrap">
              <div className="secTitle_wrap">
                <div className="secTitle f-s-30">
                  {language === "en"
                    ? " Cancellation Policy  "
                    : "   سياسة الإلغاء  "}

                </div>
              </div>
              <div className="privacyTxt mrg-b-30 f-s-20">
                <p>
                  {language === "en"
                    ? "  The customer has the right to cancel the order before sending the shipment within 24 hours only.  "
                    : "   يحق للعميل إلغاء الطلب قبل إرسال الشحنة في غضون 24 ساعة فقط   "}
                </p>

                <p>
                  {language === "en"
                    ? "  Cancellation of the shipment after it has been sent is rejected.   "
                    : "   يعتبر إلغاء الشحنة بعد إرسالها مرفوض   "}

                </p>
                <p>

                  {language === "en"
                    ? "  The store has the right, if the payment is (bank transfer), to cancel the customer’s request after 24 hours have passed from the date of the request without transferring and attaching the receipt. "
                    : "   يحق للغدير في حال كان الدفع (تحويل بنكي) إلغاء طلب العميل بعد مرور 24 ساعة من تاريخ الطلب دون التحويل وارفاق الايصال.    "}
</p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>

  )
}

export default TermsCondition
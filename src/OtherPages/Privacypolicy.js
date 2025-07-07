import React from 'react'
import { useEffect } from 'react';
import handleClick from '../components/links';
import { useLanguage } from '../redux/LanguageContext';
const Privacypolicy = () => {
  useEffect(() => { handleClick() }, [handleClick])
  useEffect(() => {    window.scrollTo(0, 0);  }, []);
const { language} = useLanguage();  return (
    <div className="privacyPolicy_sec secBg">
  <div className="full-container container">
    <div className="row justify-content-center">
      <div className="col-md-9">
        <div className="privacyTxt_wrap">
        <div className="secTitle_wrap mrg-b-30"> 
           <div className="sec_subTitle font-Lyon f-s-20"> 
        

           {language === "en"
                        ? "Privacy Policy "
                        :"   سياسة الخصوصية"}
           </div>
           {/* <div className="secTitle f-s-30"> {language === "en"
                        ? " privacy policy  "
                        :"    "}  </div> */}
        </div>
        {/* <div className="privacyTxt mrg-b-30 f-s-20">
          <p>   {language === "en"
                        ? " Protecting your data is a matter of trust, and your privacy is important to us. Therefore, we only use your data for the purpose of our store.  "
                        :"    "} </p>
      
        </div> */}
        </div>

        <div className="privacyTxt_wrap">
          <div className="secTitle_wrap"> 
           <div className="secTitle f-s-30">{language === "en"
                        ? " Privacy Policy  "
                        :"  سياسة الخصوصية     "}
         
            </div>           
          </div>
          <div className="privacyTxt mrg-b-30 f-s-20">
            <p>   {language === "en"
                        ? " Protecting your data is a matter of trust, and your privacy is important to us. Therefore, we only use your data for the purpose of our store.  "
                        :"حماية بياناتك هو مسألة ثقة، وخصوصيتك مهمه لنا. لذلك لا نستعمل بياناتك إلا لغرض متجرنا.    "} </p>
            
          </div>
        </div>


        <div className="privacyTxt_wrap">
          <div className="secTitle_wrap"> 
           <div className="secTitle f-s-30"> 
           {language === "en"
                        ? "Replacement Policy    "
                        :"   سياسة الاستبدال    "}</div>           
          </div>
          <div className="privacyTxt mrg-b-30 f-s-20">
            <p>   {language === "en"
                        ? "The customer has the right to replace the product or order in the event that there is an error from the store, or the product is damaged and please tell us within 24 hours only of receiving the order.   "
                        :"يحق للعميل استبدال المنتج أو الطلب في حال كان هناك خطأ من المتجر أو تلف المنتج ويرجى اخبارنا في غضون 24 ساعة فقط من استلام الطلب.  سياسة الاسترجاع "} </p>
           
       
          </div>
        </div>

        <div className="privacyTxt_wrap">
          <div className="secTitle_wrap"> 
           <div className="secTitle f-s-30">
           {language === "en"
                        ? "Return Policy   "
                        :"  سياسة الاسترجاع    "} 
           
            </div>           
          </div>
          <div className="privacyTxt mrg-b-30 f-s-20">
            <p>   {language === "en"
                        ? " In case there is an error from the store or product damage, the amount paid for the order will be refunded as points in AlGhadeer store. The store must be notified within 24 hours of receiving the order.  "
                        :"                         في حال كان هناك خطأ من المتجر أو تلف المنتج وطلب العميل استرجاع المبلغ سيتم استرجاع قيمة الطلب كنقاط في متجر الغدير ويجب اخبار المتجر خلال 24 ساعة فقط من استلام الطلب.                         للأسف، لا يمكننا أن نعرض عليك استردادًا أو تبديل إذا مرت أكثر من ٢٤ ساعة على استلام المنتج، ولتكون مؤهلاً للحصول على الاسترداد، يجب ان يكون المنتج بنفس حالته الأصلية عند الشراء.    "} </p>
          
          </div>
        </div>

      </div>
    </div>
  </div>  
</div>
  )
}

export default Privacypolicy
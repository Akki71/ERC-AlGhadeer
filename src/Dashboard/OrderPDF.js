import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import AL_Ghadeer_main_logo from "../assets/images/AL-Ghadeer-main-logo.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#EADAC9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#9F926D",
    padding: 10,
  },
  logoSection: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    width: 100,
  },
  siteInfo: {
    fontSize: 10,
    color: "#EADAC9",
  },
  siteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EADAC9",
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#9F926D",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: "#333",
  },
  table: {
    display: "table",
    width: "auto",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#9F926D",
    borderWidth: 1,
    padding: 5,
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
    color: "#333",
  },
  footer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#9F926D",
    color: "#EADAC9",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});

const OrderPDF = ({ invoiceData, filteredOrder, language }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with logo, site name, address, and social media */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Image source={AL_Ghadeer_main_logo} style={styles.logo} />
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={styles.siteTitle}>The AlGhadeer Emirati Crafts</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>
          {language === "en" ? "Order Details" : "تفاصيل الطلب"}
        </Text>

        {/* Order Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {language === "en" ? "Order ID" : "رقم الطلب"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {language === "en" ? "Product Name" : "اسم المنتج"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {language === "en" ? "Product Size" : "حجم المنتج"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {language === "en" ? "Total" : "المجموع"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
              {language === "en"
                                      ? "  Product color   "
                                      : " لون المنتج    "}
              </Text>
            </View>
          </View>
          {filteredOrder.map((orderItem, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{orderItem.OrderId}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {language === "en"
                    ? orderItem.ProductNameE
                    : orderItem.ProductNameA}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {language === "en"
                    ? orderItem.ProductSizeNameE
                    : orderItem.ProductSizeNameA}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {orderItem.OrderQuantity * orderItem.OrderPrice}
                </Text>
              </View>
             <View style={styles.tableCol}>
  <Text style={styles.tableCell}>
    {(() => {
      try {
        const colorOrdered = JSON.parse(orderItem.ProductColorOrdered);
        return colorOrdered?.ProductColorNameE || " ";
      } catch (error) {
        console.error("Error parsing ProductColorOrdered:", error);
        return " ";
      }
    })()}
  </Text>
</View>

            </View>
          ))}
        </View>
      </View>
      {/* User Details */}
      <View style={styles.section}>
        <Text style={styles.heading}>
          {language === "en" ? "User Details" : "بيانات المستخدم"}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Contact Name:" : "اسم المتصل:"}{" "}
          {invoiceData.OrderList[0]?.UserName || "N/A"}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Contact Mobile:" : "هاتف التواصل:"}{" "}
          {invoiceData.ContactMobile || "N/A"}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Contact Email:" : "عنوان بريد التواصل:"}{" "}
          {invoiceData.ContactEmail || "N/A"}
        </Text>
      </View>

      {/* Invoice Details */}
      <View style={styles.section}>
        <Text style={styles.heading}>
          {language === "en" ? "Invoice Details" : "تفاصيل الفاتورة"}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Invoice ID:" : "رقم الفاتورة:"}{" "}
          {invoiceData.InvoiceId}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Transaction ID:" : "رقم المعاملة:"}{" "}
          {invoiceData.TransactionId}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Billing Address:" : "عنوان وصول الفواتير:"}{" "}
          {invoiceData.BillingAddress}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Shipping Address:" : "عنوان الشحن:"}{" "}
          {invoiceData.ShippingAddress}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Total Amount:" : "المبلغ الإجمالي:"}{" "}
          {invoiceData.TotalAmount}
        </Text>
        <Text style={styles.text}>
          {language === "en" ? "Created Date:" : "تاريخ الإنشاء:"}{" "}
          {new Date(invoiceData.CreatedDate).toLocaleString()}
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {language === "en"
            ? "Thank you for shopping with AL-Ghadeer!"
            : "شكراً لتسوقك مع الغدير!"}
        </Text>
        <Text style={styles.footerText}>
          {language === "en"
            ? "For more information, visit our website or follow us on Instagram."
            : "لمزيد من المعلومات، تفضل بزيارة موقعنا أو تابعنا على إنستغرام."}
        </Text>
      </View>
    </Page>
  </Document>
);

export default OrderPDF;

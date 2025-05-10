import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Razorpay() {
  const navigate = useNavigate();
  const [paymentId, setPaymentId] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  const location = useLocation();
  const { total } = location.state || { total: 0 };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Prevent multiple script inserts
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrderAndOpenCheckout = async (amount) => {
    const isSdkLoaded = await loadRazorpayScript();
    if (!isSdkLoaded) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    try {
      // Call backend to create order
      const { data } = await axios.post("http://localhost:3001/Razorpay", {
        amount: amount * 100,
        currency: "INR",
      });

      const options = {
        key: "rzp_test_e3YrzIvK51IX4w", // Replace with your Razorpay Key ID
        amount: data.amount,
        currency: data.currency,
        name: "Ravi Kumar",
        description: "Test Transaction",
        order_id: data.order_id,
        handler: function (response) {
          setPaymentId(response.razorpay_payment_id);
          alert(
            "Payment successful! Order Placed Payment ID: " +
              response.razorpay_payment_id
          );
        },
        prefill: {
          name: "Papaya Coders",
          email: "papayacoders@gmail.com",
        },
        theme: {
          color: "#F4C430",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert(
        "Error in creating order: " + (error.response?.data || error.message)
      );
    }
  };

  const fetchPaymentDetails = async (e) => {
    e.preventDefault();
    const paymentId = e.target.paymentId.value.trim();
    if (!paymentId) {
      alert("Please enter a Payment ID");
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:3001/payment/${paymentId}`
      );
      setPaymentDetails(data);
    } catch (error) {
      alert(
        "Failed to fetch payment details: " +
          (error.response?.data || error.message)
      );
      setPaymentDetails(null);
    }
  };

  const seeOrders = () => {
    navigate("/profile/orderHistory");
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Make a Payment</h2>
      <button
        onClick={() => createOrderAndOpenCheckout(total)}
        style={{
          backgroundColor: "#F4C430",
          border: "none",
          padding: "12px",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        Pay {total}
      </button>

      {paymentId && (
        <p>
          <strong>Last Payment ID:</strong> {paymentId}
        </p>
      )}

      <h3>Verify Payment</h3>
      <form onSubmit={fetchPaymentDetails} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="paymentId"
          placeholder="Enter Payment ID"
          style={{
            padding: "8px",
            width: "calc(100% - 100px)",
            marginRight: 8,
          }}
        />
        <button
          type="submit"
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Fetch Payment
        </button>
      </form>
      <button
        type="button"
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          color: "blue",
          borderColor: "black",
          borderBottomWidth: 2,
        }}
        onClick={seeOrders}
      >
        see order
      </button>

      {paymentDetails && (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Amount:</strong> ₹{paymentDetails.amount / 100}
          </p>
          <p>
            <strong>Currency:</strong> {paymentDetails.currency}
          </p>
          <p>
            <strong>Status:</strong> {paymentDetails.status}
          </p>
          <p>
            <strong>Method:</strong> {paymentDetails.method}
          </p>
        </div>
      )}
    </div>
  );
}

export default Razorpay;

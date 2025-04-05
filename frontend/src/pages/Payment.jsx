// pages/PaymentPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getBookingById } from '../services/bookingService';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const bookingData = await getBookingById(bookingId);
        setBooking(bookingData);
      } catch (error) {
        console.error('Error loading booking:', error);
      }
    };
  
    loadBooking(); // ✅ Call the function here
  }, [bookingId]);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create Razorpay order from backend
      const { data: order } = await axios.post('/api/payment/pay', {
        bookingId,
        amount: booking.packageId.price * 100, // in paise
        currency: 'INR',
      });

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add in your .env
        amount: order.amount,
        currency: order.currency,
        name: 'Travel Booking',
        description: `Payment for ${booking.packageId.destination}`,
        order_id: order.orderId,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          const verification = await axios.post('/api/payment/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            bookingId,
          });

          alert(verification.data.message);
          navigate('/customer-dashboard');
        },
        prefill: {
          name: booking.customerId.name,
          email: booking.customerId.email,
        },
        theme: {
          color: '#6366F1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 flex justify-center items-center bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">Complete Your Payment</h2>

        {booking ? (
          <div className="space-y-4">
            <p><strong>Destination:</strong> {booking.packageId?.destination}</p>
            <p><strong>Price:</strong> ₹{booking.packageId?.price}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            {booking.status !== 'confirmed' ? (
              <button
                onClick={handlePayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            ) : (
              <div className="text-green-600 font-bold text-center">Payment Already Completed</div>
            )}
          </div>
        ) : (
          <p>Loading booking details...</p>
        )}
      </div>
    </div>
  );
};

export default Payment;

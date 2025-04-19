import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { userDetailsFromToken } from '../../utils/userDetailsFromToken';
import { toast } from 'react-toastify';

const CheckoutForm = ({totalCost,plan}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const userId = userDetailsFromToken()?.user_id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setMessage('Payment system is not ready. Please try again.');
      return;
    }
  
    setIsLoading(true);
    setMessage(null);
  
    try {
      console.log(plan);
      // Get the client secret from your API
      const response = await api.post(`/api/v1/payment/create-payment-intent`, {
        amount: Math.round(totalCost * 100),
        currency: 'usd',
      });
      
      // Extract the client secret from the response
      const { clientSecret } = response.data;
      
      if (!clientSecret) {
        throw new Error('Failed to get payment details from server');
      }
  
      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });
  
      if (error) {
        throw error;
      }
  
      if (paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        // Additional logic after successful payment
        const response = await api.put(`/api/v1/subscriptions/update-subscription-plan/${userId}/${plan}`)
        console.log(response);
        localStorage.setItem("status","ACTIVE");
        toast.success(`${response?.data}`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '18px',
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#e53e3e',
      },
    },
  };

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Enter Your Card Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Number Field */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Card Number</label>
          <div className="p-4 border rounded-lg bg-gray-100">
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        {/* Expiry Date Field */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Expiry Date</label>
          <div className="p-4 border rounded-lg bg-gray-100">
            <CardExpiryElement options={cardStyle} />
          </div>
        </div>

        {/* CVC Field */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">CVC</label>
          <div className="p-4 border rounded-lg bg-gray-100">
            <CardCvcElement options={cardStyle} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          className={`w-full py-4 mt-4 text-white font-bold rounded-lg ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          type="submit"
        >
          {isLoading ? 'Processing...' : `Pay $${totalCost}`}
        </button>

        {/* Message display */}
        {message && (
          <div
            className={`text-center mt-4 p-3 rounded ${
              message.includes('succeeded') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;

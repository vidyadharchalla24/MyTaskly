import React from 'react';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
const VITE_STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Load the Stripe publishable key from the environment variables
const stripePromise = loadStripe(VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const {plan,price} = location.state;

  return (
    <Elements stripe={stripePromise}>
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="max-w-md w-full p-5 border border-gray-300 rounded-md bg-white shadow-md">
          <h2 className="text-2xl font-bold text-center mb-5">Complete Your Payment</h2>
          <CheckoutForm totalCost={price} plan={plan} />
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;

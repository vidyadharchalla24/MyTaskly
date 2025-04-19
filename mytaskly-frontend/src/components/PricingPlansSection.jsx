// components/PricingPlansSection.jsx

import React from "react";
import { pricingPlans } from "../data";
import { userDetailsFromToken } from "../utils/userDetailsFromToken";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const PricingPlansSection = () => {
    const navigate = useNavigate();
    const isAuth = userDetailsFromToken();

    const handleChoosePlan= async (plan,price)=>{

        const response = await api.get(`/api/v1/subscriptions/user/${isAuth?.user_id}`);
        console.log(response.data);
        const planId = response?.data?.planId;
        const status = response?.data?.status;

        if(plan === planId && status === "ACTIVE"){
            toast.success(`You choose ongoing plan. please select different plan..`);
        }

        navigate('/payment-page',{
            state:{
                plan,
                price
            }
        })
    }

  return (
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold text-white">Pricing Plans</h2>
      <p className="text-white mt-2">
        Choose a plan that fits your personal or team workflow needs.
      </p>

      <div className="mt-8 flex flex-col md:flex-row justify-center gap-6">
        {pricingPlans.map(({ id, title,value, price, description, features }) => (
          <div key={id} className="bg-[#23486A] p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-3xl font-bold text-white">{(price === "Free")?price:`$${price}`}</p>
            <p className="text-white">{description}</p>
            <ul className="mt-4 text-white text-left space-y-2">
              {features.map((feature, index) => (
                <li key={index}>✔ {feature}</li>
              ))}
            </ul>
            {isAuth && <button className="mt-6 px-6 py-2 bg-[#EFB036] text-white rounded"
            onClick={()=>handleChoosePlan(value,price)}
            >
              Choose Plan
            </button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlansSection;

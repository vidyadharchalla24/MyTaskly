import React, { useContext, useState, useEffect } from "react";
import { TokenContext } from "../utils/TokenContext";
import api from "../utils/api";
import {  useNavigate } from "react-router-dom";


const Dashboard = () => {
  const { decodedToken } = useContext(TokenContext);
  const [data, setData] = useState([]);
  const name = decodedToken?.name;
  const navigate = useNavigate();


  const handleClick = (org) => {
    if (!org.organizationName) {
      console.error("Organization name is missing!");
      return;
    }
    navigate(`/organization`,{state:{
      organizationName:org.organizationName
    }});
  };




  useEffect(() => {
    api
      .get("/api/v1/organizations")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log("Error fetching organizations:", err));
  }, []);

  return (
    <div className="text-[poppins]">
      <div className="ml-5 text-center">
        <h1 className="text-2xl font-bold text-[#3B6790]">Welcome,<span className="text-[#EFB036]">{name}</span> </h1>
      </div>

      {/* Organization cards */}
      <section class="text-white font-[Poppins]">
        <div class="container px-5 py-24 mx-auto grid grid-cols-4 gap-10">

          {data.map((org) => (
            <div class="flex flex-wrap -m-4">
              <div class=" p-240 ">
                <div class="border border-gray-200 p-6 rounded-lg bg-[#4C7B8B]">
                  <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-[#EFB036] mb-4">
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h2 class="text-lg text-white font-medium title-font mb-2 Font-bold">{org.organizationName}</h2>
                  <button
                    onClick={() => handleClick(org)}
                    className="leading-relaxed text-base mb-2 underline decoration-1"
                  >
                    Click Here for More Details about this Organization
                  </button>

                </div>
              </div>
            </div>
          ))}


        </div>
      </section>
    </div>
  );
};

export default Dashboard;

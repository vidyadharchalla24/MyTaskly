import React, { useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Dashboard = () => {
  const { userDetails,isOrganizationUpdated,setIsOrganizationUpdated } = useContext(UserContext);
  const [data, setData] = useState([]);
  const name = userDetails?.name;
  const userId = userDetails?.user_id;
  const navigate = useNavigate();

  const handleClick = (org) => {
    if (!org.organizationName) {
      console.error("Organization name is missing!");
      return;
    }
    navigate(`/organization`, {
      state: {
        organizationName: org.organizationName,
      },
    });
  };

  useEffect(() => {
    const fetchOrganizationData = async()=>{
      setIsOrganizationUpdated(false);
      try {
        const response = await api.get(`/api/v1/organizations/user/allOrganizations/${userId}`);
        // console.log(response?.data);
        setData(response?.data);
      } catch (error) {
        console.log("error fetching data", error);
      }
    }

    fetchOrganizationData();
  }, [isOrganizationUpdated]);

  return (
    <div className="text-[poppins]">
      <div className="ml-5 text-center">
        <h1 className="text-2xl font-bold text-[#3B6790]">
          Welcome,<span className="text-[#EFB036]">{name}</span>{" "}
        </h1>
      </div>

      {/* Organization cards */}
      <section className="text-white font-[Poppins]">
        <div className="container px-5 py-24 mx-auto grid grid-cols-4 gap-10">
          {data.map((org) => (
            <div className="flex flex-wrap -m-4" key={org?.organizationsId}>
              <div className=" p-240 ">
                <div className="border border-gray-200 p-6 rounded-lg bg-[#4C7B8B]">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-[#EFB036] mb-4">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg text-white font-medium title-font mb-2 Font-bold">
                    {org.organizationName}
                  </h2>
                  <button
                    onClick={() => handleClick(org)}
                    className="leading-relaxed text-base mb-2 underline decoration-1"
                  >
                    Click Here To View Projects
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

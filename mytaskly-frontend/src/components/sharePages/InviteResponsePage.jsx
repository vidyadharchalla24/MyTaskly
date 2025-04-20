import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";

export default function InviteResponsePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing your invitation...");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    
    const sendData = async () => {
      if (!accessToken) {
        setStatus("You need to be logged in to respond to invitations.");
        setIsProcessing(false);
        return;
      }

      const token = params.get("token");
      const response = params.get("response");

      if (!token || !response) {
        setStatus("Invalid invitation parameters.");
        setIsProcessing(false);
        return;
      }

      try {
        // Add a flag in sessionStorage to prevent duplicate API calls on refresh
        const responseKey = `invitation_${token}`;
        const hasResponded = sessionStorage.getItem(responseKey);
        
        if (hasResponded) {
          setStatus("This invitation has already been processed.");
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }

        // Mark as processed before making the API call
        sessionStorage.setItem(responseKey, "true");
        
        const dataResponse = await api.post(
          `/api/v1/invitations/respond?token=${token}&response=${
            response === "accept"
          }`
        );
        const accessRole = localStorage.getItem('accessRole');
        if(!accessRole){
          localStorage.setItem('accessRole',"DEV");
        }
        setStatus(dataResponse.data || "Invitation processed successfully.");
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error) {
        console.error(error);
        setStatus(error.response?.data || "Error processing invitation.");
        setIsProcessing(false);
      }
    };

    if (isProcessing) {
      sendData();
    }
  }, [isProcessing, navigate, params]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-semibold mb-4">{status}</h1>
      {!isProcessing && (
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>
      )}
    </div>
  );
}
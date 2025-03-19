import { useContext, useState } from "react";
import api from "../../utils/api";
import { UserContext } from "../../context/UserContext";

const CreateOrganization = ({ userId, onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const {setIsOrganizationUpdated} = useContext(UserContext);
  const [organizationName,setOrganizationName] = useState('');

  const handleSubmit = async () => {
    if (!organizationName.trim()) {
      alert("Please enter an organization name!");
      return;
    }
    if (!userId) {
      console.log("Error: UserId not found");
      return;
    }

    try {
      const response = await api.post(
        `/api/v1/organizations/${userId}`,
        null,
        { params: { organizationName: organizationName } }
      );

      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true); // Show success modal
        setIsOrganizationUpdated(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 1000);
        
      }
      setOrganizationName("");
    } catch (error) {
      alert(`${error.response?.data?.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full font-[Poppins]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h1 className="text-center font-bold text-xl">Create Organization</h1>

        <div className="gap-3 mt-5">
          <div className="text-center">
            <label className="">Organization Name</label>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="mt-3 w-96 p-3 border rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-end mt-7 space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button className="bg-[#EFB036] text-white px-4 py-2 rounded-lg" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-green-600 text-center text-xl">Successfully Added!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrganization;

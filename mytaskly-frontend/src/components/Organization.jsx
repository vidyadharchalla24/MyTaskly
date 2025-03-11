import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Organization = () => {
  return (
    <div className="text-[Poppins]">
      <div className="text-center text-3xl font-bold">
        <h1 className="text-[#3B6790]">Create Your Projects</h1>

        {/* Table */}
        <div className="flex justify-center items-center mt-20">
          <div className="relative overflow-x-auto shadow-lg rounded-lg w-3/4 p-10 bg-white">
            <table className="w-full text-sm text-left text-white rounded-lg ">
              <thead className="text-xs text-white uppercase bg-[#EFB036]   rounded-lg`">
                <tr>
                  <th scope="col" className="px-6 py-3">Product Name</th>
                  <th scope="col" className="px-6 py-3">Project Description</th>
                  <th scope="col" className="px-6 py-3">Project Status</th>
                  <th scope="col" className="px-6 py-3">Organization Name</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-white border bg-[#23486A]">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Apple MacBook Pro 17"
                  </th>
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Laptop</td>
                  <td className="px-6 py-4">$2999</td>
                  <td className="px-6 py-4 flex gap-4">
                    {/* Edit Icon */}
                    <button className="text-white hover:text-blue-600">
                      <FaEdit size={20} />
                    </button>
                    {/* Delete Icon */}
                    <button className="text-red-400 hover:text-red-600">
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // ✅ Go back to the previous page
      className="flex items-center px-4 py-2 m-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back
    </button>
  );
};

export default BackButton;

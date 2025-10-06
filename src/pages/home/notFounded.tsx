import { Button } from "../../components/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-full md:w-[500px] h-full md:h-[600px] bg-white shadow-sm rounded-sm flex flex-col justify-center items-center p-6">
        <div className="text-2xl font-bold text-gray-800 flex items-center">
          Une erreur est survenue <span className="text-6xl">⛓️‍💥</span>
        </div>
        <div className="text-center text-gray-500 mt-10">
          Malheureusement, nous ne pouvons pas vous relier à la ressource que
          vous recherchez <span className="text-xl">😞</span>
        </div>

        <Button
          className="mt-5 text-white px-3 py-2"
          variant="default"
          size="sm"
        //  leftIcon={<FaCheck />}
          onClick={() => navigate(-1)}
        >
          Ramenez-moi
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;

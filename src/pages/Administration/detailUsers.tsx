import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStoreOneUser from "src/store/Administration/getOne";
import { FaCircle, FaArrowLeft } from "react-icons/fa";

const DetailUsers = () => {
  const { OneUser, fetchOneUser, loadingOneUser } = useStoreOneUser();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchOneUser(id);
    }
  }, [id]);

  if (loadingOneUser) {
    return <div className="text-center text-gray-500 mt-5">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center bg-gray-200 text-gray-600 hover:text-purple-600 transition mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Retour
      </button>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        {/* Profil */}
        <div className="flex items-center space-x-4">
          {OneUser?.profile_picture_file ? (
            <img
              src={OneUser?.profile_picture_file}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-gray-300"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-gray-300 text-white font-bold rounded-full">
              {OneUser?.first_name
                ?.split(" ")
                .map((word: string) => word.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")}

              {OneUser?.last_name
                ?.split(" ")
                .map((word: string) => word.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")}
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {OneUser?.first_name} {OneUser?.last_name}
            </h2>
            <p className="text-gray-500">
              Code Utilisateur : {OneUser?.user_code}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <FaCircle
                className={`text-sm ${
                  OneUser?.is_active ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm">
                {OneUser?.is_active ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>
        </div>

        {/* Infos Utilisateur */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800">Informations</h3>
          <p className="text-gray-600">
            <strong>Email :</strong> {OneUser?.email}
          </p>
          <p className="text-gray-600">
            <strong>Téléphone :</strong> {OneUser?.phone_number}
          </p>
          <p className="text-gray-600">
            <strong>Genre :</strong>{" "}
            {OneUser?.gender === "M" ? "Masculin" : "Féminin"}
          </p>
        </div>

        {/* Permissions */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>
          <ul className="list-disc list-inside text-gray-600">
            {OneUser?.permissions?.map((perm: any, index: any) => (
              <li key={index}>{perm}</li>
            ))}
          </ul>
        </div>

        {/* Groupes */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800">Groupes</h3>
          <ul className="list-disc list-inside text-gray-600">
            {OneUser?.groups?.map((group: any) => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailUsers;

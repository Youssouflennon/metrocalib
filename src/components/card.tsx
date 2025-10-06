import React from "react";
import Loader from "./loader";
import { FaArchive, FaEdit, FaTrash } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
//import { DropdownMenu } from "./components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

interface CardProps {
  text: string;
  bgColor?: string;
  bgImage?: string; // ← NEW
  onClick?: () => void;
  loading?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;

  showDeleteIcon?: boolean;

  permission?: boolean;
}

const Card: React.FC<CardProps> = ({
  text,
  bgColor = "bg-blue-600",
  bgImage="./csu.jpg",
  onClick,
  loading = false,
  onDelete,
  onEdit,
  showDeleteIcon = false,
  permission = false,
}) => {
  return (
    <div
    className="w-full relative bg-black/10 text-white font-bold text-xl p-4 rounded-md text-center cursor-pointer h-[100px] flex items-center justify-center transition-all duration-300 hover:opacity-80"
    style={{
        backgroundColor: bgColor ? undefined : "#4F46E5", // fallback color
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={onClick}
    >
      {loading ? <Loader /> : text}

      {showDeleteIcon && permission && (
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-gray-300 bg-transparent p-1 rounded"
              >
                <BsThreeDotsVertical />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="end"
              className="bg-white text-gray-500"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={onDelete}
                className="hover:text-gray-400 cursor-pointer"
              >
                <FaArchive className="mr-2" />
                Archiver
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onEdit}
                className="hover:text-green-400 cursor-pointer"
              >
                <FaEdit className="mr-2" />
                Editer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default Card;

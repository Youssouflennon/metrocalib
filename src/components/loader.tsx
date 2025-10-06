import React from "react";

const Loader = () => {
  return (
    <div>
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-400"></div>
      </div>
    </div>
  );
};

export default Loader;

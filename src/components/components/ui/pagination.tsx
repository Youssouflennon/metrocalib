import React, { useState } from "react";


interface PaginationProps {
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  rangeLimit: number;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  pages,
  currentPage,
  onPageChange,
  rangeLimit,
}) => {
  const [rangeStart, setRangeStart] = useState(1);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    if (page <= rangeStart || page >= rangeStart + rangeLimit) {
      const newRangeStart = Math.max(1, Math.min(page, pages - rangeLimit + 1));
      setRangeStart(newRangeStart);
    }
  };

  return (
    <div className="pagination-component flex justify-center gap-2 mb-4">
      {/* Bouton Précédent */}
      {/* <button
        className={`page-button ${currentPage === 1 ? "disabled" : ""}`}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Preview
      </button> */}

      {/* Boutons de pagination */}
      {/* {Array.from(
        { length: Math.min(rangeLimit, pages - rangeStart + 1) },
        (_, i) => rangeStart + i
      ).map((page) => (
        <button
          className={`page-button ${page === currentPage ? "active" : ""}`}
          key={page}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))} */}

      {/* Bouton Suivant */}
      {/* <button
        className={`page-button ${currentPage === pages ? "disabled" : ""}`}
        disabled={currentPage === pages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button> */}
      <button
        className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}>
        Preview
      </button>

      {/* Boutons de pagination */}
      {Array.from(
        { length: Math.min(rangeLimit, pages - rangeStart + 1) },
        (_, i) => rangeStart + i
      ).map((page) => (
        <button
          className={`px-4 py-2 rounded ${
            currentPage === page
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          key={page}
          onClick={() => handlePageChange(page)}>
          {page}
        </button>
      ))}

      {/* Bouton Suivant */}
      <button
        className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        disabled={currentPage === pages}
        onClick={() => handlePageChange(currentPage + 1)}>
        Next
      </button>

      <style>{`
        .page-button {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          background: #9333ea; /* Purple */
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }
        .page-button.active {
          background: #6b21a8; /* Purple Darker */
        }
        .page-button:hover {
          background: #7e22ce; /* Purple Lighter */
        }
        .page-button.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default PaginationComponent;

import React from "react";
import "./style.scss";

interface PaginationProps {
  hiddenNumberPage?: boolean;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  hiddenNumberPage,
  currentPage,
  totalItems,
  onPageChange,
}) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 5;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem =
    currentPage === totalPages ? totalItems : currentPage * itemsPerPage;

  const getPageRange = () => {
    const pageRange = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageRange.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageRange.push(i);
        }
        pageRange.push("...");
        pageRange.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageRange.push(1);
        pageRange.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageRange.push(i);
        }
      } else {
        pageRange.push(1);
        pageRange.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageRange.push(i);
        }
        pageRange.push("...");
        pageRange.push(totalPages);
      }
    }
    return pageRange;
  };

  const renderPageNumbers = getPageRange();

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <nav className="flex justify-center items-center gap-3">
      {!hiddenNumberPage && (
        <p className="flex items-center justify-center text-center text-sm w-35">
          {startItem} - {endItem} trong tổng {totalItems}
        </p>
      )}

      <ul className="pagination text-base">
        <li
          className={`page-item ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="page-link" onClick={prevPage}>
            Trang trước
          </div>
        </li>

        {renderPageNumbers.map((number, index) => (
          <li
            key={index}
            className={
              currentPage === number ? "page-item active" : "page-item"
            }
          >
            {number === "..." ? (
              <span className="page-link">...</span>
            ) : (
              <div
                className="page-link"
                onClick={() =>
                  onPageChange(typeof number === "number" ? number : 1)
                }
              >
                {number}
              </div>
            )}
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="page-link" onClick={nextPage}>
            Trang sau
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

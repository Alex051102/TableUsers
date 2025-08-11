export const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        «
      </button>

      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        ‹
      </button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={currentPage === pageNum ? 'active' : ''}>
            {pageNum}
          </button>
        );
      })}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        ›
      </button>

      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        »
      </button>
    </div>
  );
};

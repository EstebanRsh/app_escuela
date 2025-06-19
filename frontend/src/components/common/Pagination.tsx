interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (pageNumber: number) => void; // <-- La nueva prop clave
}

const Pagination = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageChange,
}: PaginationProps) => {

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Navegación de páginas">
      <ul className="pagination-custom mb-0">

        {/* Botón "Anterior" (<<) */}
        <li className={`page-item-custom ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link-custom" onClick={onPrevPage} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {/* Números de página */}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item-custom ${number === currentPage ? "active" : ""}`}
          >
            <button className="page-link-custom" onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}

        {/* Botón "Siguiente" (>>) */}
        <li className={`page-item-custom ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link-custom" onClick={onNextPage} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
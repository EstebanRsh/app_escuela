
// Definimos las "props" (propiedades) que nuestro componente necesita para funcionar.
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void; // Una función que se ejecutará al hacer clic en "Anterior"
  onNextPage: () => void; // Una función que se ejecutará al hacer clic en "Siguiente"
}

// Usamos el tipado directo de props, que es la forma más moderna y sencilla.
const Pagination = ({ currentPage, totalPages, onPrevPage, onNextPage }: PaginationProps) => {
  
  // Si solo hay una página (o ninguna), no tiene sentido mostrar los botones.
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav aria-label="Navegación de páginas">
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={onPrevPage}>
            Anterior
          </button>
        </li>
        <li className="page-item active" aria-current="page">
          <span className="page-link">
            {currentPage} de {totalPages}
          </span>
        </li>
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={onNextPage}>
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
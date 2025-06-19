import React from 'react';

// La interfaz de props no cambia
interface DropupSelectProps {
  options: (string | number)[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  width?: string;
}

const DropupSelect: React.FC<DropupSelectProps> = ({ options, selectedValue, onSelect, width = '75px' }) => {
  return (
    // Agregamos una clase contenedora 'custom-dropup-select' para poder apuntar
    // a los estilos internos de forma segura desde el CSS.
    <div className="btn-group dropup custom-dropup-select">
      <button
        type="button"
        // CAMBIO: Usamos tu nueva clase de botón 'btn-outline-brand'.
        className="btn btn-sm btn-outline-brand dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ width: width }}
      >
        {selectedValue}
      </button>
      <ul className="dropdown-menu dropdown-menu-dark">
        {options.map((option) => (
          <li key={option}>
            <a
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelect(option);
              }}
            >
              {option}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropupSelect;
import { NavLink } from "react-router-dom";

function PublicNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold text-primary" to="/">
          Sistema Escolar
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="publicNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/Info">Sobre Nosotros</NavLink>
            </li>
          </ul>
          <div className="d-flex">
            <NavLink to="/login" className="btn btn-outline-primary me-2">
              Iniciar Sesión
            </NavLink>
            <NavLink to="/signup" className="btn btn-primary">
              Registrarse
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
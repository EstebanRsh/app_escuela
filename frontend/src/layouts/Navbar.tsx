import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const navbarTogglerRef = useRef<HTMLButtonElement>(null);
  const collapseNavbarRef = useRef<HTMLDivElement>(null);

  // Se leen los datos que guardamos en el Login
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  // MEJORA 1: La función de Logout ahora limpia todo
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleNavLinkClick = () => {
    if (
      collapseNavbarRef.current &&
      collapseNavbarRef.current.classList.contains("show")
    ) {
      navbarTogglerRef.current?.click();
    }
  };

  const activeLinkStyle = {
    color: "#FFD700", // Un color dorado para el enlace activo
    fontWeight: "600",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm navbar-custom-blue">
      <div className="container-fluid">
        {/* Marca / Logo */}
        <NavLink
          className="navbar-brand d-flex align-items-center"
          to="/dashboard"
          onClick={handleNavLinkClick}
        >
          <i
            className="bi bi-mortarboard-fill"
            style={{ fontSize: "2rem", marginRight: "0.8rem" }}
          ></i>
          <div className="d-flex flex-column">
            <strong>App Escuela</strong>
            {userName && (
              <small style={{ fontSize: "0.7em", opacity: 0.8 }}>
                Hola, {userName}
              </small>
            )}
          </div>
        </NavLink>

        {/* Botón de menú (colapsable en móviles) */}
        <button
          ref={navbarTogglerRef}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div
          ref={collapseNavbarRef}
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">
            {/* --- Enlace común para todos --- */}
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/dashboard"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </NavLink>
            </li>

            {/* MEJORA 2: Enlaces para Administrador actualizados */}
            {userRole === "administrador" && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/profile" // Ruta para gestionar usuarios
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-people-fill me-2"></i>Usuarios
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/admin/careers" // Ruta para gestionar carreras
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-journal-album me-2"></i>Carreras
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/admin/payments" // Ruta para gestionar pagos
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-cash-coin me-2"></i>Pagos
                  </NavLink>
                </li>
              </>
            )}

            {/* --- Enlaces para Alumno --- */}
            {userRole === "alumno" && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/student/careers"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-card-checklist me-2"></i>Mis Carreras
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/student/payments"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-wallet-fill me-2"></i>Mis Pagos
                  </NavLink>
                </li>
              </>
            )}

            {/* --- Enlaces para Profesor --- */}
            {userRole === "profesor" && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/teacher/courses"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : undefined
                  }
                  onClick={handleNavLinkClick}
                >
                  <i className="bi bi-easel-fill me-2"></i>Mis Cursos
                </NavLink>
              </li>
            )}
          </ul>

          {/* --- Botón Logout --- */}
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
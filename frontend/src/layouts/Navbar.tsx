import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const navbarTogglerRef = useRef<HTMLButtonElement>(null);
  const collapseNavbarRef = useRef<HTMLDivElement>(null);

  // 1. Leer datos del usuario desde localStorage
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
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
    color: "#FFD700",
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
            {/* Enlace común para todos */}
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

            {/* Enlaces para Administrador */}
            {userRole === "administrador" && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/Profile"
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
                    to="/Profile"
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
                    to="/Notifications"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-journal-album me-2"></i>Notificaciones
                  </NavLink>
                </li>
              </>
            )}

            {/* Enlaces para Alumno */}
            {userRole === "alumno" && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/student/courses"
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

            {/* Enlaces para Profesor */}
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

          {/* Botón Logout */}
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

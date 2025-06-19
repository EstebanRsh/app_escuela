import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const navbarTogglerRef = useRef<HTMLButtonElement>(null);
  const collapseNavbarRef = useRef<HTMLDivElement>(null);

  // Leemos los datos del usuario desde localStorage. Si no existen, serán 'null'.
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  // Función para cerrar sesión y limpiar localStorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    handleNavLinkClick(); // Cierra el menú en móvil
    navigate("/login");
  };

  // Función para cerrar el menú en móviles al hacer clic en un enlace
  const handleNavLinkClick = () => {
    if (
      collapseNavbarRef.current &&
      collapseNavbarRef.current.classList.contains("show")
    ) {
      navbarTogglerRef.current?.click();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark p-3 shadow-sm navbar-custom-blue">
      <div className="container-fluid">
        {/* El logo lleva a Dashboard (si estás logueado) o a Home (si no) */}
        <NavLink
          className="navbar-brand d-flex align-items-center"
          to={userName ? "/dashboard" : "/"}
          onClick={handleNavLinkClick}
        >
          <i
            className="bi bi-mortarboard-fill"
            style={{ fontSize: "2rem", marginRight: "0.8rem" }}
          ></i>
          <div className="d-flex flex-column">
            <strong>App Escuela</strong>
            {/* El saludo solo se muestra si el usuario está logueado */}
            {userName && (
              <small style={{ fontSize: "0.7em", opacity: 0.8 }}>
                Hola, {userName}
              </small>
            )}
          </div>
        </NavLink>

        {/* Botón del menú hamburguesa para móviles */}
        <button
          ref={navbarTogglerRef}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del Navbar que se colapsa */}
        <div
          ref={collapseNavbarRef}
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          {/* --- SECCIÓN DE ENLACES DE NAVEGACIÓN (IZQUIERDA) --- */}
          <ul className="navbar-nav me-auto">
            {userName ? (
              /* VISTA PARA USUARIOS AUTENTICADOS */
              <>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-brand-link" : "nav-link"
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
                        to="/admin/users"
                        className={({ isActive }) =>
                          isActive ? "nav-link active-brand-link" : "nav-link"
                        }
                        onClick={handleNavLinkClick}
                      >
                        <i className="bi bi-people-fill me-2"></i>Usuarios
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/admin/careers"
                        className={({ isActive }) =>
                          isActive ? "nav-link active-brand-link" : "nav-link"
                        }
                        onClick={handleNavLinkClick}
                      >
                        <i className="bi bi-journal-album me-2"></i>Carreras
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/admin/payments"
                        className={({ isActive }) =>
                          isActive ? "nav-link active-brand-link" : "nav-link"
                        }
                        onClick={handleNavLinkClick}
                      >
                        <i className="bi bi-cash-coin me-2"></i>Pagos
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                          isActive ? "nav-link active-brand-link" : "nav-link"
                        }
                        onClick={handleNavLinkClick}
                      >
                        <i className="bi bi-cash-coin me-2"></i>Notificaciones
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          isActive ? "nav-link active-brand-link" : "nav-link"
                        }
                        onClick={handleNavLinkClick}
                      >
                        <i className="bi bi-cash-coin me-2"></i>Perfil
                      </NavLink>
                    </li>
                  </>
                )}

                {/* Enlaces para Alumno */}
                {userRole === "alumno" && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/student/careers"
                        className={({ isActive }) =>
                          isActive ? "nav-link active-brand-link" : "nav-link"
                        }
                        onClick={handleNavLinkClick}
                      >
                        <i className="bi bi-card-checklist me-2"></i>Mis
                        Carreras
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/student/payments"
                        className={({ isActive }) =>
                          isActive ? "nav-link active-brand-link" : "nav-link"
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
                      to="/teacher/courses"
                      className={({ isActive }) =>
                        isActive ? "nav-link active-brand-link" : "nav-link"
                      }
                      onClick={handleNavLinkClick}
                    >
                      <i className="bi bi-easel-fill me-2"></i>Mis Cursos
                    </NavLink>
                  </li>
                )}
              </>
            ) : (
              /* VISTA PARA USUARIOS PÚBLICOS (NO AUTENTICADOS) */
              <>
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-brand-link" : "nav-link"
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-house-door-fill me-2"></i>Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/nosotros"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-brand-link" : "nav-link"
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-info-circle-fill me-2"></i>Nosotros
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/signupDesarrollador"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-brand-link" : "nav-link"
                    }
                    onClick={handleNavLinkClick}
                  >
                    <i className="bi bi-info-circle-fill me-2"></i>
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* --- SECCIÓN DE ACCIONES DE USUARIO (DERECHA) --- */}
          <div className="d-flex align-items-center">
            {userName ? (
              // Si el usuario existe, muestra el botón de Logout en amarillo
              <button className="btn btn-outline-brand" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            ) : (
              // Si no, muestra un enlace/botón para ir a Login
              <NavLink
                to="/login"
                className="btn btn-outline-brand"
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

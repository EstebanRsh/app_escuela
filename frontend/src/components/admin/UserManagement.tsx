import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfoContainer from "../common/InfoContainer";
import Pagination from "../common/Pagination";
import DropupSelect from "../common/DropupSelect";

// La interfaz de Usuario no cambia
interface User {
  id: number;
  username: string;
  userdetail?: {
    first_name: string;
    last_name: string;
    dni: number;
    email: string;
    type: string;
  };
}

const UserManagement = () => {
  // ESTADO
  const [users, setUsers] = useState<User[]>([]); // Lista completa del backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState(""); // El texto en el input
  const [activeSearch, setActiveSearch] = useState(""); // El filtro que se aplica

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5); // <-- Puedes cambiar este número

  const navigate = useNavigate();

  // CARGA DE DATOS
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No estás autenticado.");
        const response = await fetch("http://localhost:8000/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error("Error al obtener los datos de usuarios.");
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // LÓGICA DE DATOS (Filtrado y Paginación)
  // Esta lógica se calcula en cada renderizado. Es claro y directo.

  // Filtros para una búsqueda activa
  const filteredUsers = users.filter((user) => {
    if (!activeSearch) return true;
    const term = activeSearch.toLowerCase();
    const fullName = `${user.userdetail?.first_name || ""} ${
      user.userdetail?.last_name || ""
    }`.toLowerCase();
    const username = user.username?.toLowerCase() || "";
    return fullName.includes(term) || username.includes(term);
  });

  // Segundo, calculamos la paginación a partir de la lista YA filtrada
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const indexOfFirstRecord = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfFirstRecord + recordsPerPage
  );

  // --- 4. MANEJADORES DE EVENTOS ---
  const handleSearch = () => {
    setCurrentPage(1); // Volvemos a la página 1 al buscar
    setActiveSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
    setCurrentPage(1);
  };
  const handleRecordsPerPageSelect = (value: string | number) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <InfoContainer>
      {/* --- Cabecera y Buscador --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Gestión de Usuarios</h1>
        <button
          className="btn btn-primary-custom"
          onClick={() => navigate("/signup")}
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          Registrar Nuevo Usuario
        </button>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className=" btn btn-primary-custom"
          type="button"
          onClick={handleSearch}
        >
          Buscar
        </button>
        <button
          className="btn btn-secondary-custom"
          type="button"
          onClick={clearSearch}
        >
          Limpiar
        </button>
      </div>

      {/* --- Tabla de Usuarios --- */}
      <div className="table-responsive">
        <table className="table table-hover table-dark table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>DNI</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center">
                  Cargando...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="text-center text-danger">
                  {error}
                </td>
              </tr>
            )}

            {/* La tabla SIEMPRE dibuja 'currentRecords', que es la lista ya filtrada y paginada */}
            {!loading &&
              !error &&
              currentRecords.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{`${user.userdetail?.first_name || ""} ${
                    user.userdetail?.last_name || ""
                  }`}</td>
                  <td>{user.userdetail?.email || "N/A"}</td>
                  <td>{user.userdetail?.dni || "N/A"}</td>
                  <td>{user.userdetail?.type || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      title="Editar"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* --- Controles de Paginación --- */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-3">
        <div className="d-flex align-items-center">
          <span className="text-white-50 me-2">Ver:</span>
          <DropupSelect
            options={[5, 10, 25]}
            selectedValue={recordsPerPage}
            onSelect={handleRecordsPerPageSelect}
          />
        </div>

        <span className="text-white-50">
          Mostrando {currentRecords.length} de {filteredUsers.length} registros
        </span>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={() => setCurrentPage(currentPage - 1)}
          onNextPage={() => setCurrentPage(currentPage + 1)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </InfoContainer>
  );
};

export default UserManagement;

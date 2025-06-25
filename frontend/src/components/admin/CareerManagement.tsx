import { useState, useEffect, useMemo } from "react";
import type { FormEvent } from "react";
import InfoContainer from "../common/InfoContainer";

// Interfaces para definir la estructura de nuestros datos
interface Career {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  userdetail?: {
    first_name: string;
    last_name: string;
    type: string;
  };
}

const CareerManagement = () => {
  // Estados para la lista de carreras y el formulario de creación
  const [careers, setCareers] = useState<Career[]>([]);
  const [newCareerName, setNewCareerName] = useState("");

  // --- CAMBIO 1: Añadimos nuevos estados ---
  const [users, setUsers] = useState<User[]>([]); // Para guardar todos los usuarios
  const [selectedStudentId, setSelectedStudentId] = useState(""); // ID del alumno seleccionado
  const [selectedCareerId, setSelectedCareerId] = useState(""); // ID de la carrera seleccionada

  // Estados para carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareers = async () => {
    try {
      const careersResponse = await fetch("http://localhost:8000/career/all");
      if (!careersResponse.ok) throw new Error("Error al cargar carreras.");
      const careersData = await careersResponse.json();
      setCareers(careersData);
    } catch (err: any) {
      setError(err.message);
    }
  };
  // --- CAMBIO 2: useEffect ahora carga tanto carreras como usuarios ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No estás autenticado.");

        // Hacemos las dos peticiones a la vez
        const [careersResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:8000/career/all"),
          fetch("http://localhost:8000/users/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!careersResponse.ok || !usersResponse.ok) {
          throw new Error("Error al cargar los datos necesarios.");
        }

        const careersData = await careersResponse.json();
        const usersData = await usersResponse.json();

        setCareers(careersData);
        setUsers(usersData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- CAMBIO 3: Filtramos la lista de usuarios para obtener solo a los alumnos ---
  // Usamos useMemo para que esta lista no se recalcule en cada render, solo si 'users' cambia.
  const students = useMemo(() => {
    return users.filter((user) => user.userdetail?.type === "alumno");
  }, [users]);

  // Función para crear una nueva carrera (sin cambios)
  const handleAddCareer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCareerName.trim()) {
      alert("El nombre de la carrera no puede estar vacío.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/career/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCareerName }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la carrera.");
      }

      const successMessage = await response.text();
      alert(successMessage);

      setNewCareerName(""); // Limpiar el input
      fetchCareers(); // Volver a cargar la lista de carreras
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- CAMBIO 4: Nueva función para manejar la asignación de carrera ---
  const handleAssignCareer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCareerId) {
      alert("Por favor, selecciona un alumno y una carrera.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/user/addcareer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: Number(selectedStudentId),
          id_career: Number(selectedCareerId),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al asignar la carrera.");
      }

      // La respuesta del backend es un string, lo leemos como texto
      const successMessage = await response.text();
      alert(successMessage);

      // Limpiamos los selects
      setSelectedStudentId("");
      setSelectedCareerId("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <InfoContainer>
      {/* SECCIÓN PARA CREAR CARRERAS (sin cambios) */}
      <h2 className="mb-3">Crear Nueva Carrera</h2>
      <form onSubmit={handleAddCareer} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre de la nueva carrera"
          value={newCareerName}
          onChange={(e) => setNewCareerName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary-custom">
          <i className="bi bi-plus-circle me-2"></i>Crear
        </button>
      </form>
      <hr />
      <h2 className="mt-4 mb-3">Asignar Carrera a Alumno</h2>
      <form onSubmit={handleAssignCareer}>
        <div className="row g-3">
          <div className="col-md-5">
            <label htmlFor="student-select" className="form-label">
              Alumno
            </label>
            <select
              id="student-select"
              className="form-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona un alumno...
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.userdetail?.first_name}{" "}
                  {student.userdetail?.last_name} ({student.username})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <label htmlFor="career-select" className="form-label">
              Carrera
            </label>
            <select
              id="career-select"
              className="form-select"
              value={selectedCareerId}
              onChange={(e) => setSelectedCareerId(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona una carrera...
              </option>
              {careers.map((career) => (
                <option key={career.id} value={career.id}>
                  {career.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary-custom w-100">
              Asignar
            </button>
          </div>
        </div>
      </form>

      <hr className="my-4" />

      {/* SECCIÓN PARA LISTAR CARRERAS (sin cambios) */}
      <h2 className="mt-4 mb-3">Carreras Existentes</h2>
      {loading && <p>Cargando...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <ul className="list-group">
          {careers.map((career) => (
            <li
              key={career.id}
              className="list-group-item list-group-item-dark"
            >
              {career.name}
            </li>
          ))}
        </ul>
      )}
    </InfoContainer>
  );
};

export default CareerManagement;

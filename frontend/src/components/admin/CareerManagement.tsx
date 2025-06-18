import { useState, useEffect} from "react";
import type { FormEvent } from "react";
import InfoContainer from "../common/InfoContainer";

// Interfaz para definir cómo es un objeto Carrera
interface Career {
  id: number;
  name: string;
}

const CareerManagement = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [newCareerName, setNewCareerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener la lista de carreras del backend
  const fetchCareers = async () => {
    try {
      // NOTA: Este endpoint debería estar protegido, pero lo usamos como está en tu backend
      const response = await fetch("http://localhost:8000/career/all");
      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de carreras.");
      }
      const data = await response.json();
      setCareers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Usamos useEffect para llamar a fetchCareers solo una vez, cuando el componente carga
  useEffect(() => {
    fetchCareers();
  }, []);

  // Función para manejar el envío del formulario de nueva carrera
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

      alert(`Carrera "${newCareerName}" creada con éxito.`);
      setNewCareerName(""); // Limpiamos el input
      fetchCareers(); // Volvemos a cargar la lista para que aparezca la nueva carrera
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <InfoContainer>
      {/* SECCIÓN PARA CREAR CARRERAS */}
      <h2 className="mb-3">Crear Nueva Carrera</h2>
      <form onSubmit={handleAddCareer} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre de la nueva carrera"
          value={newCareerName}
          onChange={(e) => setNewCareerName(e.target.value)}
        />
        <button type="submit" className="btn btn-warning">
          Crear
        </button>
      </form>

      <hr />

      {/* SECCIÓN PARA LISTAR CARRERAS */}
      <h2 className="mt-4 mb-3">Carreras Existentes</h2>
      {loading && <p>Cargando carreras...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <ul className="list-group">
          {careers.map((career) => (
            <li key={career.id} className="list-group-item list-group-item-dark">
              {career.name}
            </li>
          ))}
        </ul>
      )}
    </InfoContainer>
  );
};

export default CareerManagement;
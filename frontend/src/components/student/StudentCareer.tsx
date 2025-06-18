import { useState, useEffect } from 'react';
import InfoContainer from '../common/InfoContainer';

// Interfaz para definir cómo se ven los datos de una carrera
interface CareerInfo {
  usuario: string;
  carrera: string;
}

const StudentCareers = () => {
  const [careers, setCareers] = useState<CareerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentCareers = async () => {
      // Obtenemos los datos del usuario logueado desde localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError("No se encontraron datos de usuario. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userData);
      const username = user.username;

      // Hacemos la petición al endpoint que nos devuelve las carreras de un usuario específico
      try {
        const response = await fetch(`http://localhost:8000/user/career/${username}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener las carreras del estudiante.');
        }

        const data: CareerInfo[] = await response.json();
        setCareers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCareers();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  return (
    <InfoContainer>
      <h1 className="mb-4">Mis Carreras</h1>
      
      {loading && <p>Cargando tus carreras...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && !error && (
        careers.length > 0 ? (
          <ul className="list-group">
            {careers.map((career, index) => (
              <li key={index} className="list-group-item list-group-item-dark d-flex align-items-center">
                <i className="bi bi-mortarboard-fill me-3"></i>
                {career.carrera}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aún no estás inscrito en ninguna carrera.</p>
        )
      )}
    </InfoContainer>
  );
};

export default StudentCareers;
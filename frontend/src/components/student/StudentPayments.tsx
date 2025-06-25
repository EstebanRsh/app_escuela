import { useState, useEffect } from 'react';
import InfoContainer from '../common/InfoContainer';

// Interfaz para definir la estructura de un pago
interface PaymentDetail {
  id: number;
  amount: number;
  fecha_pago: string;
  carrera: string;
  mes_afectado: string;
}

const StudentPayments = () => {
  const [payments, setPayments] = useState<PaymentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Obtenemos los datos del usuario logueado desde localStorage
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      setError("No se encontraron datos de usuario. Por favor, inicie sesión.");
      setLoading(false);
      return;
    }
    
    const user = JSON.parse(userDataString);
    const username = user.username;
    setUserName(user.first_name); // Para el saludo

    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/payment/user/${username}`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar tus pagos.');
        }
        const data: PaymentDetail[] = await response.json();
        setPayments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <InfoContainer>
      <h1 className="mb-4">Hola <span className="text-brand">{userName}</span>, este es tu Historial de Pagos</h1>
      
      {loading && <p className="text-center">Cargando tus pagos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && !error && (
        payments.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-dark table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha de Pago</th>
                  <th>Carrera</th>
                  <th>Mes Cubierto</th>
                  <th className="text-end">Monto</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay, index) => (
                  <tr key={pay.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(pay.fecha_pago).toLocaleDateString()}</td>
                    <td>{pay.carrera}</td>
                    <td>{pay.mes_afectado}</td>
                    <td className="text-end">${pay.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">Aún no tienes pagos registrados.</p>
        )
      )}
    </InfoContainer>
  );
};

export default StudentPayments;
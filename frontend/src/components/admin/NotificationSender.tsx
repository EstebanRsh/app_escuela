// frontend/src/components/admin/NotificationSender.tsx (Archivo nuevo)
import { useState, useEffect } from 'react';
import InfoContainer from '../common/InfoContainer';

interface User {
  id: number;
  username: string;
  userdetail?: { first_name: string; last_name: string };
}

const NotificationSender = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  useEffect(() => {
    // Cargar la lista de usuarios para el selector
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8000/users/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !message) {
      setFeedback({ type: 'danger', text: 'Por favor, selecciona un usuario y escribe un mensaje.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_user: Number(selectedUserId), message }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al enviar la notificación.');
      
      setFeedback({ type: 'success', text: '¡Notificación enviada con éxito!' });
      setMessage('');
      setSelectedUserId('');

    } catch (error: any) {
      setFeedback({ type: 'danger', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <InfoContainer>
      <h1 className="mb-4">Enviar Notificación</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="user-select" className="form-label">Destinatario</label>
          <select 
            id="user-select" 
            className="form-select" 
            value={selectedUserId} 
            onChange={e => setSelectedUserId(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>Selecciona un usuario...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.userdetail ? `${user.userdetail.first_name} ${user.userdetail.last_name}` : user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="message-textarea" className="form-label">Mensaje</label>
          <textarea 
            id="message-textarea" 
            className="form-control" 
            rows={4} 
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            disabled={loading}
          ></textarea>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type}`}>{feedback.text}</div>
        )}

        <button type="submit" className="btn btn-warning" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Notificación'}
        </button>
      </form>
    </InfoContainer>
  );
};

export default NotificationSender;
import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import InfoContainer from './common/InfoContainer';
import { useNavigate } from "react-router-dom";

const initialFormState = {
  id_user: "",
  id_career: "",
  amount: "",
  affected_month: "",
};

const requiredFields = {
  id_user: "El usuario es obligatorio",
  id_career: "La carrera es obligatoria",
  amount: "El monto es obligatorio",
  affected_month: "El mes pagado es obligatorio",
};

const AddPayment = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [userRes, careerRes] = await Promise.all([
          fetch("http://localhost:8000/users/all", { headers }),
          fetch("http://localhost:8000/careers/all", { headers }),
        ]);
        const usersData = await userRes.json();
        const careersData = await careerRes.json();
        setUsers(usersData);
        setCareers(careersData);
      } catch (error) {
        console.error("Error cargando usuarios o carreras", error);
      }
    };
    fetchOptions();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors.length > 0) setErrors([]);
  };

  const validateForm = (): string[] => {
    const newErrors = Object.entries(requiredFields)
      .filter(([field]) => !formData[field as keyof typeof formData]?.toString().trim())
      .map(([_, msg]) => msg);

    if (formData.amount && isNaN(Number(formData.amount))) {
      newErrors.push("El monto debe ser un número válido");
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (formErrors.length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/payment/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) }),
      });

      if (!res.ok) throw new Error("Error al registrar el pago");
      alert("¡Pago registrado exitosamente!");
      navigate("/admin/payments");
    } catch (error: any) {
      setErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData(initialFormState);
    setErrors([]);
  };

  return (
    <InfoContainer>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Registrar Nuevo Pago</h1>
        <button className="btn btn-secondary" disabled={loading} onClick={() => navigate("/admin/payments")}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la Lista
        </button>
      </div>

      {errors.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <h6 className="alert-heading">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Se encontraron los siguientes errores:
          </h6>
          <ul className="mb-0">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="id_user" className="form-label">
                  <i className="bi bi-person-fill me-2"></i>Alumno *
                </label>
                <select
                  className="form-select"
                  name="id_user"
                  value={formData.id_user}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Seleccione un alumno</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.userdetail ? `${u.userdetail.first_name} ${u.userdetail.last_name}` : u.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="id_career" className="form-label">
                  <i className="bi bi-book-fill me-2"></i>Carrera *
                </label>
                <select
                  className="form-select"
                  name="id_career"
                  value={formData.id_career}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Seleccione una carrera</option>
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="amount" className="form-label">
                  <i className="bi bi-cash me-2"></i>Monto *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="amount"
                  placeholder="Ingrese el monto (ej: 1500.00)"
                  value={formData.amount}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="affected_month" className="form-label">
                  <i className="bi bi-calendar3 me-2"></i>Mes Pagado *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="affected_month"
                  placeholder="Ejemplo: Marzo 2025"
                  value={formData.affected_month}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={clearForm}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Limpiar
              </button>

              <button
                type="submit"
                className="btn btn-warning"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cash-coin me-2"></i>
                    Registrar Pago
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </InfoContainer>
  );
};

export default AddPayment;

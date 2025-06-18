import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import InfoContainer from './common/InfoContainer';
import { useNavigate } from "react-router-dom";

const initialFormState = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  dni: "",
  type: "alumno",
  email: "",
};

const requiredFields = {
  username: "El nombre de usuario es obligatorio",
  password: "La contraseña es obligatoria",
  firstname: "El nombre es obligatorio",
  lastname: "El apellido es obligatorio",
  dni: "El DNI es obligatorio",
  email: "El email es obligatorio",
};

const Signup = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors.length > 0) setErrors([]);
  };

  const validateForm = (): string[] => {
    const newErrors = Object.entries(requiredFields)
      .filter(([field]) => !formData[field as keyof typeof formData]?.trim())
      .map(([_, msg]) => msg);

    if (formData.password && formData.password.length < 6) {
      newErrors.push("La contraseña debe tener al menos 6 caracteres");
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push("El email no tiene un formato válido");
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (formErrors.length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error al registrar usuario");

      alert("¡Usuario registrado con éxito!");
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
        <h1 className="m-0">Registrar Nuevo Usuario</h1>
        <button className="btn btn-secondary" disabled={loading} onClick={() => navigate("/admin/users")}>
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
              {/* Columna izquierda */}
              <div className="col-md-6">
                {["username", "password", "firstname", "lastname"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label htmlFor={field} className="form-label">
                      {field === "username" && <><i className="bi bi-person-fill me-2"></i>Nombre de Usuario *</>}
                      {field === "password" && <><i className="bi bi-lock-fill me-2"></i>Contraseña *</>}
                      {field === "firstname" && <><i className="bi bi-person-badge-fill me-2"></i>Nombre *</>}
                      {field === "lastname" && <><i className="bi bi-person-badge me-2"></i>Apellido *</>}
                    </label>
                    <input
                      type={field === "password" ? "password" : "text"}
                      className="form-control"
                      id={field}
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleInputChange}
                      disabled={loading}
                      placeholder={
                        field === "password" ? "Mínimo 6 caracteres" :
                        field === "username" ? "Ingrese el nombre de usuario" :
                        field === "firstname" ? "Ingrese el nombre" :
                        "Ingrese el apellido"
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Columna derecha */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="dni" className="form-label">
                    <i className="bi bi-card-text me-2"></i>DNI *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Ingrese el DNI"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope-fill me-2"></i>Email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    <i className="bi bi-shield-fill me-2"></i>Rol de Usuario *
                  </label>
                  <select
                    className="form-select"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="alumno">Alumno</option>
                    <option value="profesor">Profesor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Los campos marcados con * son obligatorios
                  </small>
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="d-flex justify-content-end gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clearForm}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Limpiar Formulario
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
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
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Registrar Usuario
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </InfoContainer>
  );
};

export default Signup;

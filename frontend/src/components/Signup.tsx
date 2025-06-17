import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface IFormData {
  username: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  dni: string;
  type: string;
  email: string;
}

function Signup() {
  const SIGNUP_URL = `http://localhost:8000/users/add`;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    dni: "",
    type: "",
    email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiMessage, setApiMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- MEJORA: Estados para controlar la visibilidad de la contraseña ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Username
    if (!formData.username) newErrors.username = "El usuario es requerido.";
    else if (!/^[a-zA-Z0-9_]{4,20}$/.test(formData.username))
      newErrors.username = "Debe tener 4-20 caracteres (letras, números o _).";

    // Password
    if (!formData.password) newErrors.password = "La contraseña es requerida.";
    else {
      const pwErrors = [];
      if (formData.password.length < 8) pwErrors.push("mínimo 8 caracteres");
      if (!/[A-Z]/.test(formData.password)) pwErrors.push("una mayúscula");
      if (!/[a-z]/.test(formData.password)) pwErrors.push("una minúscula");
      if (!/[0-9]/.test(formData.password)) pwErrors.push("un número");
      if (!/[^A-Za-z0-9]/.test(formData.password)) pwErrors.push("un símbolo");
      if (pwErrors.length) newErrors.password = "Débil: " + pwErrors.join(", ");
    }

    // Confirm Password
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirma tu contraseña.";
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    // Nombre y Apellido
    if (!formData.firstname) newErrors.firstname = "El nombre es requerido.";
    else if (!/^[a-zA-Zñáéíóúü\s]+$/.test(formData.firstname))
      newErrors.firstname = "El nombre solo puede contener letras y espacios.";

    if (!formData.lastname) newErrors.lastname = "El apellido es requerido.";
    else if (!/^[a-zA-Zñáéíóúü\s]+$/.test(formData.lastname))
      newErrors.lastname = "El apellido solo puede contener letras y espacios.";

    // DNI
    if (!formData.dni) newErrors.dni = "El DNI es requerido.";
    else if (!/^\d{7,8}$/.test(formData.dni))
      newErrors.dni = "El DNI debe contener 7 u 8 dígitos.";

    // Tipo
    if (!formData.type)
      newErrors.type = "Debes seleccionar un tipo de usuario.";

    // Email
    if (!formData.email) newErrors.email = "El correo es requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "El formato del correo no es válido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiMessage("");

    const isFormValid = validate();
    if (!isFormValid) {
      setApiMessage("Por favor, corrige los errores marcados.");
      return;
    }

    setIsLoading(true);
    const { confirmPassword, ...dataToSend } = formData;

    fetch(SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dataToSend, dni: parseInt(dataToSend.dni) }),
    })
      .then((res) => res.json())
      .then((data) => {
        // --- MEJORA CLAVE: Manejar la respuesta específica del backend ---
        if (data.status === "success") {
          setApiMessage("Registro exitoso. Serás redirigido.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          // Si el backend nos dice qué campo falló...
          if (data.field) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [data.field]: data.message, // Asigna el mensaje de error al campo específico
            }));
            setApiMessage(
              "Uno o más campos ya están en uso. Por favor, revisa."
            );
          } else {
            // Si es un error genérico
            setApiMessage("Error: " + (data.message || "Error desconocido."));
          }
        }
      })
      .catch(() => setApiMessage("Error de conexión."))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card p-4 shadow-lg card-">
            <div className="card-body">
              <div className="d-flex justify-content-start mb-3">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-secondary"
                >
                  &larr; Volver
                </button>
              </div>
              <div className="text-center mb-4">
                <h2 className="text-primary fw-bold">Sistema Escolar</h2>
                <p className="text-muted">
                  Completa tus datos para registrarte
                </p>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                {/* Usuario */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Usuario
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <div className="invalid-feedback">{errors.username}</div>
                </div>

                {/* Contraseña con botón de visibilidad */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                        }`}
                      ></i>
                    </button>
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>
                </div>

                {/* Confirmar Contraseña con botón de visibilidad */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <i
                        className={`bi ${
                          showConfirmPassword
                            ? "bi-eye-slash-fill"
                            : "bi-eye-fill"
                        }`}
                      ></i>
                    </button>
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  </div>
                </div>

                {/* Nombre */}
                <div className="mb-3">
                  <label htmlFor="firstname" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.firstname ? "is-invalid" : ""
                    }`}
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <div className="invalid-feedback">{errors.firstname}</div>
                </div>

                {/* Apellido */}
                <div className="mb-3">
                  <label htmlFor="lastname" className="form-label">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.lastname ? "is-invalid" : ""
                    }`}
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <div className="invalid-feedback">{errors.lastname}</div>
                </div>

                {/* DNI */}
                <div className="mb-3">
                  <label htmlFor="dni" className="form-label">
                    DNI
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.dni ? "is-invalid" : ""}`}
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <div className="invalid-feedback">{errors.dni}</div>
                </div>

                {/* Correo Electrónico */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>

                {/* Tipo de Usuario */}
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Tipo de Usuario
                  </label>
                  <select
                    className={`form-select ${errors.type ? "is-invalid" : ""}`}
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Selecciona un tipo...</option>
                    <option value="administrador">Administrador</option>
                    <option value="alumno">Alumno</option>
                    <option value="profesor">Profesor</option>
                  </select>
                  <div className="invalid-feedback">{errors.type}</div>
                </div>

                {apiMessage && (
                  <div
                    className={`alert text-center ${
                      apiMessage.includes("Error") ||
                      apiMessage.includes("corrige")
                        ? "alert-danger"
                        : "alert-success"
                    }`}
                  >
                    {apiMessage}
                  </div>
                )}
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registrando..." : "Registrarse"}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

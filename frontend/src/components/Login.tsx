import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type LoginProcessResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

function Login() {
  const BACKEND_URL = "http://localhost:8000/users/loginUser";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "danger" | "success";
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleLoginResponse = (data: LoginProcessResponse) => {
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      setAlert({
        message: data.message || "Ocurrió un error inesperado.",
        type: "danger",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      setAlert({
        message: "El usuario y la contraseña son obligatorios.",
        type: "danger",
      });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data: LoginProcessResponse = await response.json();
      handleLoginResponse(data);
    } catch (error) {
      console.error("Error de conexión:", error);
      setAlert({
        message: "No se pudo conectar con el servidor.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-11 col-sm-8 col-md-7 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-3 card-transparent">
              <div className="card-body p-4 p-sm-5">
                <div className="text-center mb-4">
                  <h1 className="h3 fw-bold">Iniciar Sesión</h1>
                  <p className="text-muted">Ingresa a la plataforma</p>
                </div>

                <form onSubmit={handleLogin} noValidate>
                  <div className="mb-3">
                    <label htmlFor="inputUser" className="form-label">
                      Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputUser"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">
                      Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="form-control"
                        id="inputPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        aria-label={
                          isPasswordVisible
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        <i
                          className={`bi ${
                            isPasswordVisible ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span className="ms-2">Ingresando...</span>
                        </>
                      ) : (
                        "Ingresar"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {alert && (
        <div
          className={`alert alert-danger position-fixed bottom-0 end-0 m-3 shadow-lg`}
          style={{ zIndex: 1050 }}
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {alert.message}
        </div>
      )}
    </>
  );
}

export default Login;

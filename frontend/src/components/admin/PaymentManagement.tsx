import { useState, useEffect, useMemo } from "react";
import InfoContainer from "../common/InfoContainer";
import { useNavigate } from "react-router-dom";

interface Payment {
  id_pago: number;
  monto: number;
  afecha_de_pago: string;
  mes_pagado: string;
  alumno: string;
  carrera_afectada: string;
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/payment/all/detailled",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al obtener los pagos");
      const data = await response.json();
      setPayments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    if (!activeSearch) return payments;
    const term = activeSearch.toLowerCase();
    return payments.filter((p) =>
      `${p.alumno} ${p.carrera_afectada}`.toLowerCase().includes(term)
    );
  }, [payments, activeSearch]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPayments.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);

  const handleSearch = () => {
    setActiveSearch(searchTerm);
    setCurrentPage(1);
  };
  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
    setCurrentPage(1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const navigate = useNavigate();
  const handleShowPayment = () => {
    navigate("/addPayment"); 
  };

  return (
    <InfoContainer>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h1 className="mb-4">Gestión de Pagos</h1>
        <button className="btn btn-brand fw-bold" onClick={handleShowPayment}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Registrar Nuevo Pago
        </button>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por alumno o carrera..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
        <button className="btn btn-secondary" onClick={clearSearch}>
          Limpiar
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-dark table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Alumno</th>
              <th>Fecha de Pago</th>
              <th>Mes Pagado</th>
              <th>Carrera</th>
              <th>Monto</th>
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
                <td colSpan={6} className="text-danger text-center">
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              currentRecords.map((p) => (
                <tr key={p.id_pago}>
                  <td>{p.id_pago}</td>
                  <td>{p.alumno}</td>
                  <td>{new Date(p.afecha_de_pago).toLocaleDateString()}</td>
                  <td>{p.mes_pagado}</td>
                  <td>{p.carrera_afectada}</td>
                  <td>${p.monto.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Mostrando {currentRecords.length} de {filteredPayments.length}{" "}
          registros
        </span>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={handlePrevPage}>
                Anterior
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">
                {currentPage} de {totalPages || 1}
              </span>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages || totalPages === 0 ? "disabled" : ""
              }`}
            >
              <button className="page-link" onClick={handleNextPage}>
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </InfoContainer>
  );
};

export default PaymentManagement;

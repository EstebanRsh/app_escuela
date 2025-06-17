import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <div className="p-5 mb-4 bg-light rounded-3 text-center">
        <h1 className="display-5 fw-bold">Bienvenidos a la Plataforma Escolar</h1>
        <p className="fs-4">Un espacio moderno para la gestión académica.</p>
        <Link to="/signup" className="btn btn-primary btn-lg mt-3">
          Únete a Nuestra Comunidad
        </Link>
      </div>
    </div>
  );
}

export default Home;
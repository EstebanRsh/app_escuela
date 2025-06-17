import React from 'react';

const Nosotros: React.FC = () => {
  return (
    <div className="container my-5">
      {/* Sección Principal con Imagen */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-7">
          <h1 className="display-4 fw-bold">Nuestra Historia</h1>
          <p className="lead text-muted">
            Fundado en 1998, el Sistema Escolar ha crecido desde una pequeña comunidad educativa hasta convertirse en un referente de innovación y excelencia académica en la región.
          </p>
          <p>
            Nuestra misión es empoderar a los estudiantes con las herramientas, el conocimiento y los valores necesarios para enfrentar los desafíos del futuro. Creemos en un aprendizaje integral que fomenta tanto el desarrollo intelectual como el personal, preparando a nuestros alumnos para ser ciudadanos responsables y líderes en sus comunidades.
          </p>
        </div>
        <div className="col-lg-5">
          {/* Puedes reemplazar este div con una imagen real de tu escuela */}
          <img 
            src="https://placehold.co/600x400/343a40/ffffff?text=Nuestra+Escuela"
            className="img-fluid rounded shadow"
            alt="Imagen de la fachada de la escuela"
          />
        </div>
      </div>

      <hr className="my-5" />

      {/* Sección de Misión y Visión */}
      <div className="row text-center">
        <h2 className="mb-4">Nuestros Pilares</h2>
        <div className="col-md-6 mb-3">
          <div className="p-4 rounded-3 bg-light h-100">
            <h3>Misión</h3>
            <p>Formar individuos íntegros, críticos y creativos, capaces de transformar positivamente la sociedad a través del conocimiento y los valores éticos.</p>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="p-4 rounded-3 bg-light h-100">
            <h3>Visión</h3>
            <p>Ser una institución educativa líder, reconocida por su excelencia académica, su innovación constante y su profundo compromiso con el desarrollo humano.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
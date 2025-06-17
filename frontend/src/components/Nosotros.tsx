import React from 'react';
import InfoContainer from './InfoContainer'; 

const Nosotros: React.FC = () => {
  return (
    <InfoContainer>
      <div className="row align-items-center mb-5">
        <div className="col-lg-7">
          <h1 className="display-4 fw-bold">Nuestra Historia</h1>
          <p className="lead">
            Fundado en 1998, el Sistema Escolar ha crecido desde una pequeña comunidad educativa hasta convertirse en un referente de innovación y excelencia académica en la región.
          </p>
          <p>
            Nuestra misión es empoderar a los estudiantes con las herramientas, el conocimiento y los valores necesarios para enfrentar los desafíos del futuro. Creemos en un aprendizaje integral que fomenta tanto el desarrollo intelectual como el personal, preparando a nuestros alumnos para ser ciudadanos responsables y líderes en sus comunidades.
          </p>
        </div>
        <div className="col-lg-5">
          <img 
            src="https://placehold.co/600x400/2a3b4f/ffffff?text=App+Escuela"
            className="img-fluid rounded shadow"
            alt="Imagen de la fachada de la escuela"
          />
        </div>
      </div>

      <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}/>

      <div className="row text-center">
        <h2 className="mb-4">Nuestros Pilares</h2>
        <div className="col-md-6 mb-3">
            <h3>Misión</h3>
            <p>Formar individuos íntegros, críticos y creativos, capaces de transformar positivamente la sociedad a través del conocimiento y los valores éticos.</p>
        </div>
        <div className="col-md-6 mb-3">
            <h3>Visión</h3>
            <p>Ser una institución educativa líder, reconocida por su excelencia académica, su innovación constante y su profundo compromiso con el desarrollo humano.</p>
        </div>
      </div>
    </InfoContainer>
  );
};

export default Nosotros;
import InfoContainer from './common/InfoContainer'; // 1. Importamos el contenedor

const Profile = () => {
  return (
    // 2. Usamos InfoContainer para el contenido del perfil
    <InfoContainer>
      <h1>Perfil de Usuario</h1>
      <p className="lead">
        Esta sección mostrará los detalles de tu perfil. ¡Próximamente!
      </p>
    </InfoContainer>
  );
};

export default Profile;
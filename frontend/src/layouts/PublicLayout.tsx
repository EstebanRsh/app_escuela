import { Outlet } from "react-router-dom";
import PublicNavbar from "../layouts/PublicNavbar"; 
import { Suspense } from "react";

function PublicLayout() {
  return (
    <div>
      <PublicNavbar />
      <main>
        <Suspense fallback={<div className="vh-100 d-flex justify-content-center align-items-center">Cargando contenido...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default PublicLayout;
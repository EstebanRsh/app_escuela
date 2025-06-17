import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Suspense } from "react";

function MainLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Suspense fallback={<div className="loader">Cargando contenido...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default MainLayout;

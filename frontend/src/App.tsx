import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/router/ProtectedRoutes";
import PublicRoutes from "./components/router/PublicRoutes";
import Layout from "./layouts/MainLayout"; 
import PublicLayout from "./layouts/PublicLayout"; 
import { lazy } from "react";

const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Profile = lazy(() => import("./components/Profile"));
const Notifications = lazy(() => import("./components/Notifications"));
const Info = lazy(() => import("./components/Info"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route element={<PublicRoutes />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>
        
        {/* --- RUTAS PROTEGIDAS --- */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
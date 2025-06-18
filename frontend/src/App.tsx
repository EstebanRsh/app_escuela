import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/router/ProtectedRoutes";
import PublicRoutes from "./components/router/PublicRoutes";
import Layout from "./layouts/MainLayout";
import { lazy } from "react";

const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Profile = lazy(() => import("./components/Profile"));
const Notifications = lazy(() => import("./components/Notifications"));
const Nosotros = lazy(() => import("./components/Nosotros"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const SignupDesarrollador = lazy(
  () => import("./components/SignupDesarrollador")
);
const StudentCareers = lazy(() => import("./components/student/StudentCareer"));
const CareerManagement  = lazy(() => import("./components/admin/CareerManagement"));
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route element={<PublicRoutes />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route
              path="/signupDesarrollador"
              element={<SignupDesarrollador />}
            />
          </Route>
        </Route>

        {/* --- RUTAS PROTEGIDAS --- */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/student/careers" element={<StudentCareers />} />
            <Route path="/admin/careers" element={<CareerManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

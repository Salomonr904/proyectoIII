import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginAdmin from './pages/LoginAdmin';
import LoginPracticas from './pages/loginPracticas';
import LoginCalificaciones from './pages/LoginCalificaciones';
import LoadingScreen from './components/LoadingScreen';
import AdminPanel from './pages/AdminPanel';
import EstudiantePanel from './pages/EstudiantePanel';
import ProtectedAdmin from "./components/proteccionAdmin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route path="/login-practicas" element={<LoginPracticas />} />
      <Route path="/login-calificaciones" element={<LoginCalificaciones />} />


      <Route
        path="/admin-panel"
        element={
          <ProtectedAdmin>
            <AdminPanel />
          </ProtectedAdmin>
        }
      />

      {/*<Route
        path="/estudiante-panel"
        element={
          <ProtectedRoute>
            <EstudiantePanel/>
          </ProtectedRoute>
        }
      />*/}


      {/* Pantallas de carga */}
      <Route path="/loading-admin" element={<LoadingScreen redirectTo="/login-admin" />} />
      <Route path="/loading-practicas" element={<LoadingScreen redirectTo="/login-practicas" />} />
      <Route path="/loading-calificaciones" element={<LoadingScreen redirectTo="/login-calificaciones" />} />
    </Routes>
  );
}

export default App;

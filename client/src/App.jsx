import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Navbar from "./components/Navbar.jsx";
import AddBookPage from "./pages/AddBookPage.jsx";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BookDetailsPage from "./pages/BookDetailsPage.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";

// Protected Route Wrapper
// This ensures users cannot see the Dashboard unless they are logged in

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddBookPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <PrivateRoute>
                <BookDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <LibraryPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

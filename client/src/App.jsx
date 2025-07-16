import { useContext } from "react";
import { useNavigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppContext } from "./contexts/AppContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import { CheckCircle } from "lucide-react";
import { Button } from "./components/ui/button";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
  }

  return children;
};


const Layout = ({ children }) => {
  const { user, logout } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user && (
        <header className="bg-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Collaborative Board</span>
          </div>
          <Button
            onClick={logout}
            variant='destructive'
            className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"
          >
            Logout
          </Button>
        </header>
      )}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};


export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<h2 className="text-center mt-10">404 - Page Not Found</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
}

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const readToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return setUserName(null);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const name =
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] ||
          payload.name ||
          payload.Name ||
          "";
        setUserName(name);
      } catch (e) {
        setUserName(null);
      }
    };

    readToken();

    const onStorage = (e) => {
      if (e.key === "token") readToken();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/meetings" className="text-xl font-bold text-blue-600">
            ProjectMeet
          </Link>
          <Link
            to="/meetings"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Spotkania
          </Link>
          <Link
            to="/calendar"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Kalendarz
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {userName ? (
            <>
              <span className="text-sm text-gray-700">Cześć, {userName}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-blue-600 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

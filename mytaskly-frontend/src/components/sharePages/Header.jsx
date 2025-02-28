import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { TokenContext } from "../../utils/TokenContext";
import HomeImage from "../../assets/home2.png";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { decodedToken, logout } = useContext(TokenContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50 p-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={HomeImage} alt="Taskly Logo" className="h-10 w-auto" />
        </Link>

        {!decodedToken && (
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            <button
              onClick={() => scrollToSection("home")}
              className="mr-5 text-2xl hover:text-gray-900"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="mr-5 text-2xl hover:text-gray-900"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="mr-5 text-2xl hover:text-gray-900"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="mr-5 text-2xl hover:text-gray-900"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="mr-5 text-2xl hover:text-gray-900"
            >
              Contact
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="mr-5 text-2xl hover:text-gray-900"
            >
              Testimonials
            </button>
          </nav>
        )}

        {decodedToken ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-5xl"
            >
              <FaUserCircle />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center bg-indigo-600 text-white text-xl border-0 py-2 px-4 rounded hover:bg-indigo-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

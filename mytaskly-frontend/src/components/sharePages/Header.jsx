import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { TokenContext } from "../../utils/TokenContext";
import HomeImage from "../../assets/home2.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { User } from "lucide-react";
import CreateOrganization from "../Models/CreateOrganization";
import CreateProject from "../Models/CreateProject";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, decodedToken } = useContext(TokenContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const dropdownRef = useRef(null);
  


  const userId = decodedToken?.user_id;


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-[#23486A] shadow-md z-50 p-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={HomeImage} alt="Taskly Logo" className="h-10 w-auto" />
        </Link>

        {!decodedToken && (
          <>
            <button
              className="md:hidden text-white text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <nav className="md:flex hidden text-white items-center text-base font-[Poppins]">
              {["home", "about", "features", "pricing", "contact", "testimonials"].map(
                (item) => (
                  <button key={item} className="mr-5 text-1xl hover:text-[#EFB036]">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                )
              )}
            </nav>
          </>
        )}

        {decodedToken ? (
          <div className="relative flex items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-5">
            <Link
              className="text-white text-1xl bg-[#EFB036] p-1 rounded-lg"
              to="/dashboard"
            >
              Dashboard
            </Link>

            {/* Show Create Organization button only on Dashboard */}
            {location.pathname === "/dashboard" && (
              <button
                className="text-white text-center text-1xl bg-[#EFB036] p-1 rounded-lg"
                onClick={() => setShowOrgModal(true)}
              >
                Create Organization
              </button>
            )}

            {/* Show Create Project button only on Organization page */}
            {location.pathname === "/organization" && (
              <button
                className="text-white text-center text-1xl bg-[#EFB036] p-1 rounded-lg"
                onClick={() => setShowProjectModal(true)}
              >
                Create Project
              </button>
            )}

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-5xl"
            >
              <User color="white" size={40} />
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-[50px] w-48 bg-white border rounded-lg shadow-lg"
              >
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
            className="hidden lg:block bg-[#EFB036] text-white text-xl border-0 py-2 px-4 rounded"
          >
            Login
          </Link>
        )}
      </div>

      {/* Modals */}
      {showOrgModal && (
        <CreateOrganization
          userId={userId}
          onClose={() => setShowOrgModal(false)}
          onSuccess={() => {
            setShowOrgModal(false);
            navigate("/dashboard");
          }}
        />
      )}

      {showProjectModal && (
        <CreateProject  
          onClose={() => setShowProjectModal(false)}
          onSuccess={() => {
            setShowProjectModal(false);
            navigate("/organization");
          }}
        />
      )}

    </header>
  );
};

export default Header;

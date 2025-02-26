// import { Link, useLocation, useNavigate } from "react-router-dom";
// import HomeImage from "../../assets/home2.png";
// import { FaUserCircle } from "react-icons/fa";

// const Header = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const scrollToSection = (id) => {
//     if (location.pathname !== "/") {
//       navigate("/", { replace: true }); 
//       setTimeout(() => {
//         document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//       }, 100);
//     } else {
//       document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <header className="fixed top-0 w-full bg-white shadow-md z-50 p-5">
//       <div className="container mx-auto flex justify-between items-center">
     
//         <Link to="/">
//           <img src={HomeImage} alt="Taskly Logo" className="h-10 w-auto" />
//         </Link>
 
//         <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
//           <button onClick={() => scrollToSection("home")} className="mr-5 text-2xl hover:text-gray-900">Home</button>
//           <button onClick={() => scrollToSection("about")} className="mr-5 text-2xl hover:text-gray-900">About</button>
//           <button onClick={() => scrollToSection("features")} className="mr-5 text-2xl hover:text-gray-900">Features</button>
//           <button onClick={() => scrollToSection("pricing")} className="mr-5 text-2xl hover:text-gray-900">Pricing</button>
//           <button onClick={() => scrollToSection("contact")} className="mr-5 text-2xl hover:text-gray-900">Contact</button>
//           <button onClick={() => scrollToSection("testimonials")} className="mr-5 text-2xl hover:text-gray-900">Testimonials</button>
//         </nav>

//         <Link to="/profile" className=" text-5xl">
//           <FaUserCircle />
//         </Link>
//         <Link to="/login" className="inline-flex items-center bg-indigo-600 text-white text-xl border-0 py-2 px-4 rounded hover:bg-indigo-700">
//           Login →
//         </Link>
//       </div>
//     </header>
//   );
// };

// export default Header;
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { TokenContext } from "../../utils/TokenContext";
import HomeImage from "../../assets/home2.png";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { decodedToken, updateToken } = useContext(TokenContext); // Get decoded token and updateToken

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
    updateToken(null); // ✅ Clears token from context and localStorage
    navigate("/login");
  };
  // // 🔹 Logout Function
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("decodedToken");
  
  //   navigate("/login"); // Redirect to login after logout
  // };

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50 p-5">
      <div className="container mx-auto flex justify-between items-center">
        {/* 🔹 Logo */}
        <Link to="/">
          <img src={HomeImage} alt="Taskly Logo" className="h-10 w-auto" />
        </Link>

        {/* 🔹 Navigation Links */}
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <button onClick={() => scrollToSection("home")} className="mr-5 text-2xl hover:text-gray-900">Home</button>
          <button onClick={() => scrollToSection("about")} className="mr-5 text-2xl hover:text-gray-900">About</button>
          <button onClick={() => scrollToSection("features")} className="mr-5 text-2xl hover:text-gray-900">Features</button>
          <button onClick={() => scrollToSection("pricing")} className="mr-5 text-2xl hover:text-gray-900">Pricing</button>
          <button onClick={() => scrollToSection("contact")} className="mr-5 text-2xl hover:text-gray-900">Contact</button>
          <button onClick={() => scrollToSection("testimonials")} className="mr-5 text-2xl hover:text-gray-900">Testimonials</button>
        </nav>

        {/* 🔹 Show Profile if Logged In, Otherwise Show Login */}
        {decodedToken ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-5xl">
              <FaUserCircle />
            </Link>
            <button onClick={handleLogout} className="bg-red-500 text-white text-xl border-0 py-2 px-4 rounded hover:bg-red-700">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="inline-flex items-center bg-indigo-600 text-white text-xl border-0 py-2 px-4 rounded hover:bg-indigo-700">
            Login →
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

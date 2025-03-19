import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { UserContext } from "../../context/UserContext";

const Layout = () => {
  const { userDetails } = useContext(UserContext);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Content starts below header */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {!userDetails && <Footer/>}
    </div>
  );
};

export default Layout;

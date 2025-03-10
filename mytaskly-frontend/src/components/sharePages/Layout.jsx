import { useContext } from "react";
import { TokenContext } from "../../utils/TokenContext";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
const Layout = () => {
  const { decodedToken } = useContext(TokenContext);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Content starts below header */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {!decodedToken && <Footer/>}
    </div>
  );
};

export default Layout;

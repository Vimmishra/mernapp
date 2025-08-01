
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../common-components/Navbar";

function Layout() {
  const location = useLocation();

  // Hide navbar on these routes
  const hideNavbarPaths = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div className={shouldShowNavbar ? "pt-16" : ""}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;

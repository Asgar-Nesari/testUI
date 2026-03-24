// import Footer from "@/containers/Footer";
// import Navbar from "@/containers/Navbar";
import { Outlet } from "react-router-dom";


const WebsiteLayout: React.FC<{ children?: React.ReactNode }> = () => {

  return (
    <>
      {/* <Navbar /> */}
      <main className="relative">
        <Outlet />
      </main>
      {/* <Footer /> */}


    
    </>
  );
};

export default WebsiteLayout;

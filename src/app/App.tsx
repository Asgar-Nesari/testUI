import LoadingSpinner from "@/container/LoadingSpinner";
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "@/routes/RouteConfig";
const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        {/* <ToastContainer /> */}
        <Suspense fallback={<LoadingSpinner />}>
          <Router />
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;

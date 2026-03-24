import { lazy, Suspense } from "react";
import WebsiteLayout from "@/layouts/WebsiteLayout";
import { useRoutes } from "react-router-dom";
import LoadingSpinner from "@/container/LoadingSpinner";

const Home = lazy(() => import("@/pages/home/Home"));

const combinedRoutes = [
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      { index: true, element: <Home /> },
      // { path: "about", element: <About /> },
     
    ].map((route) => ({
      ...route,
      element: (
        <Suspense fallback={<LoadingSpinner />}>{route.element}</Suspense>
      ),
    })),
  },
];

const RoutesConfig: React.FC = () => {
  const element = useRoutes(combinedRoutes);
  return element;
};

export default RoutesConfig;

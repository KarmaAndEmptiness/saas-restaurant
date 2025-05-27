import {
  createBrowserRouter,
  type DOMRouterOpts,
  type RouteObject,
  Navigate,
} from "react-router";
import Login from "@/layouts/Login";
import Home from "@/layouts/Home";
import Tenant from "@/views/Tenant";
import AuthGuard from "@/components/AuthGuard";
import Log from "@/views/Tenant/Log";
import Warning from "@/views/Tenant/Warning";
import Staff from "@/views/Admin";
import PlaceOrder from "@/views/Front";
import Client from "@/views/Front/Client";
import Goods from "@/views/Admin/Goods";
import Profile from "@/views/Profile";
import Setting from "@/views/Profile/Setting";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: "/home",
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home/tenant" replace />,
      },
      {
        path: "tenant",
        element: (
          <AuthGuard>
            <Tenant />
          </AuthGuard>
        ),
      },
      {
        path: "log",
        element: (
          <AuthGuard>
            <Log />
          </AuthGuard>
        ),
      },
      {
        path: "warning",
        element: (
          <AuthGuard>
            <Warning />
          </AuthGuard>
        ),
      },
      {
        path: "staff",
        element: (
          <AuthGuard>
            <Staff />
          </AuthGuard>
        ),
      },
      {
        path: "goods",
        element: (
          <AuthGuard>
            <Goods />
          </AuthGuard>
        ),
      },
      {
        path: "place-order",
        element: (
          <AuthGuard>
            <PlaceOrder />
          </AuthGuard>
        ),
      },
      {
        path: "client",
        element: (
          <AuthGuard>
            <Client />
          </AuthGuard>
        ),
      },
      {
        path: "profile",
        element: (
          <AuthGuard>
            <Profile />
          </AuthGuard>
        ),
      },
      {
        path: "setting",
        element: (
          <AuthGuard>
            <Setting />
          </AuthGuard>
        ),
      },
    ],
  },
];

const opts: DOMRouterOpts = {
  basename: import.meta.env.VITE_API_BASE,
};
export default createBrowserRouter(routes, opts);

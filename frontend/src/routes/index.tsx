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
import Goods from "@/views/Admin/Goods";
import Profile from "@/views/Profile";
import Setting from "@/views/Profile/Setting";
import Member from "@/views/Front/Member";
import Inventory from "@/views/Inventory";
import Report from "@/views/Report";
import Notification from "@/views/Notification";
import Branch from "@/views/Admin/Branch";
import OrderList from "@/views/Front/OrderList";
import Role from "@/views/Admin/Role";

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
        path: "branch",
        element: (
          <AuthGuard>
            <Branch />
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
        path: "order-list",
        element: (
          <AuthGuard>
            <OrderList />
          </AuthGuard>
        ),
      },
      {
        path: "role",
        element: (
          <AuthGuard>
            <Role />
          </AuthGuard>
        ),
      },
      {
        path: "member",
        element: (
          <AuthGuard>
            <Member />
          </AuthGuard>
        ),
      },
      {
        path: "inventory",
        element: (
          <AuthGuard>
            <Inventory />
          </AuthGuard>
        ),
      },
      {
        path: "report",
        element: (
          <AuthGuard>
            <Report />
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
        path: "setting",
        element: (
          <AuthGuard>
            <Setting />
          </AuthGuard>
        ),
      },
      {
        path: "notification",
        element: (
          <AuthGuard>
            <Notification />
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

import { createBrowserRouter, type DOMRouterOpts, type RouteObject } from "react-router";
import Login from "@/layouts/Login";
import Home from "@/layouts/Home";
import Tenant from '@/views/Tenant'
import AuthGuard from "@/components/AuthGuard";
import Log from "@/views/Tenant/Log";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard><Login /></AuthGuard>
  },
  {
    path: '/home',
    element: <AuthGuard><Home /></AuthGuard>,
    children: [
      {
        path: '',
        element: <AuthGuard><Tenant /></AuthGuard>
      },
      {
        path: 'log',
        element: <AuthGuard><Log /></AuthGuard>
      }
    ]
  }
]

const opts: DOMRouterOpts = {
  basename: import.meta.env.VITE_API_BASE
}
export default createBrowserRouter(routes, opts)
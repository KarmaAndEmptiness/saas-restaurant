import { createBrowserRouter, type DOMRouterOpts, type RouteObject } from "react-router";
import Login from "@/layouts/Login";
import Home from "@/layouts/Home";
import AuthGuard from "@/components/AuthGuard";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard><Login /></AuthGuard>
  },
  {
    path: '/home',
    element: <AuthGuard><Home /></AuthGuard>
  }
]

const opts: DOMRouterOpts = {
  basename: '/restaurant'
}
export default createBrowserRouter(routes, opts)
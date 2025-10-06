import SignInLayout from "../components/layouts/signInLayout";
import MainLayout from "../components/layouts/mainLayout";
import React from "react";
import EspaceTravail from "src/pages/espaceTravail";
import Home from "src/pages/home";
import NotFoundPage from "src/pages/home/notFounded";
import Notification from "src/pages/notifications";
import Parametre from "src/pages/parametre";
import ProfilUtilisateur from "src/pages/profilUtilisateur";
import Rapport from "src/pages/rapports";
import OnBoardingScreen from "src/pages/authUsr/OnBoardingScreen";
import Menu from "src/pages/espaceTravail/menu";
import NotificationDetail from "src/pages/notifications/NotificationDetail";
import Add from "src/pages/Administration/add";
import List from "src/pages/Administration/list";
import ProtectedRoute from "../components/ProtectedRoute";
import ListRole from "src/pages/roles/list";
import AddRole from "src/pages/roles/add";
import UpdateUser from "src/pages/Administration/update";
import UpdateRole from "src/pages/roles/updateRole";
import DetailUsers from "src/pages/Administration/detailUsers";
import SignIn from "src/pages/authUsr/sign-in";
import Service from "src/pages/authUsr/Service";
import Project from "src/pages/authUsr/Project";
import Blog from "src/pages/authUsr/Blog";
import About from "src/pages/authUsr/company/About";
import Equipment from "src/pages/authUsr/company/Equipment";
import Facilities from "src/pages/authUsr/company/Facilities";
import Consumable from "src/pages/authUsr/company/Consumable";
import Teams from "src/pages/authUsr/company/Teams";
import Contact from "src/pages/authUsr/company/Contact";

interface RouteType {
  path: string;
  element: React.ReactNode;
  children?: RouteType[];
}

const routes: RouteType[] = [
  {
    path: "/",
    element: <SignInLayout />,
    children: [{ path: "/", element: <OnBoardingScreen /> }],
  },

  {
    path: "/service",
    element: <SignInLayout />,
    children: [{ path: "/service", element: <Service /> }],
  },

  {
    path: "/project",
    element: <SignInLayout />,
    children: [{ path: "/project", element: <Project /> }],
  },

  {
    path: "/blog",
    element: <SignInLayout />,
    children: [{ path: "/blog", element: <Blog /> }],
  },

  {
    path: "/",
    element: <SignInLayout />,
    children: [{ path: "/sign-in", element: <SignIn /> }],
  },
  {
    path: "/",
    element: <SignInLayout />,
    children: [{ path: "/onboard", element: <OnBoardingScreen /> }],
  },

  {
    path: "/about",
    element: <SignInLayout />,
    children: [{ path: "/about", element: <About /> }],
  },

  {
    path: "/equipment",
    element: <SignInLayout />,
    children: [{ path: "/equipment", element: <Equipment /> }],
  },

  {
    path: "/facilities",
    element: <SignInLayout />,
    children: [{ path: "/facilities", element: <Facilities /> }],
  },

  {
    path: "/Consumable",
    element: <SignInLayout />,
    children: [{ path: "/Consumable", element: <Consumable /> }],
  },

  {
    path: "/teams",
    element: <SignInLayout />,
    children: [{ path: "/teams", element: <Teams /> }],
  },
  {
    path: "/contact",
    element: <SignInLayout />,
    children: [{ path: "/contact", element: <Contact /> }],
  },

  {
    path: "/espace_travail",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/espace_travail/:id", element: <EspaceTravail /> }],
  },
  {
    path: "/menu",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/menu", element: <Menu /> }],
  },
  {
    path: "/notification",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/notification", element: <Notification /> }],
  },
  {
    path: "/notificationdetail",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/notificationdetail", element: <NotificationDetail /> },
    ],
  },
  {
    path: "/parametre",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/parametre", element: <Parametre /> }],
  },
  {
    path: "/profile_utilisateur",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/profile_utilisateur", element: <ProfilUtilisateur /> },
    ],
  },
  {
    path: "/rapport",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/rapport", element: <Rapport /> }],
  },

  {
    path: "/add",
    element: <MainLayout />,
    children: [{ path: "/add", element: <Add /> }],
  },

  {
    path: "/list",
    element: <MainLayout />,
    children: [{ path: "/list", element: <List /> }],
  },

  {
    path: "/listRole",
    element: <MainLayout />,
    children: [{ path: "/listRole", element: <ListRole /> }],
  },

  {
    path: "/addRole",
    element: <MainLayout />,
    children: [{ path: "/addRole", element: <AddRole /> }],
  },

  {
    path: "/updateusers",
    element: <MainLayout />,
    children: [{ path: "/updateusers/:id", element: <UpdateUser /> }],
  },

  {
    path: "/updateroles",
    element: <MainLayout />,
    children: [{ path: "/updateroles/:id", element: <UpdateRole /> }],
  },

  {
    path: "/detail_users",
    element: <MainLayout />,
    children: [{ path: "/detail_users/:id", element: <DetailUsers /> }],
  },

  { path: "*", element: <NotFoundPage /> },
];

export default routes;

import { createBrowserRouter } from "react-router-dom";
import Customerlayout from "./components/layout/Customerlayout";
import Home from "./pages/customer/Home";
import PublicOnlyLayout from "./components/auth/PublicOnlyLayout";
import SignInPage from "./pages/auth/Sign-in";
import SignUpPage from "./pages/auth/Sign-up";
import ProtectedLayout from "./components/auth/ProtectedLayout";
// import Profile from "./pages/customer/Profile";
import RoleGuardLayout from "./components/auth/RoleGuardLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";
import Collections from "./pages/customer/Collections";
import CollectionDetails from "./pages/customer/CollectionDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Customerlayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "collections",
        element: <Collections />,
      },
      {
        path: "collection/:id",
        element: <CollectionDetails />,
      },
      {
        element: <PublicOnlyLayout />,
        children: [
          {
            path: "sign-in/*",
            element: <SignInPage />,
          },
          {
            path: "sign-up/*",
            element: <SignUpPage />,
          },
          // {
          //   path: "collections",
          //   element: <Collections />,
          // },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          // {
          //   path: "profile",
          //   element: <Profile />,
          // },
        ],
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <RoleGuardLayout allow={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,

            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: "products",
                element: <AdminProducts />,
              },
              {
                path: "coupons",
                element: <AdminCoupons />,
              },
              {
                path: "orders",
                element: <AdminOrders />,
              },
              {
                path: "settings",
                element: <AdminSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Customerlayout />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//       {
//         element: <PublicOnlyLayout />,
//         children: [
//           {
//             path: "sign-in/*",
//             element: <SignInPage />,
//           },
//           {
//             path: "sign-up/*",
//             element: <SignUpPage />,
//           },
//           {
//             path: "collections",
//             element: <Collections />,
//           },
//           // {
//           //   path: "collection/:id",
//           //   element: <CollectionDetails />,
//           // },
//         ],
//       },
//       {
//         element: <ProtectedLayout />,
//         children: [
//           // {
//           //   path: "order-success",
//           //   element: <CustomerOrderSuccessPage />,
//           // },
//           {
//             path: "profile",
//             element: <Profile />,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     element: <ProtectedLayout />,
//     children: [
//       {
//         element: <RoleGuardLayout allow={["admin"]} />,
//         children: [
//           {
//             path: "/admin",
//             element: <AdminLayout />,

//             children: [
//               {
//                 index: true,
//                 element: <AdminDashboard />,
//               },
//               {
//                 path: "products",
//                 element: <AdminProducts />,
//               },
//               {
//                 path: "coupons",
//                 element: <AdminCoupons />,
//               },
//               {
//                 path: "orders",
//                 element: <AdminOrders />,
//               },
//               {
//                 path: "settings",
//                 element: <AdminSettings />,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ]);

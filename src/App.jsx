import React, { useState, useEffect } from 'react';
import {
  Outlet, createBrowserRouter,
  RouterProvider, useNavigate
} from "react-router-dom";
import './styles/reset.scss';
import './styles/global.scss';
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { callFetchAccount } from './services/api';
import { doGetAccountAction } from './redux/account/accounterSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import BookTable from './components/Admin/Book/BookTable';
import MangeOrder from './components/Admin/Order/ManageOrder';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import AdminPage from './pages/admin';
import UserTable from './components/Admin/User/UserTable';
import History from './components/Order/History';
import OrderPage from './pages/order/Order';
const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Context là từ use outlet content của package react-router-dom */}
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  )
}



export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);

  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
    ) return;
    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
    // console.log(">>> check res", res);
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        }
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <ProtectedRoute> <AdminPage /></ProtectedRoute> },
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "book",
          element: <BookTable />,
        },
        {
          path: "order",
          element: <MangeOrder />,
        }
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/order",
      element: <ProtectedRoute>
        <OrderPage />
      </ProtectedRoute>,
    },
    {
      path: "/history",
      element: <ProtectedRoute>
        <History />
      </ProtectedRoute>,
    },
  ]);
  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/' ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
    </>
  )
}

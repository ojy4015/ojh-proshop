// 1. App 컴포넌트를 만든다.

// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';

// 2. Outlet을 import
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
// import { logout } from './slices/authSlice';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import HomeScreen from './screens/HomeScreen';

const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const expirationTime = localStorage.getItem('expirationTime');
  //   if (expirationTime) {
  //     const currentTime = new Date().getTime();

  //     if (currentTime > expirationTime) {
  //       dispatch(logout());
  //     }
  //   }
  // }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Header />
      <main className="py-3">
        {/* 3. 각 페이지 컴포턴트가 보여져야 하는 부분에 Outlet 컴포넌트를 넣은다 */}
        <Container>
          <Outlet />
          {/* <HomeScreen /> */}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;

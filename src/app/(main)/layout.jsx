import Footer from '@/components/Footer';
import Navbar from '@/components/Navber';
import React from 'react';
import { ToastContainer } from 'react-toastify';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Navbar></Navbar>
            <main>
            {children}
            </main>
            <Footer></Footer>
            <ToastContainer />
        </div>
    );
};

export default MainLayout;
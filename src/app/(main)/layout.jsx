import Footer from '@/components/Footer';
import Navbar from '@/components/Navber';
import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Navbar></Navbar>
            <main>
            {children}
            </main>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;
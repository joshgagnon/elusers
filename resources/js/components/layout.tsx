import * as React from 'react';
import Navbar from './navbar';

interface ILayoutProps {
    children: any;
}

const Layout = ({ children }: ILayoutProps) => (
    <div>
        <Navbar />

        <div className="container">
            { children }
        </div>
    </div>
);

export default Layout;
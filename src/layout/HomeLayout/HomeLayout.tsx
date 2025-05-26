import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import "./homeLayout.css";

export default function HomeLayout() {
    return (
        <div className="home-layout">
            <Header />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

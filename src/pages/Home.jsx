import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Home.css';
import bgr1 from '../assets/bgr1.jpg';
import bgr2 from '../assets/bgr2.jpg';
import bgr3 from '../assets/bgr3.jpg';

const Home = () => {
    const backgrounds = [bgr1, bgr2, bgr3];
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [backgrounds.length]);

    return (
        <div className="home-container">
            <Header />
            <main className="main-content">
                <section
                    className="hero-section"
                    style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
                >
                    <div className="hero-overlay">
                        <h1 className="hero-title">Đ.N.Q fashion</h1>
                        <p className="hero-subtitle">
                            Định hình phong cách của bạn với bộ sưu tập độc đáo
                        </p>
                        <Link to="/products" className="hero-button">
                            Khám phá ngay
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
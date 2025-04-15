import React from 'react';
import '../styles/Footer.css';
import bkLogo from '../assets/bk.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <img src={bkLogo} alt="BK Logo" className="footer-logo" />
                <p className="footer-name">Đậu Ngọc Quân</p>
                <p className="footer-text">Sinh viên K2022 trường Đại học Bách khoa – ĐHQG-HCM</p>
                <p className="footer-text">
                    Liên hệ:{' '}
                    <a
                        href="https://www.facebook.com/NQ2306"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        https://www.facebook.com/NQ2306
                    </a>
                </p>
                <p className="footer-text">
                    Content creator tại:{' '}
                    <a
                        href="https://www.facebook.com/BKCSE.Multimedia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        https://www.facebook.com/BKCSE.Multimedia
                    </a>
                </p>
                <p className="footer-copyright">© 2025 Đậu Ngọc Quân. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">🅿️ <span>SmartPark</span></div>
        <p>India's smartest parking solution. Find, book, and manage parking spots in seconds.</p>
        <div className="footer-social">
          <a href="#!" className="social-btn">𝕏</a>
          <a href="#!" className="social-btn">in</a>
          <a href="#!" className="social-btn">f</a>
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/parking">Find Parking</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Sign Up</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#!">Help Center</a>
          <a href="#!">Contact Us</a>
          <a href="#!">Privacy Policy</a>
          <a href="#!">Terms of Service</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📧 support@smartpark.in</p>
          <p>📞 1800-SMARTPARK</p>
          <p>🏢 Pune, Maharashtra</p>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p>© {new Date().getFullYear()} SmartPark. All rights reserved. Made with ❤️ in India.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

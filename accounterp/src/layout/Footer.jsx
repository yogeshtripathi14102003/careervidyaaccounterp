import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content">
          
          {/* Column 1: About */}
          <div className="footer-col">
            <h3>Careervidya</h3>
            <p>Providing the best career guidance and technological solutions to empower your future.</p>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-col">
            <h4>Our course</h4>
            <ul>
              <li><a href="#">MBA</a></li>
              <li><a href="#">BBA</a></li>
              <li><a href="#">Bt.ech</a></li>
              <li><a href="#">M.tech</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <FaMapMarkerAlt className="icon" />
              <span>Noida, Uttar Pradesh, India</span>
            </div>
            <div className="contact-item">
              <FaPhone className="icon" />
              <span>+91 9289712364</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="icon" />
              <span>info@careervidya.in</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Careervidya. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// client/src/components/Footer.js
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      {/* About */}
      <div className="footer-column">
        <h4>About</h4>
        <p>
          bachavSetu is a disaster response platform uniting communities, coordinating resources,
          and empowering volunteers for rapid, effective relief.
        </p>
      </div>

      {/* Contact */}
      <div className="footer-column">
        <h4>Contact</h4>
        <p><strong>Email:</strong> <a href="mailto:contact@bachavsetu.com">contact@bachavsetu.com</a></p>
        <p><strong>Phone:</strong> <a href="tel:+911234567890">+91 1234567890</a></p>
        <p><strong>Address:</strong> 123 Rescue St, Delhi, India</p>
      </div>

      {/* Social */}
      <div className="footer-column">
        <h4>Follow Us</h4>
        <div className="social-icons">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2025 bachavSetu. All Rights Reserved.</p>
    </div>

    <style jsx="true">{`
      .footer {
        background: #111;
        color: #ccc;
        font-size: 0.9rem;
      }
      .footer-content {
        display: flex;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: auto;
        padding: 3rem 1rem 1rem;
        gap: 2rem;
      }
      .footer-column {
        flex: 1 1 200px;
      }
      .footer-column h4 {
        color: #fff;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }
      .footer-column p {
        line-height: 1.6;
        margin-bottom: 0.75rem;
      }
      .footer-column a {
        color: #4ecdc4;
        text-decoration: none;
      }
      .footer-column a:hover {
        text-decoration: underline;
      }
      .social-icons {
        display: flex;
        gap: 1rem;
        font-size: 1.2rem;
      }
      .social-icons a {
        color: #ccc;
        transition: color 0.3s;
      }
      .social-icons a:hover {
        color: #4ecdc4;
      }
      .footer-bottom {
        text-align: center;
        padding: 1.5rem 0;
        background: #0a0a0a;
        color: #666;
        font-size: 0.85rem;
      }
      @media (max-width: 768px) {
        .footer-content {
          flex-direction: column;
          text-align: center;
        }
        .social-icons {
          justify-content: center;
        }
      }
    `}</style>
  </footer>
);

export default Footer;

// client/src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  // Rotating phrases for About section
  const aboutPhrases = [
    'disaster response platform',
    'resource coordination hub',
    'volunteer network'
  ];
  const [aboutIndex, setAboutIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutIndex((prev) => (prev + 1) % aboutPhrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [aboutPhrases.length]);

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About */}
        <div className="footer-column">
          <h4>About</h4>
          <p>
            BachavSetu is a <span className="about-highlight">{aboutPhrases[aboutIndex]}</span>.
          </p>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Contact</h4>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:ak188929@gmail.com">ak188929@gmail.com</a>
          </p>
        </div>

        {/* Social */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://www.instagram.com/ar_ankit1/" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/ankit-kushwaha-6347b7287/" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 BachavSetu. Together for Relief.</p>
        <p>For demo purposes only – not an official organization.</p>
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
          margin: 0 auto;
          padding: 1.5rem 0.5rem 1rem;
          gap: 1rem;
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
        .about-highlight {
          color: #4ecdc4;
          font-weight: bold;
        }
        .social-icons {
          display: flex;
          justify-content: center;
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
          padding: 1.0rem 0;
          background: #0a0a0a;
          color: #666;
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

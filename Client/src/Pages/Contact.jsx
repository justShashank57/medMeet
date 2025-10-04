import React from 'react';
import { useToast } from '../components/Toast';

export default function Contact() {
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast({ 
      message: 'Thank you for your message! We\'ll get back to you soon.', 
      type: 'success' 
    });
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any questions you might have. We look forward to hearing from you!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Email Us</h3>
              <p>support@medmeet.com</p>
              <span>We'll get back to you within 24 hours</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
              <span>Mon-Fri 9AM-6PM EST</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Visit Us</h3>
              <p>123 Healthcare Ave</p>
              <span>Medical District, MD 12345</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday: 9:00 AM - 4:00 PM<br/>Sunday: Closed</p>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                required 
              />
              
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                required 
              />
              
              <select name="subject" required>
                <option value="">Select Subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Issues</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
              
              <textarea 
                name="message" 
                placeholder="Your Message" 
                rows="5" 
                required
              ></textarea>
              
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: white;
          padding: 4rem 2rem;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .contact-header h1 {
          font-family: 'Quicksand', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #333;
        }

        .contact-header p {
          font-family: 'Quicksand', sans-serif;
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .contact-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .contact-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
          text-align: center;
          transition: transform 0 .3s ease, box-shadow 0 .3s ease;
          border: 1px solid #f0f0f0;
        }

        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: rgba(149, 157, 165, 0.3) 0px 15px 35px;
        }

        .contact-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 50%;
          color: #1B56F7;
        }

        .contact-card h3 {
          font-family: 'Quicksand', sans-serif;
          color: #1B56F7;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .contact-card p {
          font-family: 'Quicksand', sans-serif;
          color: #333;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .contact-card span {
          color: #666;
          font-size: 0.9rem;
          font-family: 'Quicksand', sans-serif;
        }

        .contact-form-container {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
          border: 1px solid #f0f0f0;
        }

        .contact-form-container h2 {
          font-family: 'Quicksand', sans-serif;
          color: #1B56F7;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
        }

        .contact-form input,
        .contact-form select,
        .contact-form textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-family: 'Quicksand', sans-serif;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          margin-bottom: 1rem;
        }

        .contact-form input:focus,
        .contact-form select:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: #1B56F7;
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          width: 100%;
          background: #1B56F7;
          color: white;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-family: 'Quicksand', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .submit-btn:hover {
          background: #1545d6;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .contact-page {
            padding: 2rem 1rem;
          }

          .contact-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .contact-info {
            grid-template-columns: 1fr;
          }

          .contact-header h1 {
            font-size: 2rem;
          }

          .contact-header p {
            font-size: 1rem;
          }

          .contact-form-container {
            padding: 2rem;
          }
        }

        @media (max-width: 480px) {
          .contact-page {
            padding: 1.5rem 1rem;
          }

          .contact-header h1 {
            font-size: 1.8rem;
          }

          .contact-card {
            padding: 1.5rem;
          }

          .contact-form-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
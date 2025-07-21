
"use client";

// import "@/app/booking/styles/contact.css";
// Importing the CSS file for styling
import '../booking/styles/contact.css';
import GoBackButton from '../booking/caterer-profile/components/GoBackButton';

export default function ContactPage() {
  return (
    <div className="contact-container">
      <GoBackButton />
       
      <h1 className="contact-heading">Get in Touch with OccasionOS</h1>
      <div className="contact-info">
        <p><strong>📍 Headquarters:</strong> 12, Royal Street, Lucknow, Uttar Pradesh, India</p>
        <p><strong>📞 Helpline:</strong> +91 99999 88888 (Mon-Sat, 10am to 6pm)</p>
        <p><strong>📧 Email:</strong> support@occasionos.com</p>
      </div>

      <div className="contact-form-box">
        <h2>Send Us a Message</h2>
        <form>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required />
          <button type="submit" className="fancy-button">Send Message 🚀</button>
        </form>
      </div>
    </div>
  );
}

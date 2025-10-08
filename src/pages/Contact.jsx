import React from 'react'

export default function Contact(){
  return (
    <main className="page light-page">
      <h2>Contact</h2>
      <p className="muted">Get in touch — we'd love to hear from you.</p>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>General</h3>
          <p>Email: <a href="mailto:nirajsingh9570460932@gmail.com">nirajsingh9570460932@gmail.com</a></p>
          <p>Phone: <a href="tel:+919153942168">+91 9153942168</a></p>
        </div>

        <div className="contact-card">
          <h3>Follow</h3>
          <p><a href="https://www.linkedin.com/in/niraj-kumar-singh-116437257/" target="_blank" rel="noreferrer">LinkedIn</a></p>
          <p><a href="https://github.com/nirajkumarsingh51" target="_blank" rel="noreferrer">GitHub</a></p>
        </div>
      </div>
    </main>
  )
}

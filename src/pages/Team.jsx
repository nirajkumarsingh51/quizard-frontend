import React from 'react'

const TEAM = [
  {
    name: 'Niraj Kumar Singh',
    role: 'Cloud Computing Enthusiast',
    location: 'Patna, India',
    email: 'nirajsingh9570460932@gmail.com',
    linkedin: 'https://www.linkedin.com/in/niraj-kumar-singh-116437257/',
    github: 'https://github.com/nirajkumarsingh51',
    img: 'https://media.licdn.com/dms/image/v2/D5635AQHPiN4PiT8s3g/profile-framedphoto-shrink_400_400/B56Zl7GF8KKIAc-/0/1758706819113?e=1760554800&v=beta&t=O4ri5uH9_JrVdhXYwnHQo4Zwjhz7vOJ5iwe99nxJAu0'
  },
  
]

export default function Team(){
  return (
    <main className="page light-page" style={{ color: '#edd0d0ff' }}>
      <h2>Our Team</h2>
      <p className="muted">Meet the people behind Quizard</p>

      <div className="team-grid">
        {TEAM.map(member => (
          <article key={member.email} className="team-card">
            <div className="team-img">
              <img src={member.img} alt={member.name} style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
            </div>
            <div className="team-body">
              <h3>{member.name}</h3>
              <div className="muted">{member.role}</div>
              <div className="team-contact">
                <a href={`mailto:${member.email}`}>{member.email}</a>
                <a href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={member.github} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          </article>
        ))}
      </div>

    </main>
  )
}

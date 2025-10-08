import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useSocket from '../hooks/useSocket'
import TOPICS from './topicsData'
import { motion } from 'framer-motion'

export default function Home(){
  const { socket, connected } = useSocket()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const joinByCode = ()=>{
    if (!socket) return alert('Connecting...')
    if (!code) return alert('Enter room id')
    socket.emit('joinRoom', { roomId: code, name: name || 'Guest' }, (res)=>{
      if (res && res.ok) navigate(`/lobby?room=${code}&name=${encodeURIComponent(name||'Guest')}`)
      else alert(res && res.error ? res.error : 'Could not join')
    })
  }

  return (
    <main className="home-root neon-frame app-fullscreen">
      <div className="home-inner">
        <header className="home-header">
          <div className="brand">
            <h1 className="brand-title">Quizard</h1>
            <p className="muted brand-sub">Pick a topic and play live quizzes with friends.</p>
          </div>

          <div className="controls">
            <input
              aria-label="Your name"
              className="input control-input"
              placeholder="Your name (optional)"
              value={name}
              onChange={e=>setName(e.target.value)}
            />

            <input
              aria-label="Room code"
              className="input control-input"
              placeholder="Enter room code to join"
              value={code}
              onChange={e=>setCode(e.target.value)}
            />

            <div className="control-actions">
              <button className="btn btn-primary neon-btn" onClick={joinByCode}>Join</button>
              <Link to="/rules" className="btn btn-ghost">Game Rules</Link>
            </div>
          </div>
        </header>

        <section className="topics-section">
          <h2 className="section-title">Choose a Topic</h2>
          <div className="topics-grid">
            {TOPICS.map(t => (
              <motion.article
                key={t.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="topic-card"
                onClick={() => {
                  if (!socket) return alert('Connecting...')
                  socket.emit('createRoom', { name: name || 'Host', topicId: t.id, questions: t.sampleQuestions }, (res)=>{
                    if (res && res.roomId) navigate(`/lobby?room=${res.roomId}&name=${encodeURIComponent(name||'Host')}&topic=${t.id}`)
                  })
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e)=>{ if(e.key === 'Enter') e.currentTarget.click() }}
              >
                <div className="topic-inner">
                  <h3 className="topic-title">{t.title}</h3>
                  <p className="muted topic-desc">{t.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

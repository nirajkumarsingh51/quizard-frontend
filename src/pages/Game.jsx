import React, { useEffect, useState } from 'react'
import useSocket from '../hooks/useSocket'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Game(){
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const roomId = search.get('room')
  const name = search.get('name')
  const { socket, connected } = useSocket()
  const [question, setQuestion] = useState(null)
  const [index, setIndex] = useState(0)
  const [final, setFinal] = useState(null)
  const [scores, setScores] = useState([])
  const [countdown, setCountdown] = useState(0)
  const [liveAnswers, setLiveAnswers] = useState({})
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [playerStats, setPlayerStats] = useState({ correct: 0, wrong: 0, score: 0 })

  useEffect(()=>{
    if (!socket) return
    socket.on('question', ({ question, index: idx, questionStart, duration })=>{
      setQuestion(question)
      setIndex(idx)
      setTotalQuestions(prev => (question && question.total) ? question.total : prev)
      setLiveAnswers({})
      const end = (questionStart || Date.now()) + (duration || 10000)
      const iv = setInterval(()=> setCountdown(Math.max(0, Math.round((end - Date.now())/1000))), 200)
      setTimeout(()=> clearInterval(iv), (duration || 10000)+500)
    })
    socket.on('scoreUpdate', ({ scores })=> setScores(scores || []))
  socket.on('gameEnded', ({ scores })=> setFinal(scores))
    socket.on('reveal', ({ correctIndex, results })=>{
      // results: array of {id,name,answered,correct,answer,time}
      // show a quick reveal animation (console for now)
      console.log('reveal', correctIndex, results)
    })
    socket.on('playerAnswered', ({ id, name, answer })=>{
      setLiveAnswers(prev => ({ ...prev, [id]: { id, name, answer } }))
    })
    return ()=>{
      socket.off('question'); socket.off('scoreUpdate'); socket.off('gameEnded'); socket.off('reveal')
    }
  },[socket])

  // update player stats when scores change
  useEffect(()=>{
    if (!scores || !scores.length) return
    const me = scores.find(s => s.id === (socket && socket.id))
    if (me) {
      // assume score equals correct count
      const correct = me.score || 0
      const total = totalQuestions || 0
      const wrong = Math.max(0, total - correct)
      setPlayerStats({ correct, wrong, score: me.score || 0 })
    }
  },[scores, totalQuestions])

  useEffect(()=>{
    if (!socket || !roomId) return
    if (connected) socket.emit('joinRoom', { roomId, name: name || 'Guest' }, ()=>{})
  },[socket, connected])

  // navigate to result when final is set
  useEffect(()=>{
    if (final && final.length) navigate(`/result?room=${roomId}`)
  },[final])

  const answer = (i)=>{ if (!socket || !roomId) return; socket.emit('submitAnswer', { roomId, answer: i }) }

  return (
    <div style={{padding:16}}>
      <h2 style={{marginBottom:12}}>Game — Room {roomId}</h2>
      {!question && !final && <div>Waiting for host to start the game...</div>}

      {question && (
        <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="page" style={{display:'flex', gap:16, alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div className="muted">Question {index+1} / {totalQuestions || '?'}</div>
                <h3 style={{marginTop:8, marginBottom:6}}>{question.text}</h3>
                <div style={{color:'#cbd5e1', marginBottom:8}}>{question.topic || ''}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:28, fontWeight:700}}>{countdown}</div>
                <div className="muted" style={{fontSize:12}}>seconds left</div>
              </div>
            </div>

            <div style={{marginTop:12}}>
              {question.options.map((o,i)=>(
                <button key={i} className="btn" style={{display:'block',width:'100%',textAlign:'left',margin:'10px 0',padding:'12px'}} onClick={()=>answer(i)}>{String.fromCharCode(65+i)} - {o}</button>
              ))}
            </div>

            <div style={{marginTop:10}}>
              <strong>Players answered:</strong>
              <div style={{marginTop:6}}>{Object.values(liveAnswers).map(a=> (<span key={a.id} style={{marginRight:8, padding:'4px 8px', background:'#0f172a', borderRadius:6}}>{a.name}</span>))}</div>
            </div>
          </div>

          {/* Stats panel */}
          <aside style={{width:220, flex:'none'}}>
            <div style={{background:'linear-gradient(180deg, rgba(99,102,241,0.12), rgba(14,165,233,0.06))', padding:12, borderRadius:12, color:'#e6eef8'}}>
              <div style={{fontSize:13, color:'#cbd5e1'}}>Your Stats</div>
              <div style={{marginTop:10}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}><span>Total</span><span style={{fontWeight:700}}>{totalQuestions || '-'}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}><span style={{color:'#86efac'}}>Correct</span><span style={{fontWeight:700}}>{playerStats.correct}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}><span style={{color:'#fca5a5'}}>Wrong</span><span style={{fontWeight:700}}>{playerStats.wrong}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}><span style={{color:'#fde68a'}}>Score</span><span style={{fontWeight:700}}>{playerStats.score}</span></div>
              </div>
              <div style={{marginTop:10, fontSize:12, color:'#a5b4cc'}}>Live leaderboard</div>
              <div style={{marginTop:8}}>
                {scores.map(s => (
                  <div key={s.id} style={{display:'flex', justifyContent:'space-between', fontSize:13, padding:'6px 0'}}>
                    <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:110}}>{s.name}</div>
                    <div style={{fontWeight:700}}>{s.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </motion.div>
      )}

      {final && (
        <div style={{marginTop:16}}>
          <h3>Final Results</h3>
          <ol>{final.map(s=>(<li key={s.id}>{s.name} - {s.score} pts</li>))}</ol>
          <button onClick={()=>navigate('/')} style={{marginTop:10}}>Back to home</button>
        </div>
      )}

      <div style={{marginTop:14}}><strong>Status:</strong> {connected? 'Connected':'Disconnected'}</div>
      
    </div>
  )
}

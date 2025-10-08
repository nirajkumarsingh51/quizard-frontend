import React, { useEffect, useState } from 'react'
import useSocket from '../hooks/useSocket'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function Result(){
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const roomId = search.get('room')
  const { socket } = useSocket()
  const [scores, setScores] = useState([])

  useEffect(()=>{
    if (!socket) return
    socket.on('gameEnded', ({ scores: s })=> setScores(s || []))
    // request room results if possible
    return ()=>{ socket.off('gameEnded') }
  },[socket])

  const back = ()=> navigate('/')
  const replay = ()=>{
    if (!socket || !roomId) return
    // ask server to start a fresh game (only host allowed)
    socket.emit('startGame', { roomId })
    // wait for gameStarted event then navigate
    const onStarted = ({ roomId: rid })=>{ if (rid === roomId) { navigate(`/game?room=${roomId}`); socket.off('gameStarted', onStarted) } }
    socket.on('gameStarted', onStarted)
  }

  const sorted = (scores || []).slice().sort((a,b)=> b.score - a.score)
  const winner = sorted[0]

  return (
    <div className="page">
      <h2>Results</h2>
      {winner && (
        <div style={{padding:12,background:'#063',borderRadius:8,marginBottom:12}}>
          <h3>Winner: {winner.name}</h3>
          <div style={{fontSize:20}}>{winner.score} pts</div>
        </div>
      )}
      <ol>
        {sorted.map(s=> (<li key={s.id} style={{padding:8,background:'#072',marginBottom:6,borderRadius:6}}>{s.name} — {s.score} pts — avg: {s.avgTime? Math.round(s.avgTime): 'N/A'}ms</li>))}
      </ol>
      <div style={{marginTop:12}}>
        <button className="btn" onClick={replay}>Replay</button>
        <button className="btn" onClick={back} style={{marginLeft:8}}>Home</button>
      </div>
    </div>
  )
}

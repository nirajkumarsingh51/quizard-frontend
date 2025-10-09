import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useSocket from '../hooks/useSocket'
import { motion } from 'framer-motion'

export default function Lobby(){
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const { socket, connected } = useSocket()
  const requestedRoom = search.get('room')
  const topic = search.get('topic')
  const initialName = search.get('name') || ''

  const [playerName, setPlayerName] = useState(initialName)
  const [roomId, setRoomId] = useState(requestedRoom || '')
  const [members, setMembers] = useState([])
  const [hostId, setHostId] = useState(null)

  useEffect(()=>{
    if (!socket) return
    // auto-join on connect if we have a roomId
    if (roomId) {
      socket.emit('joinRoom', { roomId, name: playerName || 'Guest' }, (res)=>{})
    }
    const onRoom = ({ roomId: rid, members: m, host }) => {
      if (rid !== roomId && roomId && rid) {
        // update only if this is our room
      }
      // set members for current room
      setMembers(m || [])
      if (host) setHostId(host)
    }
    const onGameStarted = ({ roomId: rid }) => {
      if (rid === roomId) navigate(`/game?room=${rid}&name=${encodeURIComponent(playerName||'')}`)
    }
  socket.on('roomUpdated', onRoom)
    socket.on('gameStarted', onGameStarted)
    return ()=>{
      socket.off('roomUpdated', onRoom)
      socket.off('gameStarted', onGameStarted)
    }
  },[socket, roomId, playerName])

  const createRoom = () => {
    if (!socket) return alert('Not connected')
    socket.emit('createRoom', { name: playerName || 'Host', roomId: roomId || undefined, topicId: topic }, (res)=>{
      if (res && res.roomId) {
        setRoomId(res.roomId)
      }
    })
  }

  const joinRoom = () => {
    if (!socket) return alert('Not connected')
    if (!roomId) return alert('Enter room id')
    socket.emit('joinRoom', { roomId, name: playerName || 'Guest' }, (res)=>{
      if (res && res.ok) {
        // joined, server will emit roomUpdated
      } else {
        alert(res && res.error ? res.error : 'Could not join')
      }
    })
  }

  const shareLink = () => {
  const link = `${location.origin}/lobby?room=${roomId}&name=${encodeURIComponent(playerName||'')}`
    try{ navigator.clipboard.writeText(link); alert('Share link copied') }catch(e){ prompt('Copy link', link) }
  }

  const startGame = () => {
    if (!socket || !roomId) return
    socket.emit('startGame', { roomId })
  }

  return (
    <div className="page">
      <h2>Lobby</h2>
      <div className="p-6">
        <label className="muted">Your name</label>
        <input className="input" value={playerName} onChange={e=>setPlayerName(e.target.value)} />

        <label className="muted" style={{marginTop:8}}>Room code</label>
        <input className="input" value={roomId} onChange={e=>setRoomId(e.target.value)} />

        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn" onClick={createRoom}>Create Room</button>
          <button className="btn" onClick={joinRoom}>Join Room</button>
          {roomId && <button className="btn" onClick={shareLink}>Share Room</button>}
        </div>

        <div style={{marginTop:16}}>
          <h4>Players</h4>
          <ul>
            {members.map(m=> (<li key={m.id}>{m.name} {m.isHost ? '(Host)' : ''}</li>))}
          </ul>
        </div>

        <div style={{marginTop:12}}>
          {hostId && socket && socket.id === hostId ? (
            <button className="btn" onClick={startGame}>Start Game</button>
          ) : (
            <div className="muted">Waiting for host to start the game</div>
          )}
        </div>
      </div>
    </div>
  )
}

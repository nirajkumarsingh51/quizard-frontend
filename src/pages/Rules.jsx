import React from 'react'

export default function Rules(){
  return (
    <div className="page">
      <h2>Quizard — Game Rules</h2>
      <section className="rules">
        <h3>1) Game overview</h3>
        <ul>
          <li>Quizard is a fast, web-based multiple-choice quiz game. Play solo or create/join a room to play with friends in real time.</li>
        </ul>

        <h3>2) Game modes</h3>
        <ul>
          <li><strong>Single Player</strong>: Practice and chase personal high scores.</li>
          <li><strong>Multiplayer</strong>: Create a room, invite friends with a link or code, and the host starts the match.</li>
        </ul>

        <h3>3) Question rules</h3>
        <ul>
          <li>Default: 10 questions per match.</li>
          <li>Each question has multiple options (one correct). Default timer: 10 seconds.</li>
          <li>One answer per player per question. No changes after submission.</li>
        </ul>

        <h3>4) Scoring</h3>
        <ul>
          <li>Correct answers award points; faster correct answers earn speed bonuses.</li>
          <li>No negative points for wrong answers.</li>
        </ul>

        <h3>5) Rooms & chat</h3>
        <ul>
          <li>Create a room to host. Share the room link or code to invite others.</li>
          <li>Host controls: start/end the game. Leaving may transfer host or close the room.</li>
          <li>Chat should not be used to share answers during active questions.</li>
        </ul>

        <h3>6) Fair play</h3>
        <ul>
          <li>No external help, no multi-accounting, and be respectful in chat.</li>
        </ul>

        <h3>7) Bonus features</h3>
        <ul>
          <li>Leaderboards, categories, themes, and configurable timers may be available.</li>
        </ul>

        <h3>8) Win condition</h3>
        <ul>
          <li>Highest total points after the last question wins. Ties broken by faster average response time.</li>
        </ul>

        <h3>9) Quick tips</h3>
        <ul>
          <li>Read questions quickly but carefully — speed helps but accuracy wins.</li>
          <li>Hosts: announce settings before starting.</li>
        </ul>
      </section>
    </div>
  )
}

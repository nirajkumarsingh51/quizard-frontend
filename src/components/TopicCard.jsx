import React from 'react'

export default function TopicCard({ topic }){
  return (
    <div className="p-4 bg-slate-800 rounded">
      <h4 className="text-indigo-300">{topic.title}</h4>
      <p className="text-sm text-slate-400">{topic.description}</p>
    </div>
  )
}

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Content = ({anecdote, points}) => {
  return (
    <div>
      <p>{anecdote}</p>
      <p>has {points} votes</p>
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
  console.log(points)

  const setNewRandom = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    console.log(randomIndex)
    setSelected(randomIndex)
  }

  const setVote = () => {
    const pointsCopy = [...points]
    pointsCopy[selected] += 1
    setPoints(pointsCopy)
    console.log(pointsCopy)
  }
  
  const findMaxValue = points.reduce((a, b) => Math.max(a, b))
  const maxIndex = points.indexOf(findMaxValue)
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Content anecdote={props.anecdotes[selected]} points={points[selected]}/> 
      <button onClick={setVote}>vote</button>
      <button onClick={setNewRandom} >next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <Content anecdote={props.anecdotes[maxIndex]} points={points[maxIndex]}/>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
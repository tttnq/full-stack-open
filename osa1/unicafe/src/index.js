import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const StatisticLine = (props) =>  <tr><td>{props.text} {props.value}</td></tr>
  
const Statistics = ({good, neutral, bad}) => {
  const all = good + bad + neutral;
  const avg = ((good - bad) / all)
  const positive = good / all * 100

  if (all === 0) {
    return 'No feedback given'
  }

  return (
    <table>
      <tbody>
        <StatisticLine text={'good'} value={good}/>
        <StatisticLine text={'neutral'} value={neutral}/>
        <StatisticLine text={'bad'} value={bad}/>
        <StatisticLine text={'all'} value={all}/>
        <StatisticLine text={'average'} value={avg}/>
        <StatisticLine text={'positive'} value={`${positive} %`}/>
      </tbody>
    </table>
  )
}

const Button = ({ handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good +1)} text={'good'}/>
      <Button handleClick={() => setNeutral(neutral + 1)} text={'neutral'}/>
      <Button handleClick={() => setBad(bad + 1)} text={'bad'}/>
      
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
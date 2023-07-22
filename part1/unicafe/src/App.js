import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value, opt_char = ""}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {opt_char}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  let count =  good + neutral + bad
  let average = (good - bad) / count
  let positive = (good / count) * 100

  if (count === 0) {
    return (
      <div> No feedback given </div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={count}/>
        <StatisticLine text="average" value={average}/>
        <StatisticLine text="positive" value={positive} opt_char="%"/>
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <h2> give feedback </h2>
      <Button handleClick={increaseGood} text="good" />
      <Button handleClick={increaseNeutral} text="neutral" />
      <Button handleClick={increaseBad} text="bad" />
      <h2> statistics </h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

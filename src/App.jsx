import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import TaskForm from './Home1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TaskForm/>
    </>
  )
}

export default App

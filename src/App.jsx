import { useState } from 'react'
import DragAndDropList from './components/DragAndDropList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 className='text-3xl font-bold underline'>Hello world!</h1>
        <DragAndDropList />
      </div>
    </>
  )
}

export default App

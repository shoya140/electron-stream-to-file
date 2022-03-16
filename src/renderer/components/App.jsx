import React from 'react'
import { useState } from 'react'

const { ipcRenderer } = window

var timer

export const App = () => {
  const [label, setLabel] = useState('')
  const [dataValue, setDataValue] = useState('0')
  const [isStreaming, setIsStreaming] = useState(false)

  const startStream = () => {
    const now = new Date()
    const timeString = now.toISOString().replace(/:/g, '-').replace(/\./g, '-')
    ipcRenderer.send('start-streaming', timeString)
    timer = setInterval(onDataReceived, 10)
    setIsStreaming(true)
  }

  const onDataReceived = () => {
    const timestamp = Date.now().toString()
    const data = Math.random().toString()
    setDataValue(data)
    ipcRenderer.send('write-stream', timestamp, data)
  }

  const stopStream = () => {
    clearInterval(timer)
    setIsStreaming(false)
  }

  const labelEvent = () => {
    const timestamp = Date.now().toString()
    ipcRenderer.send('write-label', timestamp, label)
    setLabel('')
  }

  const handleLabelChange = (event) => {
    setLabel(event.target.value)
  }

  return (
    <div className="container">
      <div className="content">
        <p>{dataValue}</p>
        <p>
          <button
            className="button"
            onClick={startStream}
            disabled={isStreaming}
          >
            Start Stream
          </button>
          <button
            className="button"
            onClick={stopStream}
            disabled={!isStreaming}
          >
            Stop Stream
          </button>
        </p>
        <p>
          <input
            value={label}
            onChange={handleLabelChange}
            disabled={!isStreaming}
          />
          <button
            className="button"
            onClick={labelEvent}
            disabled={!isStreaming}
          >
            Label Event
          </button>
        </p>
      </div>
    </div>
  )
}

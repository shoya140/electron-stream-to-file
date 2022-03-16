import '../../style/global.scss'

const { ipcRenderer } = window

var timer

document.querySelector('#start-button').onclick = () => {
  const now = new Date()
  const timeString = now.toISOString().replace(/:/g, '-').replace(/\./g, '-')
  ipcRenderer.send('start-streaming', timeString)
  timer = setInterval(onDataReceived, 10)
  document.querySelector('#start-button').disabled = true
  document.querySelector('#stop-button').disabled = false
  document.querySelector('#label-input').disabled = false
  document.querySelector('#label-button').disabled = false
}

const onDataReceived = () => {
  const timestamp = Date.now().toString()
  const data = Math.random().toString()
  document.querySelector('#value-label').innerHTML = data
  ipcRenderer.send('write-stream', timestamp, data)
}

document.querySelector('#stop-button').onclick = () => {
  clearInterval(timer)
  document.querySelector('#start-button').disabled = false
  document.querySelector('#stop-button').disabled = true
  document.querySelector('#label-input').disabled = true
  document.querySelector('#label-button').disabled = true
}

document.querySelector('#label-button').onclick = () => {
  const timestamp = Date.now().toString()
  const label = document.querySelector('#label-input').value
  ipcRenderer.send('write-label', timestamp, label)
  document.querySelector('#label-input').value = ''
}

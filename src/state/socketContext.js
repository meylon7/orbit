import sysIPAddress from '../../location'

let client

const wsCon = () => {
  client = new WebSocket('wss://' + sysIPAddress)
  return client
}

export default wsCon



   




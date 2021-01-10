import { Subject } from "rxjs";
let connect_status = true;
let error = false;
import sysIPAddress from '../../location'


let data;

export default function OnOpen(config) {
  
  let socket = new WebSocket("wss://" + sysIPAddress);    
  let connect_status = true;
  socket.onopen = (e) => {
    socket.onopen = socket.send(config);
    socket.onmessage = receive_function;
    console.log('socket open :');
    console.log(e);
    console.log(socket);
    //error = false;

  };
  function receive_function(event) {
    var obj = JSON.parse(event.data);
    console.log(event.data);
  }

  // socket.onclose = (e) => {
  //   console.log("socket close :");
  //   console.log(e);
  //   connect_status = false;
  // };

  // socket.onerror = (e) => {
  //   error = true;
  //   console.log("socket error :");
  //   console.log(e);
  // };
}

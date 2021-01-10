import React, { useState, useEffect, createContext, useMemo} from "react";
import {useHistory} from "react-router-dom";
import { useRoutes } from "hookrouter";
import sysIPAddress from "./location";
import useSessionstorage from "@rooks/use-sessionstorage";
import "./App.css";
import "antd/dist/antd.css";
import Login from "./components/login";
import Navbar from "./components/navbar";
import Topbar from "./components/topbar";
import InfoPanel from "./components/InfoPanel/Info";
import About from "./components/About";
import NotFound from "./components/notfound";
import Connectivity from "./components/Configuration/Connectivity";
import BUC from "./components/Configuration/BUC";
import CalibrationWizard from "./components/Maintenance/CalibrationWizard";
import Configuration from "./components/Maintenance/Configuration";
import SystemControl from "./components/Maintenance/SystemControl";
import SWUpdate from "./components/Maintenance/SWUpdate";
import LOGS from "./components/Maintenance/LOGS";
import Dashboard from "./components/Dashboard";
const MAIN_AREA = {
  flex: 1,
  overflow: "auto",
  padding: "10px",
  background: "#f7f8f9",
};
export const SocketContext = createContext();
const App = () => {

  const [token, setToken, removeToken] = useSessionstorage('token');
  const [socketInfo, setSocketInfo] = useState([]);
  const [unsaved, setUnsaved, removeUnsaved] = useSessionstorage('unsavedConfigChanges');
  const [satLockState, setSatLockState, removeLockState] = useSessionstorage('SatLockState');
  const history = useHistory();
  
  let ws;
  let config = {
    MessageName: "WS_SET_CONFIG",
    Parameters: [
      "BUC.TxOverTemp",
      "BUC.TxRefLock",
      "BUC.RflctPwrFault",
      "BUC.DrainVltFault",
      "BUC.LineFault",
      "BUC.LutOK",
      "PNC.Strk.azoff",
      "PNC.Strk.eloff",
      "PNC.Az.Motor.pos",
      "PNC.El.Motor.pos",
      "SYS.IsAntennaOK",
      "PNC.ErrorBits",
      "PNC.AntMode",
      "SYS.ManualEn",
      "MDM.IsConnected",
      "MDM.RxLocked",
      "MDM.TxEnable",
      "MDM.LastBEAMSucc",
      "BUC.IsOK",
      "BUC.Locked",
      "BUC.TxEnabled",
      "BUC.MuteSrc",
      "BUC.Power",
      "LNB.RxLo",
      "BUC.TxLo",
      "PNC.Dlnbr.RSSI",
      "BUC.TxPol",
      "INS.IsDataValid",
      "PNC.isGpsError",
      "PNC.Ypr.Lon",
      "PNC.Ypr.Lat",
      "PNC.Ypr.Yaw",
      "PNC.Ypr.Pth",
      "PNC.Ypr.Rll",
      "PNC.Ypr.Alt",
      "LNB.RxPol",
      "PNC.Sat.Lon",
      "PNC.Sat.Lat",
      "PNC.Sat.Alt",
      "BUC.TxPol",
      "LNB.RxPol",
      "PNC.Arinc.ypri.YawMsgCnt",
      "PNC.AzFdbkLLLN_360",
      "PNC.ElFdbkLLLN_360",
      "ARM.UTCTime",
      "BUC.MuteManualEn", //second panel in system control
      "BUC.IsExtMute",
      "SYS.ManualEn", //first panel in system control
      "PNC.Arinc.ypri.TrackAng",
      "PNC.Arinc.ypri.Drift",
      "SYS.StbyVersion",
    ],
    TimerPeriod: 200,
    Protocol: "JSON",
    Token: token,
  };
  const LogOutSys = () => {
    removeToken()
    window.location.replace('/');
  }
  function connect() {
    if (token !== null && token != undefined){
      ws = new WebSocket("wss://" + sysIPAddress);
      ws.onopen = () => {
        console.log('Socket is open.');
        ws.onopen = ws.send(JSON.stringify(config));
      };
    }
    
  }

  useEffect(() => {
    
    connect()
  
    setUnsaved(false)
    setSatLockState(false)
    return () => {
      ws.close();
      
    };
  }, []);


  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (e) => {
      let message = null;
       if (e.data !== undefined)
               message = JSON.parse(e.data)
      setSocketInfo(message);
       console.log(message)
    };
   

    ws.onclose = function (e) {
      console.log('Socket is closed. Attempting to reconnect...', e.reason);
      if (e.code == 1004 || e.code == 1006) {
        LogOutSys()

      } else {
        let timerId = setInterval(() => {
          if (ws) {
            clearInterval(timerId)
          }
          else {

            connect();
          }

        }, 1000);
      }

    };

    ws.onerror = function(err) {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      if(err.code === 1004 || err.code === 1006){
        console.log('ws error, err = ',err)
        window.onbeforeunload = () => {
          localStorage.removeItem('token');
        }

      }  

      ws.close();
  
    };
    return () => {
      ws.close();
    };
  }, [ws]);

  const routes = {
    "/": () => <Dashboard />,
    "/config": () => <Configuration />,
    "/about": () => <About />,
    "/calibration": () => <CalibrationWizard />,
    "/logs": () => <LOGS />,
    "/swupdate": () => <SWUpdate />,
    "/buc": () => <BUC />,
    "/connectivity": () => <Connectivity />,
    "/syscontrol": () => <SystemControl />,
  };
  const match = useRoutes(routes);
  return (
    <div className="gmail-page">
      {token ? (
        <>
          <SocketContext.Provider value={socketInfo}>
            <Topbar />
            <div className="page-content">
              <Navbar />

              <div style={MAIN_AREA}>
                {match || <NotFound />}
                
              </div>
              <InfoPanel />
            </div>
            <footer>
                  <p>
Copyright &#169; 2021 Orbit Communications System Ltd. All
                      Rights Reserved
                    
                  </p>
                </footer>
          </SocketContext.Provider>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;

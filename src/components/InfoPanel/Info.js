import React, { useContext, useEffect, useState } from "react";
import useSessionstorage from "@rooks/use-sessionstorage";

import { SocketContext } from '../../App'

const InfoPanel = () => {
  let antena, AntMode, ManualEn, IsConnected, TxEnable, MuteManualEn, Locked, TxEnabled, extMuteSrc, Power, SystemLocked
  let RxLo, TxLo, RSSI, TxPol, RxPol, RxLocked, AzFdbkLLLN_360, ElFdbkLLLN_360, Lon, sysAzimuth, sysElevation, bucExtMute, AccBucMute, AccBucMuteSrc, bucStatus, swBucMute,swBucMuteSrc, externalBucMute
  let YawMsgCnt = 'N/A'
  let prevYawMsgCnt = 'N/A'
  let prevYawCounter = 0
  let date = new Date()
  let nextYawCounter = 0
  let AntennaOKColor = 'black'
  let BUCIsOKColor = 'black'
  let BUCAutomaticColor = 'black'
  let AcuAutomaticColor = 'black'
  let BUCLockedColor = 'black'
  let SystemLockedColor = 'black'

  let MDMIsConnectedColor = 'black'
  let YawMsgCntColor = 'black'
  let TxEnableColor = 'black'
  let AccBucMuteColor = 'black'
  let RxLockedColor = 'black'

  const data = useContext(SocketContext)
  const [infoData, setInfoData] = useState([])
  useEffect(() => {
    setInfoData(data)
  }, [data])
  
  const checkData = () => {
    if (infoData["SYS.IsAntennaOK"] === undefined || infoData["SYS.IsAntennaOK"] === null) antena = 'N/A'
    else (antena = infoData["SYS.IsAntennaOK"] === false ? 'Failed' : 'OK')
    if(antena==='Failed') AntennaOKColor = 'red'
    else AntennaOKColor = 'black'
    
    if (infoData["BUC.IsOK"] === undefined || infoData["BUC.IsOK"] === null) bucStatus = 'N/A'
    else (bucStatus = infoData["BUC.IsOK"] === false ? 'Failed' : 'OK')
    if(bucStatus==='Failed') BUCIsOKColor = 'red'
    else BUCIsOKColor = 'black'
    
    AntMode = infoData["PNC.AntMode"] !== undefined && infoData["PNC.AntMode"] !== null ? infoData["PNC.AntMode"] : 'N/A'

   if (infoData["SYS.ManualEn"] === undefined || infoData["MDM.IsConnected"] === null) ManualEn = 'N/A'
   else ( ManualEn = infoData["SYS.ManualEn"] === false ? 'OpenAMIP' : 'Manual')
   if(ManualEn ==='Manual') AcuAutomaticColor = 'red'
   else AcuAutomaticColor = 'black'

    if (infoData["MDM.IsConnected"] === undefined || infoData["MDM.IsConnected"] === null) IsConnected = 'N/A'
   else (IsConnected = infoData["MDM.IsConnected"] === false ? 'Disconnected' : 'Connected' ) // IsConnected = 
    if(IsConnected === 'Disconnected' ) MDMIsConnectedColor = 'red'
    else MDMIsConnectedColor = 'black'
    
    RSSI = infoData["PNC.Dlnbr.RSSI"] !== undefined && infoData["PNC.Dlnbr.RSSI"] !== null ? parseFloat(infoData["PNC.Dlnbr.RSSI"]).toFixed(2) : 'N/A'
    

    if (infoData["BUC.MuteManualEn"] === undefined || infoData["BUC.MuteManualEn"] === null) MuteManualEn = 'N/A'
    else (MuteManualEn = infoData["BUC.MuteManualEn"] === false ? 'Auto' : 'Manual')
    if(MuteManualEn === 'Manual') BUCAutomaticColor = 'red'
    else BUCAutomaticColor = 'black'

    if (infoData["BUC.Locked"] === undefined || infoData["BUC.Locked"] === null) Locked = 'N/A'
    else (Locked = infoData["BUC.Locked"] === false ? 'Failed' : 'OK')
    if (Locked === 'Failed') BUCLockedColor = 'red'
    else BUCLockedColor = 'black'

    //////////////////////////////////////////BUC Mute and BUC Mute Source////////////////////////////////////////////////////////////////////////////

    AccBucMute = 'N/A'
    AccBucMuteSrc = ''
    swBucMuteSrc = ''

    if (infoData["BUC.TxEnabled"] === undefined || infoData["BUC.TxEnabled"] === null) swBucMute = 'N/A'
    else {
      swBucMute = !infoData["BUC.TxEnabled"]
      AccBucMute = swBucMute
      if (infoData["BUC.MuteManualEn"] !== undefined && infoData["BUC.MuteManualEn"] !== null) {
        if (infoData["BUC.MuteManualEn"] && swBucMute) swBucMuteSrc = 'Manual'
        else if (!infoData["BUC.MuteManualEn"] && swBucMute) swBucMuteSrc = 'OpenAmip'
        AccBucMuteSrc += swBucMuteSrc
      }
    }

    if (infoData["BUC.IsExtMute"] === undefined || infoData["BUC.IsExtMute"] === null) externalBucMute = 'N/A'
    else {
      externalBucMute = infoData["BUC.IsExtMute"]
      if (AccBucMute !== 'N/A') {
        AccBucMute = (swBucMute || externalBucMute) === true ? 'Mute' : 'Unmute'
      }
      else {
        AccBucMute = externalBucMute
      }
    }
    if (AccBucMute === 'Mute') AccBucMuteColor = 'red'
    else AccBucMuteColor = 'black'

    extMuteSrc = infoData["BUC.MuteSrc"] !== undefined && infoData["BUC.MuteSrc"] !== null ? infoData["BUC.MuteSrc"] : 'N/A'
    if (extMuteSrc !== 'N/A') {
      if (extMuteSrc > 0) {

        if ((extMuteSrc & 2) > 0) AccBucMuteSrc += 'Min El '
        if ((extMuteSrc & 32) > 0) AccBucMuteSrc += 'BlockZone'
        AccBucMuteSrc += ', '
      }
    }


    //////////////////////////////////////////End BUC Mute and BUC Mute Source////////////////////////////////////////////////////////////////////////////
    Power = infoData["BUC.Power"] !== undefined && infoData["BUC.Power"] !== null ? infoData["BUC.Power"] : 'N/A'

    RxLo = infoData["LNB.RxLo"] !== undefined && infoData["LNB.RxLo"] !== null ? infoData["LNB.RxLo"] : 'N/A'

    TxLo = infoData["BUC.TxLo"] !== undefined && infoData["BUC.TxLo"] !== null ? infoData["BUC.TxLo"] : 'N/A'

    if (infoData["MDM.TxEnable"] === undefined || infoData["MDM.TxEnable"] === null) TxEnable = 'N/A'
    else (TxEnable = infoData["MDM.TxEnable"] === false ? 'Disabled' : 'Enabled')
    if (TxEnable === 'Disabled') TxEnableColor = 'red'
    else TxEnableColor = 'black'

    if (infoData["MDM.RxLocked"] === undefined || infoData["MDM.RxLocked"] === null) RxLocked = 'N/A'
    else (RxLocked = infoData["MDM.RxLocked"] === false ? 'Unlocked' : 'Locked')
    if (RxLocked === 'Unlocked') RxLockedColor = 'red'
    else RxLockedColor = 'black'

    if ((AntMode === 'N/A') || (RxLocked === 'N/A') || (IsConnected === 'N/A') || (TxEnable === 'N/A') || (RSSI === 'N/A')) {
      SystemLocked = 'N/A'
    }
    else if ((infoData["PNC.AntMode"]).trim().includes("StabilizedSatelliteStepTrack") && (infoData["MDM.RxLocked"] === true) && (infoData["MDM.IsConnected"] === true) && (infoData["MDM.TxEnable"] === true) && (parseFloat(infoData["PNC.Dlnbr.RSSI"]) !== -100)) {
      SystemLocked = 'OK'
      SystemLockedColor = 'black'
    }
    else {
      SystemLocked = 'Failed'
      SystemLockedColor = 'red'
    }


    if (infoData["BUC.TxPol"] === undefined || infoData["BUC.TxPol"] === null) TxPol = 'N/A'
    else (TxPol = infoData["BUC.TxPol"] === 'R' ? 'RHCP' : 'LHCP')

    if (infoData["LNB.RxPol"] === undefined || infoData["LNB.RxPol"] === null) RxPol = 'N/A'
    else (RxPol = infoData["LNB.RxPol"] === 'R' ? 'RHCP' : 'LHCP')

    nextYawCounter = infoData["PNC.Arinc.ypri.YawMsgCnt"] !== undefined && infoData["PNC.Arinc.ypri.YawMsgCnt"] !== null ? infoData["PNC.Arinc.ypri.YawMsgCnt"] : 0
    
    if (prevYawCounter === nextYawCounter) {
      YawMsgCnt = 'Disconnected'
      YawMsgCntColor = 'red'
    }
    else {
      YawMsgCnt = 'Connected'
      YawMsgCntColor = 'black'
    }
    prevYawCounter = nextYawCounter
    if(((new Date()).getTime() - date.getTime())/1000 > 1){
      if ((prevYawCounter === nextYawCounter) && (nextYawCounter > 0)) {
        YawMsgCnt = "Disconnected"
        YawMsgCntColor = 'red'
      }
      else if ((prevYawCounter === nextYawCounter) && (nextYawCounter === 0)){
        YawMsgCnt = "N/A"

        YawMsgCntColor = 'black'
      }
      else {
        YawMsgCnt = "Connected"

        YawMsgCntColor = 'black'
      }
      prevYawCounter = nextYawCounter
      date = new Date()
    } 
    prevYawMsgCnt = YawMsgCnt      
    // YawMsgCnt = "Connected"

    YawMsgCntColor = 'black'
    AzFdbkLLLN_360 = infoData["PNC.AzFdbkLLLN_360"] !== undefined && infoData["PNC.AzFdbkLLLN_360"] !== null ? parseFloat(infoData["PNC.AzFdbkLLLN_360"]).toFixed(1) : 'N/A'

    ElFdbkLLLN_360 = infoData["PNC.ElFdbkLLLN_360"] !== undefined && infoData["PNC.ElFdbkLLLN_360"] !== null ? parseFloat(infoData["PNC.ElFdbkLLLN_360"]).toFixed(1) : 'N/A'

    Lon = infoData["PNC.Sat.Lon"] !== undefined && infoData["PNC.Sat.Lon"] !== null ? parseFloat(infoData["PNC.Sat.Lon"]).toFixed(1) : 'N/A'
    sysAzimuth = parseFloat(infoData["PNC.Az.Motor.pos"]).toFixed(1)
    sysElevation = parseFloat(infoData["PNC.El.Motor.pos"]).toFixed(1)
  }


  checkData()
  return (
    <div className="conversations-list">
      <ul className='info-panel'>
        <li className='list-group-item' style={{color: AntennaOKColor}}> <strong>Antenna: </strong>{antena}</li>
        <li className='list-group-item' title={AntMode}> <strong>Mode: </strong>{AntMode}</li>
        {/* <li className='list-group-item' style={{color: SystemLockedColor}}> <strong>System Locked: </strong>{SystemLocked}</li> */}
        <li className='list-group-item' style={{ color: AcuAutomaticColor }}> <strong>System Control: </strong>{ManualEn}</li>
        <li className='list-group-item'> <strong>Global Azimuth: </strong>{AzFdbkLLLN_360} [deg]</li>
        <li className='list-group-item'> <strong>Global Elevation: </strong>{ElFdbkLLLN_360} [deg]</li>
        <li className='list-group-item'> <strong>Satellite Lon: </strong>{Lon} [deg]</li>
        <li className='list-group-item'> <strong>TX Polarization: </strong>{TxPol}</li>
        <li className='list-group-item'> <strong>Tx LO: </strong>{TxLo} [GHz]</li>
        <li className='list-group-item' style={{ color: BUCAutomaticColor }}>  <strong>BUC Control: </strong>{MuteManualEn}</li>
        <li className='list-group-item' style={{color: BUCIsOKColor}} > <strong>BUC Status: </strong>{bucStatus}</li>
        <li className='list-group-item' style={{color: BUCLockedColor}}> <strong>BUC Locked:  </strong>{Locked}</li> {/*  BUC.Locked  = false -->  Unlocked, BUC.Locked  = true -->  Locked*/}
        <li className='list-group-item' style={{color: AccBucMuteColor}}> <strong>BUC: </strong>{AccBucMute}</li>
        <li className='list-group-item'> <strong>Mute Source: </strong>{AccBucMuteSrc}</li>
        <li className='list-group-item'> <strong>RX Polarization: </strong>{RxPol}</li>
        <li className='list-group-item'> <strong>Rx LO: </strong>{RxLo} [GHz]</li>
        <li className='list-group-item'> <strong>BUC Power: </strong>{Power} [dBm]</li>
        <li className='list-group-item'> <strong>SNR: </strong>{RSSI} [dB]</li>
        <li className='list-group-item' style={{color: MDMIsConnectedColor}}> <strong>Modem: </strong>{IsConnected}</li>
        <li className='list-group-item' style={{color: TxEnableColor}}> <strong>Modem Tx:  </strong>{TxEnable}</li> {/* MDM.TxEnable = false --> Tx Disabled, MDM.TxEnable = true --> Tx Enabled  */}
        <li className='list-group-item' style={{color: RxLockedColor}}> <strong>Modem Rx: </strong>{RxLocked}</li>
        <li className='list-group-item' style={{color: YawMsgCntColor}}> <strong>ARINC : </strong>{YawMsgCnt}</li>
        <li className='list-group-item'> <strong>System Azimuth: </strong>{sysAzimuth} [deg]</li>
        <li className='list-group-item'> <strong>System Elevation: </strong>{sysElevation} [deg]</li>
      </ul>
    </div>
  )
}

export default InfoPanel
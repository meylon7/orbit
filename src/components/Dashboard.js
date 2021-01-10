import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from '../App'
import { PageHeader, Card, Col, Row } from "antd";

let TxEnable, RxLocked, BucLocked
let  extMuteSrc, AccBucMute, AccBucMuteSrc, bucStatus, swBucMute, swBucMuteSrc, externalBucMute
let antena, AntMode, ManualEn, MDMIsConnected, MuteManualEn, Locked, MuteSrc, Power;
let RxLo, TxLo, RSSI, TxPol, RxPol, TxBand,AzFdbkLLLN_360, ElFdbkLLLN_360, Lon, sysAzimuth, MDMLastBEAMSucc,insData, gpsData
let YawMsgCnt = 'N/A'
let prevYawMsgCnt = 'N/A'
let prevYawCounter = 0
let date = new Date()
let nextYawCounter = 0
let AntennaOKColor = 'black'
let BUCIsOKColor = 'black'
let BUCLockedColor = 'black'
let MDMLastBEAMSuccColor = 'black'
let INSDataColor = 'black'
let GPSDataColor = 'black'

let MDMIsConnectedColor = 'black'
let YawMsgCntColor = 'black'
let TxEnableColor = 'black'
let AccBucMuteColor = 'black'
let RxLockedColor = 'black'



const Dashboard = () => {
  const data = useContext(SocketContext);
  const [infoData, setInfoData] = useState([]);
  useEffect(() => {
    setInfoData(data);
  }, [data]);
  const [showMore, setShowMore] = useState(false);
  const checkData = () => {


    if (infoData["SYS.IsAntennaOK"] === undefined || infoData["SYS.IsAntennaOK"] === null) antena = 'N/A'
    else (antena = infoData["SYS.IsAntennaOK"] === false ? 'Failed' : 'OK')
    if (antena === 'Failed') AntennaOKColor = 'red'
    else AntennaOKColor = 'black'

    if (infoData["BUC.IsOK"] === undefined || infoData["BUC.IsOK"] === null) bucStatus = 'N/A'
    else (bucStatus = infoData["BUC.IsOK"] === false ? 'Failed' : 'OK')
    if(bucStatus==='Failed') BUCIsOKColor = 'red'
    else BUCIsOKColor = 'black'
   
    if (infoData["MDM.TxEnable"] === undefined || infoData["MDM.TxEnable"] === null) TxEnable = 'N/A'
    else (TxEnable = infoData["MDM.TxEnable"] === false ? 'Disabled' : 'Enabled')
    if(TxEnable === 'Disabled') TxEnableColor = 'red' 
    else TxEnableColor = 'black'
   
    if (infoData["MDM.RxLocked"] === undefined || infoData["MDM.RxLocked"] === null) RxLocked = 'N/A'
    else (RxLocked = infoData["MDM.RxLocked"] === false ? 'Unlocked' : 'Locked')
     if(RxLocked === 'Unlocked') RxLockedColor = 'red'
     else RxLockedColor = 'black'
    
    if (infoData["BUC.Locked"] === undefined || infoData["BUC.Locked"] === null) BucLocked = 'N/A'
    else (BucLocked = infoData["BUC.Locked"] === false ? 'Failed' : 'OK')
    if(BucLocked==='Failed') BUCLockedColor = 'red'
    else BUCLockedColor = 'black'


    if(infoData["PNC.AntMode"] !== undefined && infoData["PNC.AntMode"] !== null) AntMode = infoData["PNC.AntMode"] 
    else AntMode= 'N/A'

    if (infoData["MDM.IsConnected"] === undefined || infoData["MDM.IsConnected"] === null) MDMIsConnected = 'N/A'
    else (MDMIsConnected = infoData["MDM.IsConnected"] === false ? 'Disconnected' : 'Connected')
    if (MDMIsConnected === 'Disconnected') MDMIsConnectedColor = 'red'
    else MDMIsConnectedColor = 'black'
   

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
    if(AccBucMute === 'Mute') AccBucMuteColor = 'red'
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

    if (TxLo === 'N/A') TxBand = 'N/A'
    else (TxBand = TxLo < 28.8 ? '29 - 30' : '30 - 31')

    if (infoData["MDM.TxEnable"] === undefined || infoData["MDM.TxEnable"] === null) TxEnable = 'N/A'
    else (TxEnable = infoData["MDM.TxEnable"] === false ? 'Disabled' : 'Enabled')

    RSSI = infoData["PNC.Dlnbr.RSSI"] !== undefined && infoData["PNC.Dlnbr.RSSI"] !== null ? parseFloat(infoData["PNC.Dlnbr.RSSI"]).toFixed(1) : 'N/A'

    if (infoData["BUC.TxPol"] === undefined || infoData["BUC.TxPol"] === null) TxPol = 'N/A'
    else (TxPol = infoData["BUC.TxPol"] === 'R' ? 'RHCP' : 'LHCP')

    if (infoData["MDM.LastBEAMSucc"]  === undefined || infoData["MDM.LastBEAMSucc"] === null) MDMLastBEAMSucc = 'N/A'
    else MDMLastBEAMSucc = infoData["MDM.LastBEAMSucc"] === false ? "Failed": 'OK'
    if(MDMLastBEAMSucc === 'Failed') MDMLastBEAMSuccColor = 'red'
    else MDMLastBEAMSuccColor = 'black'

    if (infoData["LNB.RxPol"] === undefined || infoData["LNB.RxPol"] === null) RxPol = 'N/A'
    else (RxPol = infoData["LNB.RxPol"] === 'R' ? 'RHCP' : 'LHCP')

    // YawMsgCnt = infoData["PNC.Arinc.ypri.YawMsgCnt"] !== undefined && infoData["PNC.Arinc.ypri.YawMsgCnt"] !== null ? infoData["PNC.Arinc.ypri.YawMsgCnt"] : 'N/A'

    AzFdbkLLLN_360 = infoData["PNC.AzFdbkLLLN_360"] !== undefined && infoData["PNC.AzFdbkLLLN_360"] !== null ? parseFloat(infoData["PNC.AzFdbkLLLN_360"]).toFixed(1) : 'N/A'

    ElFdbkLLLN_360 = infoData["PNC.ElFdbkLLLN_360"] !== undefined && infoData["PNC.ElFdbkLLLN_360"] !== null ? parseFloat(infoData["PNC.ElFdbkLLLN_360"]).toFixed(1) : 'N/A'

    Lon = infoData["PNC.Sat.Lon"] !== undefined && infoData["PNC.Sat.Lon"] !== null ? parseFloat(infoData["PNC.Sat.Lon"]).toFixed(1) : 'N/A'

    sysAzimuth = parseFloat(infoData["PNC.Az.Motor.pos"]).toFixed(1)

    if (infoData["INS.IsDataValid"] === undefined || infoData["INS.IsDataValid"] === null) insData = 'N/A'
    else insData = infoData["INS.IsDataValid"] === true ? 'OK' : 'Error'
if(insData === "OK") INSDataColor = 'black'
else if(insData === 'Error') INSDataColor = 'red'

    if (infoData["PNC.isGpsError"] === undefined || infoData["PNC.isGpsError"] === null) gpsData = 'N/A'
    else gpsData = infoData["PNC.isGpsError"] === true ? 'OK' : 'Error' 
    if(gpsData === "OK") GPSDataColor = 'black'
    else if(gpsData === 'Error') GPSDataColor = 'red'

    nextYawCounter = infoData["PNC.Arinc.ypri.YawMsgCnt"] !== undefined && infoData["PNC.Arinc.ypri.YawMsgCnt"] !== null ? infoData["PNC.Arinc.ypri.YawMsgCnt"] : 0
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


  }
  checkData()
  const toggle = () => {
    setShowMore(!showMore);
  };
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="System Health Status" />
      </div>
      <div className="content-wrapper space-align-container">
        <Row>
          <Col span={4}>
            <Card
              title="Antenna"
              style={{ width: "95%" }}>

              <p style={{color: AntennaOKColor}}><strong>Antenna Status: </strong>{antena}</p>
              <p  title={AntMode}><strong>Mode: </strong> {AntMode}</p>
              <p><strong>Azimuth: </strong> {parseFloat(infoData["PNC.AzFdbkLLLN_360"]).toFixed(1)} [deg]</p>
              <p><strong>Elevation: </strong> {parseFloat(infoData["PNC.ElFdbkLLLN_360"]).toFixed(1)} [deg]</p>

              {/* <p>Az: {AZ_ERR}</p>
              <p>El: {EL_ERR}</p>
              <p>Pol: {POL_ERR}</p>
              <p>NIP: {NIP}</p>
              <p>NOCAL: {NOCAL}</p>
              <p>MEM: {MEM_ERR}</p>
              <p>PWR: {PWR_ERR}</p>
              <p>CURRENT: {CURR_ERR}</p> */}
              {showMore ? <span>

              </span> : null}
            </Card>
          </Col>
          <Col span={4}>
            <Card
              title="Tx"
              style={{ width: "95%" }}>
              <p style={{color: BUCIsOKColor}}><strong>BUC Status: </strong>{bucStatus}</p>

              <p><strong>Tx Polarization: </strong> {TxPol}</p>
              <p><strong>Tx Band: </strong> {TxBand} [GHz] </p>
              <p><strong>Tx LO: </strong> {TxLo} [GHz]</p>
              <p style={{color: BUCLockedColor}}><strong>BUC Locked: </strong> {BucLocked}</p>
              <p style={{color: AccBucMuteColor}}><strong>BUC: </strong> {AccBucMute}</p>
              <p><strong>Mute source: </strong> {AccBucMuteSrc}</p>
              <p><strong>BUC Power: </strong> {Power} [dBm]</p>
              {showMore ? <span>
              </span> : null}
            </Card>
          </Col>
          <Col span={4}>
            <Card
              title="Rx"
              style={{ width: "95%" }}>
              <p><strong>SNR:</strong> {RSSI} [dB]</p>
              <p><strong>Rx Polarization:</strong> {RxPol}</p>
              <p><strong>Rx Band:</strong> 19.2 - 20.2 [GHz] </p>
              <p><strong>Rx LO:</strong> {infoData["LNB.RxLo"]} [GHz]</p>
              {showMore ? <span>
              </span> : null}
            </Card>
          </Col>
          <Col span={4}>
            <Card
              title="Modem"
              style={{ width: "95%" }}>
              <p style={{color: MDMIsConnectedColor}}><strong >Modem:</strong>  {MDMIsConnected}</p>  {/* MDM.IsConnected = false --> Disconnected, MDM.IsConnected = true --> Connected  */}
              <p style={{color: MDMLastBEAMSuccColor}}><strong>Modem Data:</strong> {MDMLastBEAMSucc}</p>
              <p style={{color: TxEnableColor}}><strong>Tx:</strong> {TxEnable}</p> {/* MDM.TxEnable = false --> Tx Disabled, MDM.TxEnable = true --> Tx Enabled  */}
              <p style={{color: RxLockedColor}}><strong>Rx:</strong> {RxLocked}</p> {/* MDM.RxLocked = false --> Rx Locked, MDM.RxLocked = true --> Rx Unlocked  */}
              {showMore ? <span>
              </span> : null}
            </Card>
          </Col>
          <Col span={4}>
            <Card
              title="INS/GPS"
              style={{ width: "95%" }}>
              <p style={{color: YawMsgCntColor}}><strong>ARINC:</strong> {prevYawMsgCnt}</p> {/*3 consecutive values of PNC.Arinc.ypri.YawMsgCnt are different then Connected */}
              <p style={{color: INSDataColor}}><strong>INS Data:</strong> {insData}</p>
              <p style={{color: GPSDataColor}}><strong>GPS Data:</strong> {gpsData}</p>
              <p><strong>Heading:</strong> {parseFloat(infoData["PNC.Ypr.Yaw"]).toFixed(1)} [deg]</p>
              <p><strong>Pitch:</strong> {parseFloat(infoData["PNC.Ypr.Pth"]).toFixed(1)} [deg]</p>
              <p><strong>Roll:</strong> {parseFloat(infoData["PNC.Ypr.Rll"]).toFixed(1)} [deg]</p>
              <p><strong>Lon:</strong> {parseFloat(infoData["PNC.Ypr.Lon"]).toFixed(1)} [deg]</p>
              <p><strong>Lat:</strong> {parseFloat(infoData["PNC.Ypr.Lat"]).toFixed(1)} [deg]</p>
              <p><strong>Alt:</strong> {parseFloat(infoData["PNC.Ypr.Alt"]).toFixed(1)} [m]</p>
              {showMore ? <span>
              </span> : null}
            </Card>
          </Col>
          <Col span={4}>
            <Card
              title="Satellite"
              style={{ width: "95%" }}>
              <p><strong>Lon:</strong> {parseFloat(infoData["PNC.Sat.Lon"]).toFixed(1)} [deg]</p>
              <p><strong>Lat:</strong> {parseFloat(infoData["PNC.Sat.Lat"]).toFixed(1)} [deg]</p>
              <p><strong>Alt:</strong> {infoData["PNC.Sat.Alt"]} [m]</p>
              {showMore ? <span>
              </span> : null}
            </Card>
          </Col>
          <Col span={4}></Col>
        </Row>
      </div>
    </>
  );
};
export default Dashboard;
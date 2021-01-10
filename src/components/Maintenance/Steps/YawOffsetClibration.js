import React, { useContext } from 'react'
import { WizardCtx } from '../../../state/WizardContext'
import { Input } from 'antd';
const YawOffsetClibration = () => {
    const {yaw, yawChanged} = useContext(WizardCtx)
    
    return (
        <div className="steps-content">
            <h1>Yaw Offset Calibration</h1>
            <br /><br />
            <h2>Please insert installation Yaw offset and press Next</h2>
            <div>
            <h3>Yaw offset is the angle between the aircraft INS heading direction</h3>
            <h3>and Antenna system mechanical sero azimuth position.</h3>
               </div>
            
            <div>
            <br /><br />
                <h2>Installation Yaw offset</h2> <Input placeholder="x.xxx" style={{ width: '20%' }} 
                value={yaw} onChange={yawChanged} /> [deg] {/* only number */}
            </div>
        </div>
    )
}
// on next - post {"MessageName": "HTMLFormUpdate","Parameters" : {" PNC.YawOffset": value }}
// after send get 1 sec after - {"MessageName": "HTMLFormUpdate","Parameters" : {" PNC.YawOffset" }} 
// then compare if get is the same as input value
//	If yes, Switch to the next Page. 
// If the values are not equal, alert the user with the message “Failed to apply Yaw offset” and stay on the same page.

export default YawOffsetClibration

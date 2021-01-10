import React, { useContext } from 'react'
import { WizardCtx } from '../../../state/WizardContext'
import { Input } from 'antd';


const CalculatedYawOffset = (props) => {
    const {yaw, yawChanged} = useContext(WizardCtx)
    return (
        <div className="steps-content">
            <h2>Calculated Yaw Offset</h2>
            <br /><br />
            <div>
            <br /><br />
            <label>{parseFloat(yaw).toFixed(2)} [deg]</label>
            </div>
        </div>
    )
}

export default CalculatedYawOffset

import React from 'react'
import { Input, message } from "antd";
import useSessionstorage from "@rooks/use-sessionstorage";
import BackImage from '../../pic/gps.png'


const CalculatedOffsets = () => {
    const [yaw] = useSessionstorage("yaw")
    const [finalElOffset, setFinalElOffset, removeElOffset] = useSessionstorage("finalElOffset");
  const [finalPitchOffset, setFinalPitchOffset, removePitchOffse] = useSessionstorage("finalPitchOffset");
  const [finalRollOffset, setFinalRollOffset, removeRollOffset] = useSessionstorage("finalRollOffset");  

    return (
        <div className="steps-content" style={{ width: '20%' }}>
            <h2>Calculating offsets, please wait...</h2>
            
        </div>
    )
}

export default CalculatedOffsets
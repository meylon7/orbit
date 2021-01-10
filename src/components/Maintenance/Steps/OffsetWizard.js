import React from 'react'
import BackImage from '../../pic/CalibrationWizard.png'
const OffsetWizard = (props) => {
    const StepImage = {
        backgroundImage: `url(${BackImage})`
    }
    
    return(
        <div className="steps-content" style={StepImage}>
            {/* on next - post {"MessageName": "HTMLFormUpdate","Parameters": {" SYS.ManualEn ": false }} */} {window.$step }
        </div>
    )
}

export default OffsetWizard

import React from 'react'

export const WizardCtx = React.createContext(null)
export const WizardCtxDefault = {
    currentStep: 0,
    currentStepChanged: ({target: {value}}) =>{

    },
    yaw:0,
    yawChanged: ({target: {value}}) =>{

    }
}
export const RollPitch0 = {
    StrkAzoff:0,
    MotorPosAz:0,
    StrkEloff:0,
    MotorPosEl:0
}
export const RollPitch90 = {
    StrkAzoff:0,
    MotorPosAz:0,
    StrkEloff:0,
    MotorPosEl:0
}
export const RollPitch180 = {
    StrkAzoff:0,
    MotorPosAz:0,
    StrkEloff:0,
    MotorPosEl:0
}
export const RollPitch270 = {
    StrkAzoff:0,
    MotorPosAz:0,
    StrkEloff:0,
    MotorPosEl:0
}
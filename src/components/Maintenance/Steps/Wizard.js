import React,{useState, createContext} from 'react'

export const YawContext = createContext(0)
export const StepsContext = createContext(0)

const WizardContext = ({children}) => {
    const [yaw,setYaw] = useState(0)
    const [currentStep,setCurrentStep] = useState(0)

    return(
        <StepsContext.Provider value={[currentStep,setCurrentStep]}>
            <YawContext value={[yaw,setYaw]}>
                {children}
            </YawContext>
        </StepsContext.Provider>
    )
}
 export default WizardContext


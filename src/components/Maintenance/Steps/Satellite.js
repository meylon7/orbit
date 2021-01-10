import React, { useEffect, useState } from 'react'
import BackImage from '../../pic/empty.png'
import { Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Satellite = ({ step, status }) => {
    const [toggleSNRCheck, setToggleSNRCheck] = useState("none");
    let info = 'In Process...'
    

    const StepImage = {
        backgroundImage: `url(${BackImage})`
    }
    function toggle() {
        if (step === 2) {
            setToggleSNRCheck(step === 2 ? "block" : "none");
        }
        console.log("Case ", step)
    }

    useEffect(() => {
        toggle()
    }, [])
    
    useEffect(() => {
        switch (status) {
            case 1:
                info = 'Calculating, please wait...'
                break
    
            case 2:
                info = 'Done'
                break
            default:
                info = ''
                break
        }
    }, [status])
    return (
        <>
            <div className="steps-content" style={StepImage}>
                <h2>Calculating offsets, please wait...</h2>
                <div>
                <h2>Press Next when done</h2>
                <br></br>
  
                    {/* {info} */}
                </div>
            </div>

        </>
    )
}


export default Satellite
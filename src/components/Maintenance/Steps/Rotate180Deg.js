import React, { useEffect, useState, useContext } from 'react'
import BackImage from '../../pic/IFC_180_deg.png'
import axios from "axios";
import sysIPAddress from '../../../location'
import useSessionstorage from "@rooks/use-sessionstorage";


const Rotate180Deg = () => {
const [token, setToken, removeToken] = useSessionstorage('token');
    const url = "https://" + sysIPAddress
    const [sysAzimuth, setSysAzimuth] = useState()
    const headers = {
        //'Access-Control-Origin': '*',
        'Content-Type': 'text/plain',
        Authorization: "Bearer " + token,
    };

    useEffect(() => {

        axios
            .get(url + "/api/param/get?Parameters=PNC.Az.Motor.pos", {
                headers
            }).then(res => {
                setSysAzimuth(parseFloat(res.data['PNC.Az.Motor.pos']).toFixed(1))
            })


    },)

    const StepImage = {
        backgroundImage: `url(${BackImage})`
    }

    return (
        <div className="steps-content" style={StepImage}>
              <h2>Please rotate the aircraft in the direction,</h2>
            <h2>that sets System Azimuth to 175 degrees.</h2>
            <h2>Press Next when done.</h2>
            <div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h3>Current System Azimuth: {sysAzimuth} [deg]</h3>
            </div>
        </div>
    )
}

export default Rotate180Deg

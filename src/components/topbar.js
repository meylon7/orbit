import React, { useRef, useContext,useEffect, useState } from "react";
import {SocketContext} from '../App'
import './style/topbar.css'
import logo from './pic/logo.png'
import sysIPAddress from '../location'
import useSessionstorage from "@rooks/use-sessionstorage";


import {LogoutOutlined, RedoOutlined, ApiTwoTone, SaveTwoTone } from '@ant-design/icons'
import {
    Tooltip,
    Button,
    message
  } from "antd";
import axios from "axios";

let messageCounter = 0;
let saveButtonColor = 'black'
const Topbar = () => {
        const data = useContext(SocketContext);
    const [token, setToken, removeToken] = useSessionstorage('token');
    const [user, setUser, removeUser] = useSessionstorage('user');
    const [unsaved, setUnsaved, removeUnsaved] = useSessionstorage('unsavedConfigChanges');
    const [infoData, setInfoData] = useState([]);
    const [showDisconnected, setShowDisconnected] = useState(false);
    
    const nameRef = useRef();
    useEffect(() => {
      setInfoData(data);
      setShowDisconnected(data === null? true:false)      
    }, [data],showDisconnected);
    useEffect(() => {
if(unsaved){
  saveButtonColor = 'red'
}
else{
  saveButtonColor = 'black'
}
    });

  function timeConverter(UNIX_timestamp) {
    let date
    if ((UNIX_timestamp !== null) && (UNIX_timestamp !== undefined)) {
      //UNIX_timestamp = 1606129442000;
      date = new Date(UNIX_timestamp);
      return date.toUTCString();
    }
    else return "Server disconnected..."

  }
    const LOGO = {
      height: "50px",
    };

    const saveToMemory = () => {
        const param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "PNC.SaveToFlash": true
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers: {
            Authorization: "Bearer " + token,
          },mode:'cors' })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            setUnsaved(false)
            message.success('success')
          })
          .catch((error) => {
            console.error(error);
          });
      };
    
  const resetAcuBuc = () => {
    if (window.confirm("You are about to reset Antenna. Are you sure?")) {

      saveToMemory()

      const param = {
        MessageName: "HTMLFormUpdate",
        Parameters: {
          "BUC.Reset": true
        },
      };
      axios
        .post("https://" + sysIPAddress + "/api/param/set", param, {
          headers: {
            Authorization: "Bearer " + token,
          }, mode: 'cors'
        })
        .then((response) => {
          console.log("Post", response.data.Parameters);
        })
        .catch((error) => {
          console.error(error);
        });
      const param1 = {
        MessageName: "HTMLFormUpdate",
        Parameters: {
          "SYS.Reset": true
        },
      };
      axios
        .post("https://" + sysIPAddress + "/api/param/set", param1, {
          headers: {
            Authorization: "Bearer " + token,
          }, mode: 'cors'
        })
        .then((response) => {
          console.log("Post", response.data.Parameters);
          message.success('success')
            removeToken('token')
            window.location.replace('/');
        })
        .catch((error) => {
          console.error(error);
        });
    }
        

  };


  const LogoutSystem = () => {
    let manualEnabled = []
    let resetACUToAuto = false
    let resetBUCToAuto = false
    axios
      .get("https://" + sysIPAddress + "/api/param/get?Parameters=SYS.ManualEn,BUC.MuteManualEn", {
        headers: {
          Authorization: "Bearer " + token,
        }, mode: 'cors'
      })
      .then((res) => {
        Object.keys(res).map(function (key) {
          if (!key.startsWith("Message")) {
            manualEnabled.push(res[key])
          }
        })
        console.log('manualEnabled = ', manualEnabled)
        if ((manualEnabled[0]['SYS.ManualEn'])) {
          if (window.confirm("The System is in manual mode. Switch to Automatic?")) {
            const param = {
              MessageName: "HTMLFormUpdate",
              Parameters: {
                "SYS.ManualEn": false
              },
            };
            axios
              .post("https://" + sysIPAddress + "/api/param/set", param, {
                headers: {
                  Authorization: "Bearer " + token,
                }, mode: 'cors'
              })
              .then((response) => {
                console.log("Post", response.data.Parameters);
                resetACUToAuto = true
              })
              .catch((error) => {
                console.error(error);
              });
          }else{

            resetACUToAuto = true
          }

        }else{
          resetACUToAuto = true
        }
        if ((manualEnabled[0]['BUC.MuteManualEn'])) {
          if (window.confirm("BUC is in manual mode. Switch to Automatic?")) {
            const param = {
              MessageName: "HTMLFormUpdate",
              Parameters: {
                "BUC.MuteManualEn": false
              },
            };
            axios
              .post("https://" + sysIPAddress + "/api/param/set", param, {
                headers: {
                  Authorization: "Bearer " + token,
                }, mode: 'cors'
              })
              .then((response) => {
                console.log("Post", response.data.Parameters);
                resetBUCToAuto = true
              })
              .catch((error) => {
                console.error(error);
              });
          }else{

            resetBUCToAuto = true
          }

        }
        resetBUCToAuto = true

      })


      saveToMemory()
    setTimeout(() => {
      if(resetBUCToAuto && resetACUToAuto){
        const PostValue = {
          UserName: user,
          Token: token,
        };
        //console.log("https://" + sysIPAddress + "/api/logout", PostValue,{headers})
        axios
          .post("https://" + sysIPAddress + "/api/logout", PostValue, {
            headers: {
              Authorization: "Bearer " + token,
            }, mode: 'cors'
          })
  
          .then((res) => {
            console.log("Post", res.data.Parameters);
            // sessionStorage.removeItem('token')
            // sessionStorage.removeItem('user')
            // removeToken('token')
            // removeUser('user')
            sessionStorage.clear();
            window.location.replace('/');
          })
          .catch((error) => {
            console.error(error);
            message.error("Logout failed")
          });
      }else{
        // message.error("Couldn't switch to automatic state. Please try again...")
        if (window.confirm("Couldn't switch to automatic state. Proceed to logout anyway?")) {
           const PostValue = {
          UserName: user,
          Token: token,
        };
        //console.log("https://" + sysIPAddress + "/api/logout", PostValue,{headers})
        axios
          .post("https://" + sysIPAddress + "/api/logout", PostValue, {
            headers: {
              Authorization: "Bearer " + token,
            }, mode: 'cors'
          })
  
          .then((res) => {
            console.log("Post", res.data.Parameters);
            // sessionStorage.removeItem('token')
            // sessionStorage.removeItem('user')
            removeToken('token')
            removeUser('user')
            window.location.replace('/');
            // window.location.reload(false);
            
          })
          .catch((error) => {
            console.error(error);
            // message.error("Logout failed")
          });

          // sessionStorage.removeItem('token')
          // sessionStorage.removeItem('user')
          removeToken('token')
          removeUser('user')
          window.location.replace('/');
          // window.location.reload(false);
          }

      }
      
    }, 7000);
      

  }
  const toggle = () => {
    setShowDisconnected(showDisconnected);
  };


    return (
        <>
        <div className="tab-bar">
            <div className="left">
                <div className="logo-wrapper">
                    <img src={logo} alt="orbit" style={LOGO} />
                </div>
                <div className="search-area">
                   <strong style={{color:'rgb(3, 79, 132)', fontSize: '20px'}}>MPT-46WGX</strong> 
                </div>
               
            </div>
            <div className="right">
            <span className="timer">{timeConverter(infoData["ARM.UTCTime"])} &nbsp;&nbsp;</span>
            { showDisconnected ? <span>
              
            <Tooltip title="Disconnected from Server..." trigger="hover">
                     <ApiTwoTone twoToneColor="#eb2f96"/>
            </Tooltip>

            </span> : null } 
            <Tooltip title="Save to memory" trigger="hover" >
                    <Button onClick={saveToMemory}> <SaveTwoTone  twoToneColor={saveButtonColor}/></Button>
            </Tooltip>

            <Tooltip title="Reset Antenna" trigger="hover">
                    <Button onClick={resetAcuBuc}><RedoOutlined /></Button>
            </Tooltip>
                
            <Tooltip title="Logout" trigger="hover"> 
                <Button onClick={LogoutSystem}>
                    <LogoutOutlined />
                </Button>
            </Tooltip>


                {/* <button>
                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3"
                            d="M7.00033 4.41675C4.92533 4.41675 3.66699 6.10008 3.66699 8.16675V13.1667H10.3337V8.16675C10.3337 6.10008 9.07533 4.41675 7.00033 4.41675Z"
                            fill="#909191" />
                        <path
                            d="M7.00016 17.3334C7.91683 17.3334 8.66683 16.5834 8.66683 15.6667H5.3335C5.3335 16.5834 6.0835 17.3334 7.00016 17.3334Z"
                            fill="#909191" />
                        <path fillRule="evenodd" clipRule="evenodd"
                            d="M12.0002 8.16671V12.3334L13.6668 14V14.8334H0.333496V14L2.00016 12.3334V8.16671C2.00016 5.60004 3.36683 3.46671 5.75016 2.90004V2.33337C5.75016 1.64171 6.3085 1.08337 7.00016 1.08337C7.69183 1.08337 8.25016 1.64171 8.25016 2.33337V2.90004C10.6418 3.46671 12.0002 5.60837 12.0002 8.16671ZM3.66683 13.1667H10.3335V8.16671C10.3335 6.10004 9.07516 4.41671 7.00016 4.41671C4.92516 4.41671 3.66683 6.10004 3.66683 8.16671V13.1667Z"
                            fill="#909191" />
                    </svg>
                </button> */}

            </div>
        </div>
        </>
    )
}

export default Topbar
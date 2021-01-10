import React, { useState, useEffect, useCallback } from "react";
import { WizardCtx, WizardCtxDefault, RollPitch0, RollPitch90, RollPitch180, RollPitch270 } from '../../state/WizardContext'
import { Steps, Button, message, Spin, Space } from "antd";
import axios from "axios";
import sysIPAddress from '../../location'
import useSessionstorage from "@rooks/use-sessionstorage";
import OffsetWizard from "./Steps/OffsetWizard";
import YawOffsetClibration from "./Steps/YawOffsetClibration";
import Satellite from "./Steps/Satellite";
import CalculatedYawOffset from "./Steps/CalculatedYawOffset";
import PitchRoll from "./Steps/PitchRoll";
import CalculatedOffsets from "./Steps/CalculatedOffsets";
import Rotate90Deg from "./Steps/Rotate90Deg";
import Rotate180Deg from "./Steps/Rotate180Deg";
import Rotate270Deg from "./Steps/Rotate270Deg";
import Finish from "./Steps/Finish";
import useAsyncState from "../../../src/hooks/useAsyncState"
import { AlignRightOutlined } from "@ant-design/icons";
import { result } from "lodash";
const { Step } = Steps;
let param
   let motorPosAz0 
  let motorPosEl0
  let strkAzoff0
  let strkEloff0
  let motorPosAz90
  let motorPosEl90
  let strkAzoff90
  let strkEloff90
  let motorPosAz180
  let motorPosEl180
  let strkAzoff180
  let strkEloff180
  let motorPosAz270
  let motorPosEl270
  let strkAzoff270
  let strkEloff270
  let satLon
  let systemLocked = false
  let getData = ['']
  let tempfinalElOffset
  let tempfinalPitchOffset
  let tempfinalRollOffset
  let tempYawOffset

export default function CalibrationWizard() {
  /////// Roll & Pitch area ////////
  const [postData, setPostData] = useState([])
  // const [getData, setGetData] = useState([])
  let getParam = ''
  const [SNRList, setSNRList] = useState([])

  const [finalElOffset, setFinalElOffset, removeElOffset] = useSessionstorage('finalElOffset');
  const [finalPitchOffset, setFinalPitchOffset, removePitchOffse] = useSessionstorage('finalPitchOffset');
  const [finalRollOffset, setFinalRollOffset, removeRollOffset] = useSessionstorage('finalRollOffset');

  const [inProcess, setInProcess] = useState(1)
  const [nextEnabled, setNextEnabled] = useState(true)

  const [unsavedConfigChanges, setUnsaved, removeConfigChanges] = useSessionstorage('unsavedConfigChanges');
  const [calibrationFinished, setCalibrationFinished, removeFinished] = useSessionstorage('calibrationFinished');

  const [currentSatLon, setCurrentSatLon] = useState()

  const url = "https://" + sysIPAddress

  let isSNRSteady = false
  /////// end /////////////////
  const [currentStep, setCurrentStep] = useState(0)
  const currentStepChanged = ({ target: { value } }) => {
    setCurrentStep(value)
  }
  const [yaw, setYaw, removeYaw] = useSessionstorage('finalYawOffset');
  const yawChanged = ({ target: { value } }) => {
    setYaw(value)
  }
 

   const [token, setToken, removeToken] = useSessionstorage('token');

  const headers = {
    //'Access-Control-Origin': '*',
    'Content-Type': 'text/plain',
    Authorization: "Bearer " + token,
  };

  let theStep
  const steps = [
    {
      title: "",
      content: <OffsetWizard />,
    },
    {
      title: "",
      content: <YawOffsetClibration />,
    },
    {
      title: "",
      content: <Satellite step={currentStep} status={inProcess} />,
    },
    {
      title: "",
      content: <CalculatedYawOffset />,
    },
    {
      title: "",
      content: <PitchRoll />,
    },
    {
      title: "",
      content: <Satellite />,
    },
    {
      title: "",
      content: <Rotate90Deg />,
    },
    {
      title: "",
      content: <Satellite />,
    },
    {
      title: "",
      content: <Rotate180Deg />,
    },
    {
      title: "",
      content: <Satellite />,
    },
    {
      title: "",
      content: <Rotate270Deg />,
    },
    {
      title: "",
      content: <Satellite />,
    },
    // {
    //   title: "",
    //   content: <CalculatedOffsets />,
    // },
    {
      title: "",
      content: <Finish />,
    },
  ];


  function next() {
    let x = 0
    setNextEnabled(true)

    // setShowSpin("block")
    // setShowNext("none")


    switch (currentStep) {

      case 0:
        satLon = ''
        console.log(new Date(), "Case 0 start, satLon = ", satLon)
        setCalibrationFinished(false)
        setNextEnabled(true)
        setYaw('')
        
        //message.success("Start step case 0")

        param = { "MessageName": "HTMLFormUpdate", "Parameters": { "MDM.StepTrackEnabled": true, "SYS.ManualEn": false, "BUC.MuteManualEn": false, "BUC.TxEnabled": true, "PNC.YawOffset": 0, "PNC.RllOffset": 0, "PNC.PthOffset": 0, "PNC.AntElOff": 0, "PNC.RF.AzStrkWidth": 0.2, "PNC.RF.ElStrkWidth": 0.2 } }
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
          .then((response) => {
            //message.success("System is set to OpenAMIP mode")

            console.log(new Date(),"Case 0, setting OpenAmip: ", response.data)
          })
          .catch((error) => {
            console.error('error in case 0: ', error);
          });
        //  setCurrentStep(12)
       setCurrentStep(currentStep + 1)
        break

      case 1:
        // message.success("Case 1")
        // setCurrentStep(0)
        console.log(new Date(),'Case 1, sending initial Yaw offset')
        if ((yaw === null) || (yaw === '') || (yaw === undefined)) {
          window.confirm("Please enter value for yaw offset")
          
        }else{
        setCurrentStep(currentStep + 1)

          param = { "MessageName": "HTMLFormUpdate", "Parameters": { "PNC.YawOffset": parseFloat(yaw) } }
          axios
            .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
            .then((response) => {
              axios
                .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.YawOffset", {
                  headers: {
                    Authorization: "Bearer " + token,
                  }, mode: 'cors'
                }).then(res => {
                  if (parseFloat(res.data["PNC.YawOffset"]) === parseFloat(yaw)) {
                    console.log(new Date(), 'Yaw offset set successfully')
                    setNextEnabled(false)
                    //Moshe TODO: add spiner

                    let steadyLockTimer = 0
                    let firstLockTime = new Date()
                    let startTryToLockTime = new Date()
                    console.log('startLockTryTime = ', startTryToLockTime)
                    let i = 0;
                    let interval = setInterval(() => {
                      let timeOut = ((new Date()).getTime() - startTryToLockTime.getTime()) / (1000 * 60)
                      console.log('timeOut = ', timeOut)
                      if ((timeOut > 10) && (!systemLocked)) {
                        clearInterval(interval)
                        console.log("Timeout is over, cannot lock = ")
                        window.confirm('The system cannot lock on satellite. Try a different yaw offset...')
                        goToWizardStart()
                      }
                      else if (steadyLockTimer > 0.5 && (systemLocked)) {
                        clearInterval(interval)
                        axios
                          .get(url + "/api/param/get?Parameters=PNC.Sat.Lon", {
                            headers
                          }).then(res => {
                            satLon = res.data['PNC.Sat.Lon']
                            console.log(new Date(), "System is locked on Satellite: ", satLon)
                            checkSNR()
                            setTimeout(() => {
                              if (isSNRSteady) {
                                console.log(new Date(), "SNR is steady, start calculatedYawOffset")
                                calculatedYawOffset()
                              }
                              else {
                                console.log(new Date(), "SNR is not steady")
                                window.confirm('The system cannot lock on satellite. Try different yaw offset')
                                console.log(new Date(), 'The system cannot lock on satellite. Try different yaw offset')
                                setCurrentStep(0)
                                setNextEnabled(true)
                              }
                            }, 20000);
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      }
                      else {
                        axios
                          .get(url + "/api/param/get?Parameters=PNC.AntMode,MDM.RxLocked,MDM.IsConnected,MDM.TxEnable,PNC.Dlnbr.RSSI", {
                            headers
                          }).then(res => {
                            if ((res.data["PNC.AntMode"] === "Stabilized Satellite StepTrack") && (res.data["MDM.RxLocked"] === true) && (res.data["MDM.IsConnected"] === true) && (res.data["MDM.TxEnable"] === true) && (res.data["MDM.TxEnable"] === true) && (parseFloat(res.data["PNC.Dlnbr.RSSI"]) != -100)) {
                              console.log(new Date(), "System is locked")
                              if(i===0)
                              {firstLockTime = new Date()}
                              systemLocked = true;
                              steadyLockTimer = ((new Date()).getTime() - firstLockTime.getTime()) / (1000 * 60)
                              console.log('steadyLockTimer = ', steadyLockTimer)

                            }
                            else {
                              console.log(new Date(), "System is not locked")
                              console.log('systemLocked = ', systemLocked)
                              systemLocked = false;
                              steadyLockTimer = 0
                              i = -1;
                              console.log('steadyLockTimer = ', steadyLockTimer)

                            }
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      }
                      i++;
                    }, 2000)

                  } else {
                    console.log(new Date(), "Couldn't set Yaw offset")
                    // setCurrentStep(0)
                  }
                }).catch((error) => {
                  message.warning(error)
                  console.error(error);
                });
            })
            .catch((error) => {
              message.warning(error)
              console.error(error);
            });
          setNextEnabled(true)
        }


        break

      case 2:
        console.log(new Date(),"Case 2")
        setCurrentStep(currentStep + 1)
        setInProcess(2)
        setNextEnabled(true)
        break

      case 3:
        console.log(new Date(),'Case 3, sending calculated Yaw offset')
        param = { "MessageName": "HTMLFormUpdate", "Parameters": { "PNC.YawOffset": parseFloat(yaw) } }
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
          .then((response) => {
            console.log(new Date(),response)
            axios
              .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.YawOffset", {
                headers: {
                  Authorization: "Bearer " + token,
                }, mode: 'cors'
              }).then(res => {
                if (parseFloat(res.data["PNC.YawOffset"]).toFixed(2) === parseFloat(yaw).toFixed(2)) {
                  console.log(new Date(), 'Set calculated yaw offset')
                  setCurrentStep(currentStep + 1)
                } else {
                  console.log(new Date(), "Couldn't set calculated offset")
                  setCurrentStep(0)
                  setNextEnabled(true)
                }
              }).catch((error) => {
                message.warning(error)
                console.error(new Date(), '.get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.YawOffset failed',error);
              });
          })
          .catch((error) => {
            message.warning(error)
            console.error(error);
          });
        setNextEnabled(true)
        break

      case 4:
        console.log(new Date(),"Case 4")
        setCurrentStep(currentStep + 1)
        setTimeout(() => {
          axios
            .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.AntMode,MDM.RxLocked,MDM.IsConnected,MDM.TxEnable,PNC.Sat.Lon", {
              headers: {
                Authorization: "Bearer " + token,
              }, mode: 'cors'
            }).then(res => {
              // if (true) {
                console.log(new Date(),"System is locked??? data: ", res.data)
                          console.log("satLon = ", satLon)

              if ((res.data["PNC.AntMode"] === "Stabilized Satellite StepTrack") && (res.data["MDM.RxLocked"] === true) && (res.data["MDM.IsConnected"] === true) && (res.data["MDM.TxEnable"] === true) && (res.data["PNC.Sat.Lon"] === satLon)) {

                checkSNR();
                setTimeout(() => {
                  if (isSNRSteady) {
                    console.log(new Date(),'SNR is OK, Calculating 0')
                    calculatedRolPitchOffset(0);
                  }else{
                              console.log(new Date(), "SNR is not steady")
                            }

                }, 15000);
              }
              else {
                message.error('The system cannot lock on satellite. Try different yaw offset')
                setCurrentStep(0)
                setNextEnabled(true)
              }
            }).catch((error) => {
              console.error(error);
            });
        }, 30000);
        setNextEnabled(false)

        break

      case 5:
        console.log(new Date(),"Case 5")
        setCurrentStep(currentStep + 1)
        setNextEnabled(true)
        break

      case 6:
        //message.success("Case 6")
        setCurrentStep(currentStep + 1)

        setTimeout(() => {
          axios
            .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.AntMode,MDM.RxLocked,MDM.IsConnected,MDM.TxEnable,PNC.Sat.Lon", {
              headers: {
                Authorization: "Bearer " + token,
              }, mode: 'cors'
            }).then(res => {
                          console.log("satLon = ", satLon)

              if ((res.data["PNC.AntMode"] === "Stabilized Satellite StepTrack") && (res.data["MDM.RxLocked"] === true) && (res.data["MDM.IsConnected"] === true) && (res.data["MDM.TxEnable"] === true) && (res.data["PNC.Sat.Lon"] === satLon)) {
                console.log(new Date(),"System is locked, data: ", res.data)
                checkSNR();
                setTimeout(() => {
                  if (isSNRSteady) {
                    console.log(new Date(),'SNR is OK, Calculating 90')
                    calculatedRolPitchOffset(90);
                  }else{
                     console.log(new Date(), "SNR is not steady")
                   }

                }, 21000);
              }
              else {
                message.error('The system cannot lock on satellite. Try different yaw offset')
                setCurrentStep(0)
                setNextEnabled(true)
              }
            }).catch((error) => {
              console.error(error);
            });
        }, 30000);
        setNextEnabled(false)

        break

      case 7:
        //message.success("Case 7")
        setCurrentStep(currentStep + 1)
        setNextEnabled(true)
        break

      case 8:
        //message.success("Case 8")
        setCurrentStep(currentStep + 1)
        setTimeout(() => {
          axios
            .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.AntMode,MDM.RxLocked,MDM.IsConnected,MDM.TxEnable,PNC.Sat.Lon", {
              headers: {
                Authorization: "Bearer " + token,
              }, mode: 'cors'
            }).then(res => {
                          console.log("satLon = ", satLon)

              if ((res.data["PNC.AntMode"] === "Stabilized Satellite StepTrack") && (res.data["MDM.RxLocked"] === true) && (res.data["MDM.IsConnected"] === true) && (res.data["MDM.TxEnable"] === true) && (res.data["PNC.Sat.Lon"] === satLon)) {
                 console.log(new Date(),"System is locked, data: ", res.data)

                checkSNR();
                setTimeout(() => {
                  if (isSNRSteady) {
                    console.log(new Date(),'SNR is OK, Calculating 180')
                    calculatedRolPitchOffset(180);
                  }else{
                     console.log(new Date(), "SNR is not steady")
                   }

                }, 21000);
              }
              else {
                message.error('The system cannot lock on satellite. Try different yaw offset')
                setCurrentStep(0)
                setNextEnabled(true)
              }
            }).catch((error) => {
              console.error(error);
            });
        }, 30000);
        setNextEnabled(false)
        break

      case 9:
        console.log("Case 9")
        setCurrentStep(currentStep + 1)
        setNextEnabled(true)
        break

      case 10:

        setCurrentStep(currentStep + 1)
        setTimeout(() => {
          axios
            .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.AntMode,MDM.RxLocked,MDM.IsConnected,MDM.TxEnable,PNC.Sat.Lon", {
              headers: {
                Authorization: "Bearer " + token,
              }, mode: 'cors'
            }).then(res => {
                          console.log("satLon = ", satLon)

              if ((res.data["PNC.AntMode"] === "Stabilized Satellite StepTrack") && (res.data["MDM.RxLocked"] === true) && (res.data["MDM.IsConnected"] === true) && (res.data["MDM.TxEnable"] === true) && (res.data["PNC.Sat.Lon"] === satLon)) {
                 console.log(new Date(),"System is locked, data: ", res.data)

                checkSNR();
                setTimeout(() => {
                  if (isSNRSteady) {
                    console.log(new Date(),'SNR is OK, Calculating 180')
                    calculatedRolPitchOffset(270);
                  }else{
                     console.log(new Date(), "SNR is not steady")
                   }

                }, 21000);
              }
              else {
                message.error('The system cannot lock on satellite. Try different yaw offset')
                setCurrentStep(0)
                setNextEnabled(true)
              }
            }).catch((error) => {
              console.error(error);
            });
        }, 30000);
        setNextEnabled(false)
        break

      case 11:
        // message.success("Case 11")
    setFinalElOffset(tempfinalElOffset)
    setFinalPitchOffset(tempfinalPitchOffset)
    setFinalRollOffset(tempfinalRollOffset)
    setYaw(yaw + tempYawOffset)

        setCurrentStep(12)
        setNextEnabled(true)
        break
     
     
      default:
        return
    }
  }

  const postAxios = (param) => {
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        postData.push(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const getAxios = (getParam) => {
    return axios
      .get(url + `/api/param/get?Parameters=${getParam}`, {
        headers
      }).then(response => {
        if (response.status === 204) {
          let warningMsg = response.statusText
          console.warn(warningMsg)
          return
        } else if (response.status === 404 || response.status === 400) {
          let errorMsg = response.statusText // + ": "  + response.data.msg // this is my api
          console.error(errorMsg)
          return;
        } else {
          let data = response.data
          let dataType = (typeof data)
          if (dataType === 'undefined') {
            let msg = 'unexpected error occurred while fetching data !!!'
            // pass here to the ui change method the msg aka
            // showMyMsg ( msg , "error")
          } else {
            let arrayData = []
            Object.keys(data).map(function (key) {
              if (!key.startsWith("Message")) {
                arrayData.push(data[key])
              }
            })
            getData.push(data)
            console.log(new Date(),'getAxios finished successfully, getData = ', getData)

          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const checkIfSystemLocked = () => {
    let param = "PNC.AntMode,MDM.RxLocked,MDM.IsConnected,MDM.TxEnable,PNC.Sat.Lon"
    getAxios(param)
    console.log(new Date(),'getData = ', getData[0])
    let i = 0
    let result = false;

    let interval = setInterval(() => {
      if ((i > 3) || ((getData != null && getData != undefined))) {
        clearInterval(interval)
        console.log("System is Locked, systemLocked = ", systemLocked)
      }
      else {
        if (getData != null && getData != undefined) {
          console.log(new Date(),"dataItems response in checkIfSystemLocked: ", getData)
                          console.log("satLon = ", satLon)

          if ((getData["PNC.AntMode"] === "Stabilized Satellite StepTrack") && (getData["MDM.RxLocked"] === true) && (getData["MDM.IsConnected"] === true) && (getData["MDM.TxEnable"] === true) && (getData["PNC.Sat.Lon"] === satLon)) {
          
            console.log(new Date(),"System is locked")
            systemLocked = true;
            i = 50
          }else{
            console.log(new Date(), "System can't lock, getData = ",getData.data)
          }

        } else {
          console.log(new Date(),"getData is null or undefined")
        }
      }
      i++
    }, 1000)

  }

  const checkSNR = () => {
           console.log(new Date(), "Starting checkSNR")

    let i = 0
    let result = false
    isSNRSteady = result

    let interval = setInterval(() => {
      if (i > 10) {
        console.log("finished iterval, i = ",i)
        console.log("result = ",result)
        clearInterval(interval)
        if (result) {
          console.log(new Date(),'SNRList before sort', SNRList)
          SNRList.sort()
          console.log(new Date(),'SNRList after sort', SNRList)
          console.log(new Date(),'result=', result)

          let diffMinMax = Math.abs(SNRList[SNRList.length - 1] - SNRList[0])
          if (diffMinMax <= 1) {
            isSNRSteady = true
            console.log(new Date(),'isSNRSteady',isSNRSteady)
            console.log(new Date(),'SNR is steady')
            
          }
          else {
             isSNRSteady = false
            console.log(new Date(),'SNR is unstable')
          }
        }
         else {
             isSNRSteady = false
            console.log(new Date(),'SNR is unstable')
          }
      }
      else {
        console.log(new Date(),'checkSNR, i=', i)
        axios
          .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.Dlnbr.RSSI", {
            headers: {
              Authorization: "Bearer " + token,
            }, mode: 'cors'
          }).then(res => {
            let newItem = res.data["PNC.Dlnbr.RSSI"]
            if ((newItem !== 'null') && (parseFloat(newItem) !== -100)) {
              console.log(new Date(),"adding new item to SNRList", newItem)
              result = true
              SNRList.push(parseFloat(newItem))
            }
            else {
              // result = true
              result = false
              i = 50
            }
          }).catch((error) => {
            console.error('error in checkSNR', error);
          });
      }
      i++
    }, 1000)
  }

  const calculatedRolPitchOffset = (rotate) => {
    console.log(new Date(),'Starting calculatedRolPitchOffset, System azimuth=', rotate)

    let x = 1
    let StrkAzoffAgreegate = 0;
    let StrkAzoffCount = 0;

    let MotorPosAzAgreegate = 0;
    let MotorPosAzCount = 0;

    let StrkEloffAgreegate = 0;
    let StrkEloffCount = 0;

    let MotorPosElAgreegate = 0;
    let MotorPosElCount = 0;

    let interval = setInterval(() => {
      if (x > 10) {
        clearInterval(interval)
        let res = StrkAzoffCount * MotorPosAzCount * StrkEloffCount * MotorPosElCount
        if (res === 0) {
          setCurrentStep(0)
          setNextEnabled(true)
          message.warning("Could't receive any offset data from Antenna. Please start over...")
        }
        
        else {
          console.log(new Date(),"Calculating:")
          console.log(new Date(),"MotorPosAzAgreegate / MotorPosAzCount", MotorPosAzAgreegate, MotorPosAzCount)
          console.log(new Date(),"MotorPosElAgreegate / MotorPosElCount", MotorPosElAgreegate, MotorPosElCount)
          console.log(new Date(),"StrkAzoffAgreegate / StrkAzoffCount", StrkAzoffAgreegate, StrkAzoffCount)
          console.log(new Date(),"StrkEloffAgreegate / StrkEloffCount", StrkEloffAgreegate, StrkEloffCount)

          let temp1 = MotorPosAzAgreegate / MotorPosAzCount
            let temp2 = MotorPosElAgreegate / MotorPosElCount
            let temp3 = StrkAzoffAgreegate / StrkAzoffCount
            let temp4 = StrkEloffAgreegate / StrkEloffCount
          
           

            if (rotate === 0) {
 
            motorPosAz0 = temp1
            motorPosEl0 = temp2
            strkAzoff0 = temp3
            strkEloff0 = temp4
             console.log(new Date(),'MotorPosAz0 = ', motorPosAz0)
            console.log(new Date(),'MotorPosEl0 = ', motorPosEl0)
            console.log(new Date(),'StrkAzoff0 = ', strkAzoff0)
            console.log(new Date(),'StrkEloff0 = ', strkEloff0)
          }
          if (rotate === 90) {
            

            motorPosAz90 = temp1
            motorPosEl90 = temp2
            strkAzoff90 = temp3
            strkEloff90 = temp4 
            console.log(new Date(),'MotorPosAz90 = ', motorPosAz90)
            console.log(new Date(),'motorPosEl90 = ', motorPosEl90)
            console.log(new Date(),'StrkAzoff90 = ', strkAzoff90)
            console.log(new Date(),'StrkEloff90 = ', strkEloff90)
          }
          if (rotate === 180) {

            motorPosAz180 = temp1
            motorPosEl180 = temp2
            strkAzoff180 = temp3
            strkEloff180 = temp4

            console.log(new Date(),'MotorPosAz180 = ', motorPosAz180)
            console.log(new Date(),'motorPosEl180 = ', motorPosEl180)
            console.log(new Date(),'StrkAzoff180 = ', strkAzoff180)
            console.log(new Date(),'StrkEloff180 = ', strkEloff180)
          }
          if (rotate === 270) {
            
            motorPosAz270 = temp1
            motorPosEl270 = temp2
            strkAzoff270 = temp3
            strkEloff270 = temp4

            console.log(new Date(),'MotorPosAz270 = ', motorPosAz270)
            console.log(new Date(),'motorPosEl270 = ', motorPosEl270)
            console.log(new Date(),'StrkAzoff270 = ', strkAzoff270)
            console.log(new Date(),'StrkEloff270 = ', strkEloff270)
           
            calculateFinalOffsets()

          }
        }
        setNextEnabled(true)
      } else {
        console.log(new Date(),"setInterval start, x=", x)
        axios
          .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.Strk.azoff,PNC.Az.Motor.pos,PNC.El.Motor.pos,PNC.Strk.eloff", {

            headers: {
              Authorization: "Bearer " + token,
            }, mode: 'cors'
          }).then(res => {

            if (res.data["PNC.Strk.azoff"] !== 'null') {
              StrkAzoffAgreegate += parseFloat(res.data["PNC.Strk.azoff"])
              StrkAzoffCount++
            }
            if (res.data["PNC.Az.Motor.pos"] !== 'null') {
              MotorPosAzAgreegate += parseFloat(res.data["PNC.Az.Motor.pos"])
              MotorPosAzCount++
            }
            if (res.data["PNC.Strk.eloff"] !== 'null') {
              StrkEloffAgreegate += parseFloat(res.data["PNC.Strk.eloff"])
              StrkEloffCount++
            }
            if (res.data["PNC.El.Motor.pos"] !== 'null') {
              MotorPosElAgreegate += parseFloat(res.data["PNC.El.Motor.pos"])
              MotorPosElCount++
            }
          }).catch((error) => {
            console.error("error in calculatedRolPitchOffset interval", error);
          });
      }
      x++

    }, 1000)
  };
  const calculateFinalOffsets = () => {
    
    console.log(new Date(),'Starting calculateFinalOffsets')

    let i = 0
    let result = false

    console.log("tempFinalElOffset = 0.25*(strkEloff0 + strkEloff90 + strkEloff180 + strkEloff270)", strkEloff0,strkEloff90,strkEloff180,strkEloff270)
    tempfinalElOffset = -0.25 * parseFloat((strkEloff0 + strkEloff90 + strkEloff180 + strkEloff270))
    setFinalElOffset(tempfinalElOffset)
    console.log(new Date(),"tempfinalElOffset = ", tempfinalElOffset)
    console.log(new Date(),"finalElOffset = ", finalElOffset)

    tempfinalPitchOffset = 0.5 * parseFloat((strkEloff0 - strkEloff180))
    setFinalPitchOffset(tempfinalPitchOffset)
    console.log(new Date(),"tempfinalPitchOffset = ", tempfinalPitchOffset)
    console.log(new Date(),"finalPitchOffset = ", finalPitchOffset)

    tempfinalRollOffset = 0.5 * parseFloat((strkEloff270 - strkEloff90))
    setFinalRollOffset(tempfinalRollOffset)
    console.log(new Date(),"tempfinalRollOffset = ", tempfinalRollOffset)
    console.log(new Date(),"finalRollOffset = ", finalRollOffset)

    tempYawOffset = -0.25 * parseFloat(((strkAzoff0 + strkAzoff90 + strkAzoff180 + strkAzoff270)) / Math.cos(motorPosEl270 * Math.PI / 180))
    setYaw(yaw + tempYawOffset)
    console.log(new Date(),"tempYawOffset = ", tempYawOffset)
    console.log(new Date(),"finalYawOffset = ", yaw)


    if (tempfinalElOffset === 'null' || tempfinalElOffset === undefined || tempfinalPitchOffset === 'null' || tempfinalPitchOffset === undefined || tempfinalRollOffset === 'null' || tempfinalRollOffset === undefined) {
      console.log(new Date(),"Couldn't calculate offsets. Please start over")
      setCurrentStep(0)
      setNextEnabled(true)
      let userMessage = "Couldn't calculate offsets. Please start over"
      goToWizardStart(userMessage)
    }
    else {
      let finalParams = { "MessageName": "HTMLFormUpdate", "Parameters": { "PNC.YawOffset": parseFloat(yaw), "PNC.AntElOff": parseFloat(tempfinalElOffset), "PNC.PthOffset": parseFloat(tempfinalPitchOffset), "PNC.RllOffset": parseFloat(tempfinalRollOffset), "PNC.RF.AzStrkWidth": 0.1, "PNC.RF.ElStrkWidth": 0.1 } }
       axios
        .post("https://" + sysIPAddress + "/api/param/set", finalParams, {
          headers: {
            Authorization: "Bearer " + token,
          }, mode: 'cors'
        })
        .then((response) => {
          console.log(new Date(),"Post final offsets", response.data);
          checkStrkOffsets()
       
          message.success('success')
        })
        .catch((error) => {
          console.error(error);
        });
    }

  };


  const checkStrkOffsets = () => {
    console.log(new Date(),'Starting checkStrkOffsets')

    let i = 0
    let result = false
    let strkAzOffset = 1
    let strkElOffset = 1
    let interval = setInterval(() => {
      if (i > 10) {
        clearInterval(interval)
        if (result) {
          message.success('Calibration finished successfully')
          console.log(new Date(),'Calibration finished successfully')
          saveToMemory()
          setUnsaved(false)
          setCalibrationFinished(true)
        } else {
          message.success('Calibration failed')
          console.log(new Date(),'Calibration failed')
        }
      }
      else {
        axios
          .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.Strk.azoff,PNC.Strk.eloff", {

            headers: {
              Authorization: "Bearer " + token,
            }, mode: 'cors'
          }).then(res => {
            if ((res.data["PNC.Strk.azoff"] !== 'null') && (res.data["PNC.Strk.eloff"] !== 'null')) {
              strkAzOffset = parseFloat(res.data["PNC.Strk.azoff"])
              strkElOffset = parseFloat(res.data["PNC.Strk.eloff"])
              console.log(new Date(),"Case 10 strkAzOffset = ", strkAzOffset)
              console.log(new Date(),"Case 10 strkElOffset = ", strkElOffset)
              if ((Math.abs(strkAzOffset) < 0.5) && (Math.abs(strkElOffset) < 0.5)) {
                result = true
              }
              else {
                i = 11
                result = false
                setCurrentStep(0)
              }
            }
          }).catch((error) => {
            console.error(error);

          });
      }
      i++
    }, 1000)
    setNextEnabled(true)

  }

  const goToWizardStart = (userMessage) => {
    if (window.confirm(userMessage)) {
      setCalibrationFinished(true)
      setCurrentStep(0)
      setNextEnabled(true)
      setYaw(0)
      satLon = '';
      console.log(new Date(),"goToWizardStart, yaw = ", yaw)
      console.log(new Date(),"Start step case 0")

      param = { "MessageName": "HTMLFormUpdate", "Parameters": { "PNC.YawOffset": 0, "PNC.RllOffset": 0, "PNC.PthOffset": 0, "PNC.AntElOff": 0, "PNC.RF.AzStrkWidth": 0.1, "PNC.RF.ElStrkWidth": 0.1 } }
      let response = postAxios(param)
      axios
        .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
        .then((response) => {
          message.success("Wizard is cancelled")
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const calculatedYawOffset = () => {
    console.log(new Date(),'Starting calculatedYawOffset')
    console.log(new Date(),"inside calculatedYawOffset: isSNRSteady = ", isSNRSteady)

    let x = 1
    let azoffAgreegate = 0;
    let posAgreegate = 0;
    let azoffCount = 0;
    let posCount = 0;
    let interval = setInterval(() => {
      if (x > 10) {
        clearInterval(interval)
        let avStrOffset = azoffAgreegate / azoffCount;
        let avElMotPos = posAgreegate / posCount;
        let yawOffset = -1 * parseFloat(avStrOffset / Math.cos(avElMotPos * Math.PI / 180))
        let tempYaw = parseFloat(yaw) + yawOffset
        console.log(new Date(),'calculated yaw = ', tempYaw)
        setYaw(tempYaw)
        setNextEnabled(true)
      } else {
        axios
          .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.Strk.azoff,PNC.El.Motor.pos", {
            headers: {
              Authorization: "Bearer " + token,
            }, mode: 'cors'
          }).then(res => {
            if (res.data["PNC.Strk.azoff"] !== 'null') {
              azoffAgreegate += parseFloat(res.data["PNC.Strk.azoff"])
              azoffCount++
            }
            if (res.data["PNC.El.Motor.pos"] !== 'null') {
              posAgreegate += parseFloat(res.data["PNC.El.Motor.pos"])
              posCount++
            }


          }).catch((error) => {
            setCurrentStep(0)
            console.error(error);
          });
      }
      x++

    }, 2000)

  };



  const saveToMemory = () => {
    console.log(new Date(),'Starting saveToMemory')

    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "PNC.SaveToFlash": true
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, {
        headers: {
          Authorization: "Bearer " + token,
        }, mode: 'cors'
      })
      .then((response) => {
        console.log(new Date(),"Post", response.data.Parameters);
        setUnsaved(false)
        //message.success('success')
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1)
    //console.log(new Date(),"Current step: ", currentStep)
  };


  return (
    <>
      <WizardCtx.Provider value={{ currentStep, currentStepChanged, yaw, yawChanged }}>
        <Steps current={currentStep}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        {steps[currentStep].content}
        <div className="steps-action">
          {currentStep < steps.length - 1 && (
            <Button disabled={!nextEnabled} shape="round" type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              shape="round"
              type="primary"
              style={{ float:"right"}}
              onClick={() => {
                console.log(new Date(),"Processing complete!")
                setCurrentStep(0)
                next()}}
            >
              Done
            </Button>
          )}
          {(currentStep > 0 && (currentStep < 12)) && (
            <Button
              shape="round"
              style={{ margin: "0 8px" , float:"right"}}
              onClick={() => goToWizardStart("You are about to abort calibration process. Are you sure?")}
            >
              Cancel
            </Button>
          )}

        </div>
      </WizardCtx.Provider>
    </>
  );


};

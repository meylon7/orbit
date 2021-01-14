import React, { useState, useContext, useEffect, useRef } from "react";
import useSessionstorage from "@rooks/use-sessionstorage";
import sysIPAddress from '../../location'
import Modal from "../modal";
import { Accordion, AccordionItem } from "react-sanfona";
import {ToolOutlined} from '@ant-design/icons'
import {
  PageHeader,
  Col,
  Button,
  Row,
  InputNumber,
  message,
  Select,
  Divider,
  Switch,
} from "antd";
import axios from "axios";
import { SocketContext } from "../../App";
const SystemControl = () => {
  //////////////////////////////////////
  const [token] = useSessionstorage("token");
  //const data = useContext(SocketContext);
  //const [infoData, setInfoData] = useState([]);
  let acuAutomatic = true
  let bucAutomatic = true
  const [automatic, setAutomatic] = useState(true);
  const [manual, setManual] = useState(false);
  const [mode, setMode] = useState();
  const [stepTrack, setStepTrack] = useState();
  const stepLength = useRef(0.1);
  const [azimuth, setAzimuth] = useState();
  const [elevation, setElevation] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [altitude, setAltitude] = useState();
  const [txBand, setTxBand] = useState();
  const [rxBand, setRxBand] = useState();
  const [txLO, setTxLO] = useState();
  const [rxLO, setRxLO] = useState();
  const [showAzimuth, setShowAzimuth] = useState("block");
  const [showLongLat, setShowLongLat] = useState("none");
  const [showPolarization, setShowPolarization] = useState("block");
  const [applyStatus, setApplyStatus] = useState("point");
  const [step, setStep] = useState(null);
  const [currentStepVal, setCurrentStepVal] = useState(0.1);
  const [TxPol, setTxPol] = useState();
  const [RxPol, setRxPol] = useState();
  const [automaticBUC, setAutomaticBUC] = useState(true);
  const [manualBUC, setmanualBUC] = useState(false);
  const [bucTxEnabled, setBucTxEnabled] = useState(false);
  const { Option } = Select;
  const selectmode = useRef('')
  var syscontroldata = []
  var modeVal
  const headers = {
    //'Access-Control-Origin': '*',
    'Content-Type': 'text/plain',
    Authorization: "Bearer " + token,
  };

  //////////////////////////////////////
  useEffect(() => {
    LoadSystemControl()
  }, []);

  useEffect(()=>{
    getManualMute()
  },[bucTxEnabled])
  const LoadSystemControl = () => {

    axios.get("https://" + sysIPAddress + "/api/param/get?Parameters=SYS.ManualEn,MDM.StepTrackEnabled,PNC.AntMode,PNC.RF.BitRevertMode,PNC.Sat.Lon,PNC.Sat.Lat,PNC.Sat.Alt,PNC.AzFdbkLLLN_360,PNC.ElFdbkLLLN_360,BUC.TxPol,LNB.RxPol,BUC.TxLo,LNB.RxLo,BUC.MuteManualEn,BUC.TxEnabled", {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: "Bearer " + token,
      }, mode: 'cors'
    })
      .then((res) => {
        Object.keys(res).map(function (key) {
          if (!key.startsWith("Message")) {
            syscontroldata.push(res[key])
          }
        })
        console.log(syscontroldata)

        setAutomatic(!syscontroldata[0]["SYS.ManualEn"])
        setManual(syscontroldata[0]["SYS.ManualEn"])
        setMode(syscontroldata[0]["PNC.AntMode"]);
        setStepTrack(syscontroldata[0]["MDM.StepTrackEnabled"]);

        setAzimuth(syscontroldata[0]["PNC.AzFdbkLLLN_360"]);
        setElevation(syscontroldata[0]["PNC.ElFdbkLLLN_360"]);

        setLongitude(syscontroldata[0]["PNC.Sat.Lon"]);
        setLatitude(syscontroldata[0]["PNC.Sat.Lat"]);
        setAltitude(syscontroldata[0]["PNC.Sat.Alt"]);

        setTxLO(syscontroldata[0]["BUC.TxLo"]);
        setTxBandFromLo(syscontroldata[0]["BUC.TxLo"]);

        setRxLO(syscontroldata[0]["LNB.RxLo"]);
        setRxBandFromLo(syscontroldata[0]["LNB.RxLo"]);

        setRxPol(syscontroldata[0]["LNB.RxPol"])
        if (RxPol === "R") {
          setRxPol('RHCP')
        } else {
          setRxPol('LHCP')
        }
        setTxPol(syscontroldata[0]["BUC.TxPol"])
        if (TxPol === "R") {
          setTxPol('RHCP')
        } else {
          setTxPol('LHCP')
        }

        setAutomaticBUC(!syscontroldata[0]["BUC.MuteManualEn"]);
        setmanualBUC(syscontroldata[0]["BUC.MuteManualEn"]);
        setBucTxEnabled(syscontroldata[0]["BUC.TxEnabled"]);

        setApplyStatus(syscontroldata[0]["SYS.ManualEn"]);

        initMode(syscontroldata[0]["PNC.AntMode"])

        if (syscontroldata[0]["SYS.ManualEn"] === false) {
          setAutomatic(true);
          setManual(false);
        } else {
          setAutomatic(false);
          setManual(true);
        }


      })
      .catch((error) => {
        console.error(error);
      });
    return mode
  }

  const checkMode = (e) => {
    initMode(e)
  };
  const initMode = (mode) => {

    // LoadSystemControl()
    selectmode.current = mode
    setMode(mode)
    console.log(selectmode)

    switch (mode) {
      case "Stabilized Point Search": {
        setShowAzimuth("block");
        setShowPolarization("block")
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point Step Track": {
        setShowAzimuth("block");
        setShowPolarization("block")
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point": {
        setShowAzimuth("block");
        setShowPolarization("block")
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Point": {
        setShowAzimuth("block");
        setShowPolarization("block")
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point Peak": {
        setShowAzimuth("block");
        setShowPolarization("block")
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point Search": {
        setShowAzimuth("block");
        setShowPolarization("block")
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Satellite Search": {
        setShowAzimuth("none");
        setShowPolarization("block")
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Stabilized Satellite": {
        setShowAzimuth("none");
        setShowPolarization("block")
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Stabilized Satellite StepTrack": {
        setShowAzimuth("none");
        setShowPolarization("block")
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Stabilized Satellite Peak": {
        setShowAzimuth("none");
        setShowPolarization("block")
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Park": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none")
        setApplyStatus("none");
        break;
      }
      case "Self-Test": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none")
        setApplyStatus("none");
        break;
      }
      case "Maintenance": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none")
        setApplyStatus("none");
        break;
      }
      case "Test Trajectory": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none")
        setApplyStatus("none");
        break;
      }
      default: {
        setShowAzimuth("block");
        setShowLongLat("none");
        setShowPolarization("none")
        setApplyStatus("point");
        break;
      }
    }
  }

  const TxBandUpdate = (value) => {
    console.log(value);
    if (value === "29-30") {
      setRxBand("19.2-20.2");
      setTxLO("28.05");
      setRxLO("18.25");
    } else {
      setRxBand("20.2 – 21.2");
      setTxLO("29");
      setRxLO("19.2");
    }
  };

  const setTxBandFromLo = (value) => {
    if (value === 28.05) {
      setTxBand("29 - 30")
    }
    else if (value === 29) {
      setTxBand("30 - 31")
    }
  }
  const setRxBandFromLo = (value) => {
    if (value === 18.25) {
      setRxBand("19.2 - 20.2");
    }
    else if (value === 29) {
      setRxBand("20.2 – 21.2");
    }
  }

  const updateSelect = () => {
    let param = ''
    // setMode(mode)
    switch (applyStatus) {
      case "point": {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "PNC.AntMode": {
              "Mode": mode,
              "Azimuth": parseFloat(azimuth),
              "Elevation": parseFloat(elevation),
              "RxPolarization": RxPol === "LHCP" ? "L" : "R",
              "TxPolarization": TxPol === "LHCP" ? "L" : "R"
            }
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            message.success('success')
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      }
      case "satellite": {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "PNC.AntMode": {
              "Mode": mode,
              "Longitude": parseFloat(longitude),
              "Latitude": parseFloat(latitude),
              "Altitude": parseFloat(altitude),
              "RxPolarization": RxPol === "LHCP" ? "L" : "R",
              "TxPolarization": TxPol === "LHCP" ? "L" : "R",
            }
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            message.success('success')
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      }
      case "none": {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "PNC.AntMode": {
              "Mode": mode,
            }
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            message.success('success')
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      }
    }
  };
  const postStepTrack = () => {
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "MDM.StepTrackEnabled": stepTrack
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        getBandOk(response.data.Parameters);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const postTxBand = () => {
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "BUC.TxLo": parseFloat(txLO),
        "LNB.RxLo": parseFloat(rxLO),
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        getBandOk(response.data.Parameters);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getBandOk = (param) => {
    let data = param;
    axios
      .get("https://" + sysIPAddress + "/api/param/get?Parameters=BUC.TxLo,LNB.RxLo", {
        headers,
      })
      .then((res) => {
        console.log("Get", res.data);
        message.success('success')
        setTxBandFromLo(res.data[0]["BUC.TxLo"])
        setRxBandFromLo(res.data[0]["LNB.RxLo"])
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const LABEL = {
    fontWeight: "bold",
    color: "#034f84",
    fontWeight: '600',
    fontSize: '14px'
  };

  const setCurrentStep = (e) => {
    setCurrentStepVal(e);
    setStep(e);
  };
  const difineStepLength = () => {
    setStep(currentStepVal);
  };
  const getRxPolarozation = (e) => {
    if (e === "R") {
      setRxPol('RHCP')
    } else {
      setRxPol('LHCP')
    }
  };
  const getTxPolarozation = (e) => {
    if (e === "R") {
      setTxPol('RHCP')
    } else {
      setTxPol('LHCP')
    }
  };
  const ManualMute = () => {
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "BUC.TxEnabled": bucTxEnabled
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        getManualMute(response.data.Parameters);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getManualMute = () => {
    
    axios.get("https://" + sysIPAddress + "/api/param/get?Parameters=BUC.TxEnabled", {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: "Bearer " + token,
      }, mode: 'cors'
    })
      .then((response) => {
        setBucTxEnabled(response.data[0]["BUC.TxEnabled"])

      })
      .catch((error) => {
        console.error(error);
      });
  };

  const changeTxEnabled = (checkd) => {
    setBucTxEnabled(checkd)
  }

  const changeBucAutoManual = (key) => {
    console.log(key)
    let param = {}
    if (key === 1) {
      if (window.confirm("Switching BUC to manual mode. Are you sure?")) {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "BUC.MuteManualEn": true
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            setAutomaticBUC(false);
            setmanualBUC(true);

          })
          .catch((error) => {
            console.error(error);
            setAutomaticBUC(true);
          });

      } else {
        setAutomaticBUC(true);
        setmanualBUC(false);
        key = 0
      }

    } else {
      param = {
        MessageName: "HTMLFormUpdate",
        Parameters: {
          "BUC.MuteManualEn": false
        },
      };
      axios
        .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
        .then((response) => {
          console.log("Post", response.data.Parameters);
          setAutomaticBUC(false)
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }

  const changeSysAutoManual = (key) => {
    let param = {}
    if (key === 1) {
      if (window.confirm("Switching system to manual control. Are you sure?")) {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "SYS.ManualEn": true,
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            setAutomatic(false);
            setManual(true);
          })
          .catch((error) => {
            console.error(error);
          });

      } else {
        setAutomatic(true);
        setManual(false);
      }

    } else {
      param = {
        MessageName: "HTMLFormUpdate",
        Parameters: {
          "SYS.ManualEn": false
        },
      };
      axios
        .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
        .then((response) => {
          console.log("Post", response.data.Parameters);
          getBandOk(response.data.Parameters);
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="System Control" />
      </div>
      <div className="content-wrapper">
        <div style={LABEL}>ACU</div>
        <Accordion key={acuAutomatic} easing="ease" onChange={(e) => changeSysAutoManual(e.activeItems[0])}>
          <AccordionItem title="Automatic" expanded={automatic}>
            <Row width="100%">
              <Col span={4} >
                <span style={LABEL}>Mode:</span>
              </Col>
              <Col span={4}>
                <Select defaultValue="Open AMIP" style={{ width: 200 }}>
                  <Option value="openamip">Open AMIP</Option>
                </Select>{" "}
              </Col>
              <Col span={4} >
                <Button shape="round" onClick={postStepTrack} type="primary">
                  Apply
              </Button>
              </Col>
            </Row>
            <Divider orientation="left" style={{ 'background-color': '#ffffff' }}/>

            <Col span={4}>
            </Col>
            <Col span={16} >
              <Switch
                size="large"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={stepTrack}
                onChange={() => setStepTrack(!stepTrack)}
              />{" "}
              Step Track
              </Col>
          </AccordionItem>
          <AccordionItem title="Manual" expanded={manual}>
            <Divider orientation="left" style={LABEL}>
              Mode
            </Divider>
            <Row width="100%">
              <Col span={4} style={LABEL}>
                Mode:
              </Col>
              <Col span={16}>
                <Select
                  value={mode}
                  style={{ width: 250 }}
                  onChange={(e) => checkMode(e)}
                  ref={selectmode}
                >
                  <Option value="Point">Point</Option>{" "}
                  <Option value="Stabilized Point Search">
                    Stabilized Point Search
                  </Option>
                  <Option value="Stabilized Point">Stabilized Point</Option>
                  <Option value="Stabilized Point Step Track">
                    Stabilized Point Step Track
                  </Option>
                  <Option value="Stabilized Point Peak">
                    Stabilized Point Peak
                  </Option>
                  <Option value="Stabilized Satellite Search">
                    Stabilized Satellite Search
                  </Option>
                  <Option value="Stabilized Satellite">
                    Stabilized Satellite
                  </Option>
                  <Option value="Stabilized Satellite StepTrack">
                    Stabilized Satellite StepTrack
                  </Option>
                  <Option value="Stabilized Satellite Peak">
                    Stabilized Satellite Peak
                  </Option>
                  <Option value="Park">Park</Option>
                  <Option value="Self-Test">Self-Test</Option>
                  <Option value="Maintenance">Maintenance</Option>
                  <Option value="Test Trajectory">Test Trajectory</Option>
                </Select>
              </Col>
              <Col span={4}>
                <span style={{ textAlign: "right" }}>
                  <Button shape="round" onClick={updateSelect} type="primary">
                    Apply
                  </Button>
                </span>
              </Col>
            </Row>
            <div className="divider-line">&nbsp;</div>
            <Row width="100%">
              <Col span={24}>
                {/* azimuth area */}
                <Row>
                  <Col span={4} style={{ display: showAzimuth }}>
                    <span style={LABEL}>Azimuth:</span>
                  </Col>
                  <Col span={9} style={{ display: showAzimuth }}>
                    <InputNumber value={azimuth} id="azimuthid" onChange={(e) => setAzimuth(e)} min={0} max={360} step={step} />
                  </Col>
                  <Col span={2} style={{ display: showAzimuth }}>
                    <span style={LABEL}><ToolOutlined />Step size:</span>
                  </Col>

                  <Col span={2} style={{ display: showAzimuth }}>
                    <InputNumber
                      id="difinestep"
                      defaultValue={0.1}
                      ref={stepLength}
                      onChange={setCurrentStep}
                      min={0.1}
                      max={10}
                      step={0.1}
                    />{" "}
                  </Col>
                  
                </Row>
                <div className="divider-line">&nbsp;</div>
                <Row>
                  <Col span={4} style={{ display: showAzimuth }}>
                    <span style={LABEL}>Elevation:</span>
                  </Col>
                  <Col span={17} style={{ display: showAzimuth }}>
                    <InputNumber
                      id="elevationid" value={elevation}
                      min={0}
                      max={90}
                      step={step}
                      onChange={(e) => setElevation(e)}
                    />
                  </Col>
                </Row>
                {/* lang lat area  */}
                <Row>
                  <Col span={4} style={{ display: showLongLat }}>
                    <span style={LABEL}>Longitude:</span>
                  </Col>
                  <Col style={{ display: showLongLat }} span={9}>
                    <InputNumber
                      id="longitudeid" value={longitude}
                      min={0}
                      max={360}
                      step={step}
                      onChange={(e) => setLongitude(e)}
                    /> [deg]
                  </Col>
                  <Col span={2} style={{ display: showLongLat }}>
                    <span style={LABEL}>Step size:</span>
                  </Col>
                  <Col span={2} style={{ display: showLongLat }}>
                    <InputNumber
                      id="difinestep"
                      defaultValue={0.1}
                      ref={stepLength}
                      onChange={setCurrentStep}
                      min={0.1}
                      max={10}
                      step={0.1}
                    />{" "}
                  </Col>
                  <Col span={2} style={{ display: showLongLat }}>
                    
                  </Col>
                </Row>
                <div className="divider-line" style={{ display: showPolarization}}>&nbsp;</div>
                <Row >
                  <Col span={4} style={{ display: showLongLat }}>
                    <span style={LABEL}>Latitude:</span>
                  </Col>
                  <Col span={17} style={{ display: showLongLat }}>
                    <InputNumber id="latitudeid" onChange={(e) => setLatitude(e)} value={latitude} min={0} max={90} step={step} /> [deg]
                  </Col>
                </Row>
                <div className="divider-line" style={{ display: showPolarization}}>&nbsp;</div>
                <Row>
                  <Col span={4} style={{ display: showLongLat }}>
                    <span style={LABEL}>Altitude:</span>
                  </Col>
                  <Col span={17} style={{ display: showLongLat }}>
                    <InputNumber id="altitudeid" onChange={(e) => setAltitude(e)} value={altitude} min={0} max={100000000} step={step} /> [m]
                  </Col>
                </Row>
                <div className="divider-line" style={{ display: showPolarization}}>&nbsp;</div>
                <Row style={{ display: showPolarization, width: '100%' }}>
                  <Col span={24}>
                    <Row>
                      <Col span={4} style={LABEL}>
                        Tx Polarization:
                  </Col>
                      <Col span={8}>
                        <Select style={{ width: 90 }} onChange={getTxPolarozation} value={TxPol}>
                          <Option value="R">RHCP</Option>
                          <Option value="L">LHCP</Option>
                        </Select>
                      </Col>
                    </Row></Col>
                    
                    <Col span={24}>
                    <div className="divider-line" style={{ display: showPolarization}}>&nbsp;</div>
                    <Row>
                      <Col span={4} style={LABEL}>
                        Rx Polarization:
                  </Col>
                      <Col span={8}>
                        <Select style={{ width: 90 }} onChange={getRxPolarozation} value={RxPol}>
                          <Option value="R">RHCP</Option>
                          <Option value="L">LHCP</Option>
                        </Select>
                      </Col>
                    </Row></Col>
                </Row>
              </Col>
            </Row>
            <Divider orientation="left"  style={LABEL}>Band </Divider>
            <Row>
              <Col span={4} style={LABEL}>
                Tx Band:
              </Col>
              <Col span={4}>
                <Select style={{ width: 90 }} onChange={TxBandUpdate} value = {txBand}>
                  <Option value="29-30" selected>29-30</Option>{" "}
                  {/* mode: point slide 13 */}
                  <Option value="30-31">30-31</Option>
                  
                </Select> [GHz]
              </Col>
              <Col span={2} style={LABEL}>
                Tx LO:
              </Col>
              <Col span={4}>{txLO} [GHz]</Col>
              <Col span={4}>
                <Button shape="round" type="primary" onClick={postTxBand}>
                  Apply
                </Button>
                {/* 
                Apply button will call POST API with following values:
                BUC.TxLo = 29, LNB.RxLo = 19.2
                */}
              </Col>
            </Row>
            <div className="divider-line">&nbsp;</div>
            <Row>
              <Col span={4} style={LABEL}>
                Rx Band:
              </Col>
              <Col span={4}>{rxBand}[GHz]</Col>
              <Col span={2} style={LABEL}>
                Rx LO:
              </Col>
              <Col span={4}>{rxLO} [GHz]</Col>
              <Col span={4}></Col>
            </Row>
          </AccordionItem>
        </Accordion>
        <div style={LABEL}>BUC MUTE</div>
        <Accordion accordion onChange={(e) => changeBucAutoManual(e.activeItems[0])}>
          <AccordionItem title="Automatic" expanded={automaticBUC}>
            {/* On “Manual” radio button selection:
              User is alerted with message:
              “Attention: BUC will be controlled manually by operator. Are you sure?”
              If the user chooses “Yes”, the “Manual” option turned on
              -	POST API is called as follows:
              {"MessageName": "HTMLFormUpdate","Parameters": {" BUC.MuteManualEn": true }}
              BUC.TxEnabled = true : Unmute
              BUC.TxEnabled = false : Mute

              */}
          </AccordionItem>
          <AccordionItem title="Manual" key="2" expanded={manualBUC}>
            {" "}
            <Row>
              <Col span={4}>
                <Switch
                  checkedChildren="Umuted"
                  unCheckedChildren="Muted"
                  checked={bucTxEnabled}
                  onChange={changeTxEnabled}
                />
              </Col>
              <Col span={8}>
                <Button shape="round" onClick={ManualMute} type="primary">
                  Apply
                </Button>
              </Col>
            </Row>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default SystemControl;
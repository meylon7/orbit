import React, { useState, useContext, useEffect, useRef } from "react";
import useSessionstorage from "@rooks/use-sessionstorage";
import sysIPAddress from "../../location";
import Modal from "../modal";
import "../style/accordion.css"; // moshe 31/01/21
import { ToolOutlined } from "@ant-design/icons";
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
  Radio,
  Input,
} from "antd";
import axios from "axios";
import { SocketContext } from "../../App";

const SystemControl = () => {
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
    width: "100%",
  };
  //////////////////////////////////////
  const [token] = useSessionstorage("token");
  // moshe 31/01/21
  const [accAuto, setAccAuto] = useState(true);
  const [accManual, setAccManual] = useState(false);
  ////////////////
  let acuAutomatic = true;
  let value = 1;
  let bucAutomatic = true;
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
  const [txLO, setTxLO] = useState("N/A");
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
  const [unsaved, setUnsaved] = useSessionstorage("unsavedConfigChanges");
  const [topButtonColor, setTopButtonColor] = useSessionstorage("color");
  const { Option } = Select;
  const selectmode = useRef("");
  var syscontroldata = [];
  var modeVal;
  const headers = {
    //'Access-Control-Origin': '*',
    "Content-Type": "text/plain",
    Authorization: "Bearer " + token,
  };

  //////////////////////////////////////
  useEffect(() => {
    LoadSystemControl();
  }, []);

  useEffect(() => {
    getManualMute();
  }, [bucTxEnabled]);
  const LoadSystemControl = () => {
    axios
      .get(
        "https://" +
          sysIPAddress +
          "/api/param/get?Parameters=SYS.ManualEn,MDM.StepTrackEnabled,PNC.AntMode,PNC.RF.BitRevertMode,PNC.Sat.Lon,PNC.Sat.Lat,PNC.Sat.Alt,PNC.AzFdbkLLLN_360,PNC.ElFdbkLLLN_360,BUC.TxPol,LNB.RxPol,BUC.TxLo,LNB.RxLo,BUC.MuteManualEn,BUC.TxEnabled",
        {
          headers: {
            "Content-Type": "text/plain",
            Authorization: "Bearer " + token,
          },
          mode: "cors",
        }
      )
      .then((res) => {
        Object.keys(res).map(function (key) {
          if (!key.startsWith("Message")) {
            syscontroldata.push(res[key]);
          }
        });
        console.log(syscontroldata);

        setAutomatic(!syscontroldata[0]["SYS.ManualEn"]);
        setManual(syscontroldata[0]["SYS.ManualEn"]);
        setMode(syscontroldata[0]["PNC.AntMode"]);
        setStepTrack(syscontroldata[0]["MDM.StepTrackEnabled"]);

        setAzimuth(syscontroldata[0]["PNC.AzFdbkLLLN_360"]);
        setElevation(syscontroldata[0]["PNC.ElFdbkLLLN_360"]);

        setLongitude(syscontroldata[0]["PNC.Sat.Lon"]);
        setLatitude(syscontroldata[0]["PNC.Sat.Lat"]);
        setAltitude(syscontroldata[0]["PNC.Sat.Alt"]);

        // setTxLO(syscontroldata[0]["BUC.TxLo"]);

        let tmp =
          syscontroldata[0]["BUC.TxLo"] !== undefined &&
          syscontroldata[0]["BUC.TxLo"] !== null
            ? syscontroldata[0]["BUC.TxLo"]
            : "N/A";
        setTxLO(tmp);
        console.log("txLo = ", txLO);
        setTxBandFromLo(txLO);

        setRxLO(syscontroldata[0]["LNB.RxLo"]);
        setRxBandFromLo(syscontroldata[0]["LNB.RxLo"]);

        tmp =
          syscontroldata[0]["LNB.RxPol"] !== undefined &&
          syscontroldata[0]["LNB.RxPol"] !== null
            ? syscontroldata[0]["LNB.RxPol"]
            : "N/A";
        console.log("LNB.RxPol = ", tmp);
        if (tmp === "R") {
          setRxPol("RHCP");
        } else if (tmp === "L") {
          setRxPol("LHCP");
        } else {
          setRxPol("N/A");
        }
        setTxPol(
          syscontroldata[0]["BUC.TxPol"] !== undefined &&
            syscontroldata[0]["BUC.TxPol"] !== null
            ? syscontroldata[0]["BUC.TxPol"]
            : "N/A"
        );
        if (TxPol === "R") {
          setTxPol("RHCP");
        } else if (TxPol === "L") {
          setTxPol("LHCP");
        } else {
          setTxPol("N/A");
        }

        setAutomaticBUC(!syscontroldata[0]["BUC.MuteManualEn"]);
        setmanualBUC(syscontroldata[0]["BUC.MuteManualEn"]);
        setBucTxEnabled(
          syscontroldata[0]["BUC.TxEnabled"] !== undefined &&
            syscontroldata[0]["BUC.TxEnabled"] !== null
            ? syscontroldata[0]["BUC.TxEnabled"]
            : false
        );

        setApplyStatus(syscontroldata[0]["SYS.ManualEn"]);

        initMode(syscontroldata[0]["PNC.AntMode"]);

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
    return mode;
  };

  const checkMode = (e) => {
    initMode(e);
  };
  const initMode = (mode) => {
    // LoadSystemControl()
    selectmode.current = mode;
    setMode(mode);
    console.log(selectmode);

    switch (mode) {
      case "Stabilized Point Search": {
        setShowAzimuth("block");
        setShowPolarization("block");
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point Step Track": {
        setShowAzimuth("block");
        setShowPolarization("block");
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point": {
        setShowAzimuth("block");
        setShowPolarization("block");
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Point": {
        setShowAzimuth("block");
        setShowPolarization("block");
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point Peak": {
        setShowAzimuth("block");
        setShowPolarization("block");
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Point Search": {
        setShowAzimuth("block");
        setShowPolarization("block");
        setShowLongLat("none");
        setApplyStatus("point");
        break;
      }
      case "Stabilized Satellite Search": {
        setShowAzimuth("none");
        setShowPolarization("block");
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Stabilized Satellite": {
        setShowAzimuth("none");
        setShowPolarization("block");
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Stabilized Satellite StepTrack": {
        setShowAzimuth("none");
        setShowPolarization("block");
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Stabilized Satellite Peak": {
        setShowAzimuth("none");
        setShowPolarization("block");
        setShowLongLat("block");
        setApplyStatus("satellite");
        break;
      }
      case "Park": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none");
        setApplyStatus("none");
        break;
      }
      case "Self-Test": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none");
        setApplyStatus("none");
        break;
      }
      case "Maintenance": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none");
        setApplyStatus("none");
        break;
      }
      case "Test Trajectory": {
        setShowAzimuth("none");
        setShowLongLat("none");
        setShowPolarization("none");
        setApplyStatus("none");
        break;
      }
      default: {
        setShowAzimuth("block");
        setShowLongLat("none");
        setShowPolarization("none");
        setApplyStatus("point");
        break;
      }
    }
  };

  const TxBandUpdate = (value) => {
    console.log("TxBandUpdate: ", value);
    if (value === "29-30") {
      setTxBand(value);
      setRxBand("19.2-20.2");
      setTxLO("28.05");
      setRxLO("18.25");
    } else if (value === "30-31") {
      setTxBand(value);
      setRxBand("20.2 – 21.2");
      setTxLO("29");
      setRxLO("19.2");
    } else {
      setRxBand("N/A");
      setTxLO("N/A");
      setRxLO("N/A");
    }
  };

  const setTxBandFromLo = (value) => {
    if (value === 28.05) {
      setTxBand("29 - 30");
    } else if (value === 29) {
      setTxBand("30 - 31");
    } else {
      setTxBand("N/A");
    }
  };
  const setRxBandFromLo = (value) => {
    if (value === 18.25) {
      setRxBand("19.2 - 20.2");
    } else if (value === 29) {
      setRxBand("20.2 – 21.2");
    } else {
      setRxBand("N/A");
    }
  };

  const updateSelect = () => {
    let param = "";
    // setMode(mode)
    switch (applyStatus) {
      case "point": {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "PNC.AntMode": {
              Mode: mode,
              Azimuth: parseFloat(azimuth),
              Elevation: parseFloat(elevation),
              RxPolarization: RxPol === "LHCP" ? "L" : "R",
              TxPolarization: TxPol === "LHCP" ? "L" : "R",
            },
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, {
            headers,
          })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            message.success("success");
            setUnsaved(true);
            setTopButtonColor("red");
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
              Mode: mode,
              Longitude: parseFloat(longitude),
              Latitude: parseFloat(latitude),
              Altitude: parseFloat(altitude),
              RxPolarization: RxPol === "LHCP" ? "L" : "R",
              TxPolarization: TxPol === "LHCP" ? "L" : "R",
            },
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, {
            headers,
          })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            setUnsaved(true);
            setTopButtonColor("red");
            message.success("success");
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
              Mode: mode,
            },
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, {
            headers,
          })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            setUnsaved(true);
            message.success("success");
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
        "MDM.StepTrackEnabled": stepTrack,
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        getBandOk(response.data.Parameters);
        setUnsaved(true);
        setTopButtonColor("red");
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
        setUnsaved(true);
        setTopButtonColor("red");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getBandOk = (param) => {
    let data = param;
    axios
      .get(
        "https://" +
          sysIPAddress +
          "/api/param/get?Parameters=BUC.TxLo,LNB.RxLo",
        {
          headers,
        }
      )
      .then((res) => {
        console.log("Get", res.data);
        message.success("success");
        setTxBandFromLo(
          res.data[0]["BUC.TxLo"] !== null &&
            res.data[0]["BUC.TxLo"] !== undefined
            ? res.data[0]["BUC.TxLo"]
            : "N/A"
        );
        setRxBandFromLo(
          res.data[0]["LNB.RxLo"] !== null &&
            res.data[0]["LNB.RxLo"] !== undefined
            ? res.data[0]["LNB.RxLo"]
            : "N/A"
        );
        setUnsaved(true);
        setTopButtonColor("red");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const LABEL = {
    fontWeight: "bold",
    color: "#034f84",
    fontWeight: "600",
    fontSize: "14px",
  };

  const setCurrentStep = (e) => {
    setCurrentStepVal(e);
    setStep(e);
  };
  const defineStepLength = () => {
    setStep(currentStepVal);
  };
  const getRxPolarization = (e) => {
    if (e === "R") {
      setRxPol("RHCP");
    } else {
      setRxPol("LHCP");
    }
  };
  const getTxPolarization = (e) => {
    if (e === "R") {
      setTxPol("RHCP");
    } else {
      setTxPol("LHCP");
    }
  };
  const ManualMute = () => {
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "BUC.TxEnabled": bucTxEnabled,
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        setUnsaved(true);
        setTopButtonColor("red");

        getManualMute(response.data.Parameters);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getManualMute = () => {
    axios
      .get(
        "https://" + sysIPAddress + "/api/param/get?Parameters=BUC.TxEnabled",
        {
          headers: {
            "Content-Type": "text/plain",
            Authorization: "Bearer " + token,
          },
          mode: "cors",
        }
      )
      .then((res) => {
        let temp =
          res.data[0]["BUC.TxEnabled"] !== null &&
          res.data[0]["BUC.TxEnabled"] !== undefined
            ? res.data[0]["BUC.TxEnabled"]
            : false;
        setBucTxEnabled(temp);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const changeTxEnabled = (checkd) => {
    setBucTxEnabled(checkd);
  };

  const changeBucAutoManual = (key) => {
    console.log(key);
    let param = {};
    if (key === 1) {
      if (window.confirm("Switching BUC to manual mode. Are you sure?")) {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "BUC.MuteManualEn": true,
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, {
            headers,
          })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            setAutomaticBUC(false);
            setmanualBUC(true);
            setUnsaved(true);
            setTopButtonColor("red");
          })
          .catch((error) => {
            console.error(error);
            setAutomaticBUC(true);
          });
      } else {
        setAutomaticBUC(true);
        setmanualBUC(false);
        setUnsaved(true);
        setTopButtonColor("red");
        key = 0;
      }
    } else {
      param = {
        MessageName: "HTMLFormUpdate",
        Parameters: {
          "BUC.MuteManualEn": false,
        },
      };
      axios
        .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
        .then((response) => {
          console.log("Post", response.data.Parameters);
          setAutomaticBUC(false);
          setUnsaved(true);
          setTopButtonColor("red");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const changeSysAutoManual = (key) => {
    let param = {};
    if (key === 1) {
      if (window.confirm("Switching system to manual control. Are you sure?")) {
        param = {
          MessageName: "HTMLFormUpdate",
          Parameters: {
            "SYS.ManualEn": true,
          },
        };
        axios
          .post("https://" + sysIPAddress + "/api/param/set", param, {
            headers,
          })
          .then((response) => {
            console.log("Post", response.data.Parameters);
            setAutomatic(false);
            setManual(true);
            setTopButtonColor("red");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setAutomatic(true);
        setManual(false);
        key = 0;
      }
    } else {
      param = {
        MessageName: "HTMLFormUpdate",
        Parameters: {
          "SYS.ManualEn": false,
        },
      };
      axios
        .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
        .then((response) => {
          console.log("Post", response.data.Parameters);
          getBandOk(response.data.Parameters);
          setTopButtonColor("red");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const stam = (e) => {
    console.log("radio checked", e.target.value);
    value = e.target.value;
  };

  // moshe 31/01/21
  const toggleTab = (item) => {
    if (item === 1) {
      setAccAuto(true);
      setAccManual(false);
    } else {
      setAccAuto(false);
      setAccManual(true);
    }
  };
  /////////////////
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="ACU Control" />
      </div>
      <div className="content-wrapper">
        <Radio.Group onChange={(e) => stam(e)} value={value}>
          <Radio style={(radioStyle, LABEL)} value={1}>
            Automatic
          </Radio>
          <div className="divider-line">&nbsp;</div>

          <Row width="100%">
            <Col span={8}></Col>

            <Col span={8}>
              <span style={LABEL}>Mode: </span>
            </Col>
            <Col span={8}>
              <span style={LABEL}>OpenAMIP</span>
            </Col>
          </Row>
          <div className="divider-line">&nbsp;</div>

          <Row width="100%">
            <Col span={8}></Col>

            <Col span={13}>
              <Switch
                size="large"
                checkedChildren="Step Track On"
                unCheckedChildren="Step Track Off"
                checked={stepTrack}
                onChange={() => setStepTrack(!stepTrack)}
              />{" "}
            </Col>
            <Col span={3}>
              <Button shape="round" onClick={postStepTrack} type="primary">
                Apply
              </Button>
            </Col>
          </Row>
          <div className="divider-line">&nbsp;</div>

          <Radio style={radioStyle} value={2}>
            Manual
          </Radio>
        </Radio.Group>
      </div>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="BUC Mute Control" />
      </div>
      <div className="content-wrapper">
      {/*moshe '31/01/21' */ }
      <div className="wrapper">
          <div className="accordion-wrapper">
            <div
              onClick={() => toggleTab(1)}
              className={`accordion-title ${accAuto ? "open" : ""}`}
              onClick={() => toggleTab(1)}
            >
            Automatic
            </div>
              <div className={`accordion-item ${!accAuto ? "collapsed" : ""}`}>
                <div className="accordion-content">
                  Sunlight reaches Earth's atmosphere and is scattered in all
                  directions by all the gases and particles in the air. Blue
                  light is scattered more than the other colors because it
                  travels as shorter, smaller waves. This is why we see a blue
                  sky most of the time.
                </div>
              </div>
            
            <div
              onClick={() => toggleTab(2)}
              className={`accordion-title ${accManual ? "open" : ""}`}
              onClick={() => toggleTab(2)}
            >Manual</div>
              <div
                className={`accordion-item ${!accManual ? "collapsed" : ""}`}
              >
                <div className="accordion-content">
                  Sunlight reaches Earth's atmosphere and is scattered in all
                  directions by all the gases and particles in the air. Blue
                  light is scattered more than the other colors because it
                  travels as shorter, smaller waves. This is why we see a blue
                  sky most of the time.
                </div>
              </div>
            </div>
          
        </div>
        
      </div>
    </>
  );
};

export default SystemControl;

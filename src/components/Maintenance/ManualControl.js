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
  const [bucAuto, setBucAuto] = useState(true);
  const [bucManual, setBucManual] = useState(false);

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
  const stepLonLatLength = useRef(0.1);
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
  const [step, setStep] = useState(0.1);
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
        setAccAuto(!syscontroldata[0]["SYS.ManualEn"]);
        setAccManual(syscontroldata[0]["SYS.ManualEn"]);
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
        setBucAuto(!syscontroldata[0]["BUC.MuteManualEn"]);
        setBucManual(syscontroldata[0]["BUC.MuteManualEn"]);

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
    let userMessage = "";
    // setMode(mode)
    switch (applyStatus) {
      case "point": {
        if(TxPol === "N/A" || RxPol === "N/A" || azimuth === null){
          if (azimuth === null) {
            userMessage+= "Please set Azimuth\n";
          }
          if (elevation === null) {
            userMessage+= "Please set Elevation\n";
          }
          if(TxPol === "N/A"){
            userMessage+= "Please select Tx Polarization\n";
          }
          if (RxPol === "N/A") {
            userMessage+= "Please select Rx Polarization\n";
          }
          window.alert(userMessage);
        }else{
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
              if (response.data.Parameters['PNC.AntMode'] !== null) {
                console.log("Post", response.data.Parameters);
                message.success("success");
                setUnsaved(true);
                setTopButtonColor("red");
              } else {
                message.error("Failed to set mode ", mode)
              }

            })
            .catch((error) => {
              console.error(error);
              message.error("Failed to set mode ", mode)

            });
        }
        
        break;
      }
      case "satellite": {
        if(TxPol === "N/A" || RxPol === "N/A" || longitude === null || latitude === null || altitude === null){
          if (longitude === null) {
            userMessage+= "Please set Longitude\n";
          }
          if (latitude === null) {
            userMessage+= "Please set Latitude\n";
          }
          if (altitude === null) {
            userMessage+= "Please set Altitude\n";
          }
          if(TxPol === "N/A"){
            userMessage+= "Please select Tx Polarization\n";
          }
          if (RxPol === "N/A") {
            userMessage+= "Please select Rx Polarization\n";
          }
        
          window.alert(userMessage);
        }else{
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
            if (response.data.Parameters['PNC.AntMode'] !== null) {
              console.log("Post", response.data.Parameters);
              message.success("success");
              setUnsaved(true);
              setTopButtonColor("red");
            } else {
              message.error("Failed to set mode ", mode)
            }
          })
          .catch((error) => {
            console.error(error);
            message.error("Failed to set mode ", mode)

          });
        }
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
            if (response.data.Parameters['PNC.AntMode'] !== null) {
              console.log("Post", response.data.Parameters);
              message.success("success");
              setUnsaved(true);
              setTopButtonColor("red");
            } else {
              message.error("Failed to set mode ", mode)
            }
          })
          .catch((error) => {
            console.error(error);
            message.error("Failed to set mode ", mode)

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
    if(txBand === "N/A"){
      window.alert("Please select Tx Band\n");
    }else{
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
    }
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
    fontSize: "16px",
  };

  const setCurrentStep = (e) => {
    setCurrentStepVal(e);
    setStep(e);
  };
  const setCurrentLonLatStep = (e) => {

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

            setAccAuto(false);
            setAccManual(true);

            setTopButtonColor("red");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setAutomatic(true);
        setManual(false);

        setAccAuto(true);
        setAccManual(false);
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

  // moshe 31/01/21
  const toggleAcuTab = (item) => {
    let param;
    if (item === 1) {
      setAccAuto(true);
      setAccManual(false);
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
          setTopButtonColor("red");
          LoadSystemControl();
        })
        .catch((error) => {
          console.error(error);
          message.error("Can't switch to automatic mode");
        });
    } else {
      if (window.confirm("Switching system to manual control. Are you sure?")) {
        setAccAuto(false);
        setAccManual(true);
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
            setTopButtonColor("red");
            LoadSystemControl();
          })
          .catch((error) => {
            console.error(error);
            message.error("Can't switch to manual mode");
          });
      }
    }
  };
  const toggleBucTab = (item) => {
    let param;
    if (item === 1) {
      setBucAuto(true);
      setBucManual(false);
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
          setTopButtonColor("red");
          setBucAuto(true);
          setBucManual(false);
        })
        .catch((error) => {
          console.error(error);
          setBucAuto(false);
          setBucManual(true);
          message.error("Can't switch to automatic mode");
        });
    } else {
      if (window.confirm("Switching BUC to manual mode. Are you sure?")) {
        setBucAuto(false);
        setBucManual(true);
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
            setTopButtonColor("red");
          })
          .catch((error) => {
            console.error(error);
            setBucAuto(true);
            setBucManual(false);
            message.error("Can't switch to manual mode");
          });
      }
    }
  };
  /////////////////
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="ACU Control" />
      </div>
      <div className="content-wrapper">
        <div className="wrapper">
          <div className="accordion-wrapper">
            <div
              onClick={() => toggleAcuTab(1)}
              className={`accordion-title ${accAuto ? "open acc-blue" : ""}`}
            >
              Automatic
            </div>
            <div className={`accordion-item ${!accAuto ? "collapsed" : ""}`}>
              <div className="accordion-content">
                <Row width="100%">
                  <Col span={6}>
                    <span style={LABEL}>Mode: OpenAMIP</span>
                  </Col>

                  <Col span={14}>
                    <Switch
                      size="large"
                      checkedChildren="Step Track On"
                      unCheckedChildren="Step Track Off"
                      checked={stepTrack}
                      onChange={() => setStepTrack(!stepTrack)}
                    />{" "}
                  </Col>
                  <Col span={1}>
                    <Button
                      shape="round"
                      onClick={postStepTrack}
                      type="primary"
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>

            <div
              onClick={() => toggleAcuTab(2)}
              className={`accordion-title ${accManual ? "open  acc-blue" : ""}`}
            >
              Manual
            </div>
            <div className={`accordion-item ${!accManual ? "collapsed" : ""}`}>
              <div className="accordion-content">
                <Divider orientation="left" style={LABEL}>
                  {" "}
                  Mode{" "}
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
                      <Button
                        shape="round"
                        onClick={updateSelect}
                        type="primary"
                      >
                        Apply
                      </Button>
                    </span>
                  </Col>
                </Row>

                <Row width="100%">
                  <Col span={24}>
                    {/* azimuth area */}

                    <Row>
                      <Col span={4} style={{ display: showAzimuth }}>
                        <span style={LABEL}>Azimuth:</span>
                      </Col>
                      <Col span={6} style={{ display: showAzimuth }}>
                        <InputNumber
                          value={azimuth}
                          id="azimuthid"
                          onChange={(e) => setAzimuth(e)}
                          min={0}
                          max={360}
                          step={step}
                        />{" "}
                        [deg]
                      </Col>
                      <Col span={4} style={{ display: "none" }}>{/*showAzimuth */}
                        <span>
                          <ToolOutlined />
                          Step size:
                        </span>
                      </Col>

                      <Col span={6} style={{ display: "none" }}>{/*showAzimuth */}
                        <InputNumber
                          id="definestepAz"
                          defaultValue={0.1}
                          ref={stepLength}
                          onChange={setCurrentStep}
                          min={0.1}
                          max={90}
                          step={0.1}
                        />{" "}
                        [deg]
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4} style={{ display: showAzimuth }}>
                        <span style={LABEL}>Elevation:</span>
                      </Col>
                      <Col span={17} style={{ display: showAzimuth }}>
                        <InputNumber
                          id="elevationid"
                          value={elevation}
                          min={0}
                          max={90}
                          step={step}
                          onChange={(e) => setElevation(e)}
                        />{" "}
                        [deg]
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4} style={{ display: showLongLat }}>
                        <span style={LABEL}>Longitude:</span>
                      </Col>
                      <Col style={{ display: showLongLat }} span={6}>
                        <InputNumber
                          id="longitudeid"
                          value={longitude}
                          min={0}
                          max={360}
                          step={step}
                          onChange={(e) => setLongitude(e)}
                        />{" "}
                        [deg]
                      </Col>

                      <Col span={4} style={{ display: "none" }}>{/*showLongLat */}
                        <span>
                          <ToolOutlined />
                          Step size:
                        </span>
                      </Col>
                      <Col span={6} style={{ display: "none" }}>{/*showLongLat */}
                        <InputNumber
                          id="definestepLon"
                          defaultValue={0.1}
                          ref={stepLonLatLength}
                          onChange={setCurrentStep}
                          min={0.1}
                          max={10}
                          step={0.1}
                        />{" "}
                        [deg]
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4} style={{ display: showLongLat }}>
                        <span style={LABEL}>Latitude:</span>
                      </Col>
                      <Col span={17} style={{ display: showLongLat }}>
                        <InputNumber
                          id="latitudeid"
                          onChange={(e) => setLatitude(e)}
                          value={latitude}
                          min={0}
                          max={90}
                          step={step}
                        />{" "}
                        [deg]
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4} style={{ display: showLongLat }}>
                        <span style={LABEL}>Altitude:</span>
                      </Col>

                      <Col span={17} style={{ display: showLongLat }}>
                        <InputNumber
                          id="altitudeid"
                          onChange={(e) => setAltitude(e)}
                          value={altitude}
                          min={0}
                          max={100000000}
                          step={step}
                        />{" "}
                        [m]
                      </Col>
                    </Row>
                    <Row style={{ display: showPolarization}}>
                      <Col span={24}>
                        <Row>
                          <Col span={4} style={LABEL}>
                            Tx Polarization:
                          </Col>
                          <Col span={8}>
                            <Select
                              style={{ width: 90 }}
                              onChange={getTxPolarization}
                              value={TxPol}
                            >
                              <Option value="R">RHCP</Option>
                              <Option value="L">LHCP</Option>
                            </Select>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={24}>
                        <Row>
                          <Col span={4} style={LABEL}>
                            Rx Polarization:
                          </Col>
                          <Col span={8}>
                            <Select
                              style={{ width: 90 }}
                              onChange={getRxPolarization}
                              value={RxPol}
                            >
                              <Option value="R">RHCP</Option>
                              <Option value="L">LHCP</Option>
                            </Select>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Divider orientation="left" style={LABEL}>
                  Band{" "}
                </Divider>
                <Row>
                  <Col span={4} style={LABEL}>
                    Tx Band:
                  </Col>
                  <Col span={6}>
                    <Select
                      style={{ width: 90 }}
                      onChange={TxBandUpdate}
                      value={txBand}
                    >
                      <Option value="29-30" selected>
                        29-30
                      </Option>{" "}
                      {/* mode: point slide 13 */}
                      <Option value="30-31">30-31</Option>
                    </Select>{" "}
                    [GHz]
                  </Col>
                  <Col span={2} style={LABEL}>
                    Tx LO:
                  </Col>
                  <Col span={8}>{txLO} [GHz]</Col>
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
                <Row>
                  <Col span={4} style={LABEL}>
                    Rx Band:
                  </Col>
                  <Col span={6}>{rxBand}&nbsp;&nbsp;&nbsp;&nbsp;[GHz]</Col>
                  <Col span={2} style={LABEL}>
                    Rx LO:
                  </Col>
                  <Col span={8}>{rxLO} [GHz]</Col>
                  <Col span={4}></Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="BUC Mute Control" />
      </div>
      <div className="content-wrapper">
        {/*moshe '31/01/21' */}
        <div className="wrapper">
          <div className="accordion-wrapper">
            <div
              onClick={() => toggleBucTab(1)}
              className={`accordion-title ${bucAuto ? "open  acc-blue" : ""}`}
              onChange={() => toggleBucTab(1)}
            >
              Automatic
            </div>
            <div className={`accordion-item ${!bucAuto ? "collapsed" : ""}`}>
              <div className="accordion-content"></div>
            </div>

            <div
              onClick={() => toggleBucTab(2)}
              className={`accordion-title ${bucManual ? "open  acc-blue" : ""}`}
              onClick={() => toggleBucTab(2)}
            >
              Manual
            </div>
            <div className={`accordion-item ${!bucManual ? "collapsed" : ""}`}>
              <div className="accordion-content">
                <Row>
                <Col span={6}>
                    <span style={LABEL}>Transmission:  </span>
                  </Col>
                  <Col span={14}>
                    <Switch
                      size="large"
                      checkedChildren="On (Unmute)"
                      unCheckedChildren="Off (Mute)"
                      checked={bucTxEnabled}
                      onChange={changeTxEnabled}
                    />
                  </Col>
                  <Col span={4}>
                    <Button shape="round" onClick={ManualMute} type="primary">
                      Apply
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemControl;

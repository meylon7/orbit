import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PageHeader, Card, Col, Row, Button, Divider, Switch, message  } from "antd";
import useSessionstorage from "@rooks/use-sessionstorage";
import sysIPAddress from '../../location'
const Connectivity = () => {
   const [token, setToken, removeToken] = useSessionstorage('token');
  const [unsaved, setUnsaved, removeUnsaved] = useSessionstorage('unsavedConfigChanges');
  const [antennaIP, setAntennaIP] = useState();
  const [antennaSubnet, setAntennaSubnet] = useState();
  const [antennaGateway, setAntennaGateway] = useState();
  const [mptLink, setMptLink] = useState();
  const mptLinkDisabled = useRef(null);
  const [mptLinkPort, setMptLinkPort] = useState();
  let antennaIPAddVal ;
  
  const [PNCwinHostEnable, setPNCwinHostEnable] = useState();
  const [ARMwinHostEnable, setARMwinHostEnable] = useState();
  
  const [showMore, setShowMore] = useState();

  const [MPTLinkHostIPAddress, setMPTLinkHostIPAddress] = useState();
  const [MPTLinkHostPort, setMPTLinkHostPort] = useState();
  const [MPTLinkACUPort, setMPTLinkACUPort] = useState();
  
  const headers = {
     //'Access-Control-Origin': '*',
       'Content-Type': 'text/plain',
    Authorization: "Bearer " + token
  };
  
  var connectivitydata = [];
  const LoadPageData = () => {
    axios
    .get(
      "https://" + sysIPAddress + "/api/param/get?Parameters=ARM.IPAddr,ARM.Subnet,ARM.Gateway,PNC.WinHostEnable,ARM.WinHostEnable,ARM.MPTLinkHostIPAddress,ARM.MPTLinkHostPort,ARM.MPTLinkACUPort",
      {
        headers: {
    //'Access-Control-Origin': '*'
    'Content-Type': 'text/plain',
          Authorization: "Bearer " + token
        },
        mode: "cors",
      }
    )
    .then((res) => {
      Object.keys(res).map(function (key) {
        if (!key.startsWith("Message")) {
          connectivitydata.push(res[key]);
        }
      });
      console.log("Data: ",connectivitydata)
      setAntennaIP(connectivitydata[0]["ARM.IPAddr"] !== 'null' || connectivitydata[0]["ARM.IPAddr"] !== "" ? connectivitydata[0]["ARM.IPAddr"] : false);
      setAntennaSubnet(connectivitydata[0]["ARM.Subnet"]);
      setAntennaGateway(connectivitydata[0]["ARM.Gateway"]);
      setMptLinkPort(connectivitydata[0]["ARM.RcvPort"])
      setPNCwinHostEnable(connectivitydata[0]["PNC.WinHostEnable"] === 1 ? true : false)
      setPNCwinHostEnable(connectivitydata[0]["PNC.WinHostEnable"] === 1 ? true : false)
      setShowMore(connectivitydata[0]["PNC.WinHostEnable"] === 1 ? true : false)
      
      setMPTLinkHostIPAddress(connectivitydata[0]["ARM.MPTLinkHostIPAddress"] !== 'null' || connectivitydata[0]["ARM.MPTLinkHostIPAddress"] !== "" ? connectivitydata[0]["ARM.MPTLinkHostIPAddress"] : false);
      setMPTLinkHostPort(connectivitydata[0]["ARM.MPTLinkHostPort"])
      setMPTLinkACUPort(connectivitydata[0]["ARM.MPTLinkACUPort"])

    })
    .catch((error) => {
      console.error(error);
    });
  }
  useEffect(() => {
    LoadPageData()
    
  }, []);
 

 const connectivityFetch = () => {
 let param = {
   MessageName: "HTMLFormUpdate",
   Parameters: {
       "ARM.IPAddr":antennaIP,
       "ARM.Subnet":antennaSubnet,
       "ARM.Gateway":antennaGateway
   },
 };
 axios
 .post("https://" + sysIPAddress + "/api/param/set", param,{headers})
     .then((response) => response.data)
     .then((res) => {
       console.log(res)
       message.success('success')
       setUnsaved(true)
     }).catch((error) => {
       console.error(error);
     });
}

const mptLinkFetch = () => {
  let disabled = PNCwinHostEnable ? 1 : 0
  let ARMdisabled = disabled === 1 ? true : false
 let param = {
   MessageName: "HTMLFormUpdate",
   Parameters: {
       "PNC.WinHostEnable":parseFloat(disabled),
       "ARM.WinHostEnable":ARMdisabled,
   },
 };
 axios
 .post("https://" + sysIPAddress + "/api/param/set", param,{headers})
     .then((response) => response.data)
     .then((res) => {
       console.log(res)
       message.success('success')
     }).catch((error) => {
       console.error(error);
     });
}
 const MPTLinkSettingsFetch = () => {
  let disabled = PNCwinHostEnable ? 1 : 0
   let ARMdisabled = disabled === 1 ? true : false
   let param
 param = {
   MessageName: "HTMLFormUpdate",
   Parameters: {
        "PNC.WinHostEnable":parseFloat(disabled),
        "ARM.WinHostEnable":ARMdisabled
   },
 };
 if(showMore){
  param = {
    MessageName: "HTMLFormUpdate",
    Parameters: {
         "PNC.WinHostEnable":parseFloat(disabled),
         "ARM.WinHostEnable":ARMdisabled,
         "ARM.MPTLinkHostIPAddress":MPTLinkHostIPAddress,
         "ARM.MPTLinkHostPort":parseInt(MPTLinkHostPort),
         "ARM.MPTLinkACUPort":parseInt(MPTLinkACUPort)
    },
 }
}
 axios
 .post("https://" + sysIPAddress + "/api/param/set", param,{headers})
     .then((response) => response.data)
     .then((res) => {
       console.log(res)
       message.success('success')
       setUnsaved(true)
     }).catch((error) => {
       console.error(error);
       message.success('Failed to update MPT-Link settings')

     });
     LoadPageData()
}
  const updateInfo = () => {
    
  }
  
  const changeWinHost = (checkd) => {
    setPNCwinHostEnable(checkd)
    setARMwinHostEnable(checkd)
    setShowMore(checkd)
  }
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Connectivity" />
      </div>
      <div className="content-wrapper">
        <Divider orientation="left">Network</Divider>
        <Row gutter={16}>
          <Col span={7}>
            <Card >
              <strong>Antenna IP Address</strong>
            </Card>
            <Card >
              <strong>Antenna Subnet Mask</strong>
            </Card>
            <Card >
              <strong>Antenna Gateway</strong>
            </Card>
          </Col>
          <Col span={7}>
            <Card hoverable={true}>
              <input
                onChange={(e)=> setAntennaIP(e.target.value)}
                className="form__input"
                type="text"
                value={antennaIP}
              ></input>
            </Card>
            <Card hoverable={true}>
              <input
                onChange={(e)=> setAntennaSubnet(e.target.value)}
                className="form__input"
                type="text"
                value={antennaSubnet}
              ></input>
            </Card>
            <Card hoverable={true}>
              <input
                onChange={(e)=> setAntennaGateway(e.target.value)}
                className="form__input"
                type="text"
                value={antennaGateway}
              ></input>
            </Card>
          </Col>
          <Col span={4}>
            <Button shape="round" type="primary" size="large" onClick={connectivityFetch}>
              Apply
            </Button>
          </Col>
        </Row>
      </div>
      <div className="content-wrapper">
        <Divider orientation="left">MPT-Link</Divider>
        <div className="divider-line">&nbsp;</div>
        <Row gutter={16}>
          <Col span={1}></Col>
        <Col span={13}>
          <Switch
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
          checked={PNCwinHostEnable}
          onChange={changeWinHost}
        />
        </Col>
        <Col span={4}>
            <Button shape="round" type="primary" size="large" onClick={MPTLinkSettingsFetch}>
              Apply
            </Button>
          </Col>
          </Row>
        <br />
        <br />
        { showMore ? <span>

        <Row gutter={16}>
          <Col span={7}>
            <Card >
              <strong>IP Address</strong>
            </Card>
            <Card >
              <strong>UDP Sending Port</strong>
            </Card>
            <Card >
              <strong>UDP Receiving Port</strong>
            </Card>
          </Col>
          <Col span={7}>
            <Card hoverable={true}>
              <input
                onChange={(e)=> setMPTLinkHostIPAddress(e.target.value)}
                className="form__input"
                type="text"
                value={MPTLinkHostIPAddress}
              ></input>
            </Card>
            <Card hoverable={true}>
              <input
                onChange={(e)=> setMPTLinkHostPort(e.target.value)}
                className="form__input"
                type="text"
                value={MPTLinkHostPort}
              ></input>
            </Card>
            <Card hoverable={true}>
              <input
                onChange={(e)=> setMPTLinkACUPort(e.target.value)}
                className="form__input"
                type="text"
                value={MPTLinkACUPort}
              ></input>
            </Card>
          </Col>
          
        </Row>
        </span> : null }
      </div>
    </>
  );
};

export default Connectivity;
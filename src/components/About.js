import React, { useEffect,useState } from "react";
import axios from 'axios'
import sysIPAddress from '../location'
import useSessionstorage from "@rooks/use-sessionstorage";
import { PageHeader, Card, Col, Row } from "antd";

export default function About() {
  const [token] = useSessionstorage('token');
  const [antennaVersion,setAntennaVersion] = useState('')
  const [antennaSerial,setAntennaSerial] = useState('')
  const [armSerial,setArmSerial] = useState('')
  const [kpsuVersion,setKpsuVersion] = useState('')
  const [bucFWVersion,setBucFWVersion] = useState('')
  const [bucSerial,setBucSerial] = useState('')
  const [bucModelNumber,setBucModelNumber] = useState('')

  let aboutdata = []

  useEffect(() => {    
    fetchData();
  }, []);

  const fetchData = () => {//SDU.PosSerialNO
    axios
      .get("https://" + sysIPAddress + "/api/param/get?Parameters=PNC.Sdu.stsdat.memval.uint12,PNC.Sdu.stsdat.memval.uint13,PNC.Sdu.stsdat.memval.uint14,PNC.Sdu.stsdat.memval.uint15,SYS.DSPVersion,PNC.SWVersion.Major,PNC.SWVersion.Minor,PNC.SWVersion.Build,ARM.Serial,SYS.Version,BUC.ModelNumber,BUC.SerialNumber,BUC.FirmwareRevision", {
        headers: {
          Authorization: "Bearer " + token,
        },mode:'cors'
      })
      .then((res) => {
        Object.keys(res).map(function(key){
          if(!key.startsWith("Message")){
            aboutdata.push(res[key])
          }
        })
        console.log(aboutdata)
        setAntennaVersion((aboutdata[0]['PNC.Sdu.stsdat.memval.uint13']+ '.'+aboutdata[0]['PNC.Sdu.stsdat.memval.uint14']+ '.'+aboutdata[0]['PNC.Sdu.stsdat.memval.uint15']))
        setAntennaSerial(aboutdata[0]['PNC.Sdu.stsdat.memval.uint12'])
        setKpsuVersion((aboutdata[0]['PNC.SWVersion.Major']+ '.'+aboutdata[0]['PNC.SWVersion.Minor']+ '.'+aboutdata[0]['PNC.SWVersion.Build']))
        setArmSerial(aboutdata[0]['ARM.Serial'])
        setBucFWVersion(aboutdata[0]['BUC.FirmwareRevision'])
        setBucSerial(aboutdata[0]['BUC.SerialNumber'])
        setBucModelNumber(aboutdata[0]['BUC.ModelNumber'])
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="About" />
      </div>
      <div className="content-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Name" bordered={false}>
            <Card hoverable={true}>
                <strong>System Type</strong>
              </Card>
               <Card hoverable={true}>
                <strong>Antenna Version</strong>
              </Card>
              <Card hoverable={true}>{/* SDU.PosSerialNO is missing */}
                <strong>Antenna Serial number</strong>
              </Card>
              <Card hoverable={true}>
                <strong>KPSU Version</strong>
              </Card>
              <Card hoverable={true}>
                <strong>KPSU Serial Number</strong>
              </Card>
              <Card hoverable={true}>
                <strong>BUC Firmware Version</strong>
              </Card>
              <Card hoverable={true}>
                <strong>BUC Serial Number</strong>
              </Card>
              <Card hoverable={true}>
                <strong>BUC Model Number</strong>
              </Card>

            </Card>
          </Col>
          <Col span={8}>
            <Card title="Version" bordered={false}>
            <Card hoverable={true}> MPT-46WGX</Card>{/* System type parameter is missing*/ }
              <Card hoverable={true}>{antennaVersion}</Card>
              <Card hoverable={true}>{antennaSerial}</Card>
              <Card hoverable={true}>{kpsuVersion}</Card>
              <Card hoverable={true}>{armSerial}</Card>
              <Card hoverable={true}>{bucFWVersion}</Card>
              <Card hoverable={true}>{bucSerial}</Card>
              <Card hoverable={true}>{bucModelNumber}</Card>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
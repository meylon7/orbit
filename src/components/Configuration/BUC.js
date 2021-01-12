import React, { useState, useEffect } from "react";
import axios from "axios";

import useSessionstorage from "@rooks/use-sessionstorage";
import sysIPAddress from '../../location'
import {
  Slider,
  PageHeader,
  Button,
  Space,
  Switch,
  Col,
  Row,
  InputNumber,
  message,
  Divider,
  Select,
  Collapse
} from "antd";
import { createGlobalStyle } from "styled-components";


const BUC = () => {
 const [token, setToken, removeToken] = useSessionstorage('token');
  const [unsaved, setUnsaved, removeUnsaved] = useSessionstorage('unsavedConfigChanges');
  const { Panel } = Collapse;
  const [minElevation, setMinElevation] = useState();
  const [minElevationEn, setMinElevationEn] = useState();
  
  const [bz1En, setBZ1] = useState(false);
  const [bz1AzLo, setbz1AzLo] = useState();
  const [bz1AzHi, setbz1AzHi] = useState();
  const [bz1ElLo, setbz1ElLo] = useState();
  const [bz1ElHi, setbz1ElHi] = useState();
 
  const [bz2En, setBZ2] = useState(false);
  const [bz2AzLo, setbz2AzLo] = useState();
  const [bz2AzHi, setbz2AzHi] = useState();
  const [bz2ElLo, setbz2ElLo] = useState();
  const [bz2ElHi, setbz2ElHi] = useState();

  const [bz3En, setBZ3] = useState(false);
  const [bz3AzLo, setbz3AzLo] = useState();
  const [bz3AzHi, setbz3AzHi] = useState();
  const [bz3ElLo, setbz3ElLo] = useState();
  const [bz3ElHi, setbz3ElHi] = useState();

  const [bz4En, setBZ4] = useState(false);
  const [bz4AzLo, setbz4AzLo] = useState();
  const [bz4AzHi, setbz4AzHi] = useState();
  const [bz4ElLo, setbz4ElLo] = useState();
  const [bz4ElHi, setbz4ElHi] = useState();

  var bucdata = [];

  const [bucAttn, setBucAttn] = useState();
  const [bucAttenShow, setBucAttenShow] = useState("none");
  const [TxLo, setTxLo] = useState();

  const marks = {
    0: '0 [dB]',
    5: '5',
    10: '10',
    15: '15',
    20: '20',
    25: '25',
    31:'31[dB]'
  };
  
  const { Option } = Select;
  const headers = {
      // 'Access-Control-Origin': '*',
       'Content-Type': 'text/plain',
    Authorization: "Bearer " + token,
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    axios
      .get(
        "https://" + sysIPAddress + "/api/param/get?Parameters=BUC.TxLo,PNC.RF.BUCMuteMinElev,BUC.MuteMinElevEn,PNC.RF.RSSIThresh,BUC.MuteRSSIThreshEn,BUC.MuteNotInPosEn,PNC.Buc.MuteFlags,PNC.BlockZoEn,PNC.Block0AzLo,PNC.Block0AzHi,PNC.Block0ElLo,PNC.Block0ElHi,PNC.Block1AzLo,PNC.Block1AzHi,PNC.Block1ElLo,PNC.Block1ElHi,PNC.Block2AzLo,PNC.Block2AzHi,PNC.Block2ElLo,PNC.Block2ElHi,PNC.Block3AzLo,PNC.Block3AzHi,PNC.Block3ElLo,PNC.Block3ElHi,BUC.TxStepAttn", 
        {
          headers: {
            Authorization: "Bearer " + token,
          },mode:'cors'
        }
      )
      .then((res) => {
        Object.keys(res).map(function (key) {
          if (!key.startsWith("Message")) {
            bucdata.push(res[key]);
          }
          console.log(bucdata);
       
          setMinElevation(parseFloat(bucdata[0]["PNC.RF.BUCMuteMinElev"]).toFixed(3))
          setMinElevationEn(bucdata[0]["BUC.MuteMinElevEn"])
          
         
          var BlockZoneEn = bucdata[0]["PNC.BlockZoEn"]
          setBZ1(
            (BlockZoneEn&1) !== 0? true : false
            );
          setbz1AzLo(parseFloat(bucdata[0]["PNC.Block0AzLo"]).toFixed(3))
          setbz1AzHi(parseFloat(bucdata[0]["PNC.Block0AzHi"]).toFixed(3))
          setbz1ElLo(parseFloat(bucdata[0]["PNC.Block0ElLo"]).toFixed(3))
          setbz1ElHi(parseFloat(bucdata[0]["PNC.Block0ElHi"]).toFixed(3))
         
          setBZ2(
            (BlockZoneEn&2) !== 0? true : false
            );
          setbz2AzLo(parseFloat(bucdata[0]["PNC.Block1AzLo"]).toFixed(3))
          setbz2AzHi(parseFloat(bucdata[0]["PNC.Block1AzHi"]).toFixed(3))
          setbz2ElLo(parseFloat(bucdata[0]["PNC.Block1ElLo"]).toFixed(3))
          setbz2ElHi(parseFloat(bucdata[0]["PNC.Block1ElHi"]).toFixed(3))
        
          setBZ3(
            (BlockZoneEn&4) !== 0? true : false
            );
          setbz3AzLo(parseFloat(bucdata[0]["PNC.Block2AzLo"]).toFixed(3))
          setbz3AzHi(parseFloat(bucdata[0]["PNC.Block2AzHi"]).toFixed(3))
          setbz3ElLo(parseFloat(bucdata[0]["PNC.Block2ElLo"]).toFixed(3))
          setbz3ElHi(parseFloat(bucdata[0]["PNC.Block2ElHi"]).toFixed(3))
        
          setBZ4(
            (BlockZoneEn&8) !== 0? true : false
            );
          setbz4AzLo(parseFloat(bucdata[0]["PNC.Block3AzLo"]).toFixed(3))
          setbz4AzHi(parseFloat(bucdata[0]["PNC.Block3AzHi"]).toFixed(3))
          setbz4ElLo(parseFloat(bucdata[0]["PNC.Block3ElLo"]).toFixed(3))
          setbz4ElHi(parseFloat(bucdata[0]["PNC.Block3ElHi"]).toFixed(3))
       
          setBucAttn(parseFloat(bucdata[0]["BUC.TxStepAttn"]).toFixed(3))
          setTxLo(parseFloat(bucdata[0]["BUC.TxLo"]).toFixed(1))
          if(bucdata[0]["BUC.TxLo"] !== null && bucdata[0]["BUC.TxLo"] !== undefined){
            if(parseFloat(bucdata[0]["BUC.TxLo"]).toFixed(1) >= 29){
              setBucAttenShow("block")
            }else{
              setBucAttenShow("none")
            }
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
      return bucdata;
  };
  
  const postConditionalMute = () => {
    var BlockZoneEn = (bz1En === true ? 1 : 0) | (bz2En === true ? 2: 0) | (bz3En === true ? 4: 0) | (bz4En === true? 8: 0)
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "PNC.RF.BUCMuteMinElev": parseFloat(minElevation),
        "BUC.MuteMinElevEn": minElevationEn,
        "PNC.BlockZoEn": parseFloat(BlockZoneEn),
        "PNC.Block0AzLo": parseFloat(bz1AzLo),
        "PNC.Block0AzHi": parseFloat(bz1AzHi),
        "PNC.Block0ElLo": parseFloat(bz1ElLo),
        "PNC.Block0ElHi": parseFloat(bz1ElHi),
        "PNC.Block1AzLo": parseFloat(bz2AzLo),
        "PNC.Block1AzHi": parseFloat(bz2AzHi),
        "PNC.Block1ElLo": parseFloat(bz2ElLo),
        "PNC.Block1ElHi": parseFloat(bz2ElHi),
        "PNC.Block2AzLo": parseFloat(bz3AzLo),
        "PNC.Block2AzHi": parseFloat(bz3AzHi),
        "PNC.Block2ElLo": parseFloat(bz3ElLo),
        "PNC.Block2ElHi": parseFloat(bz3ElHi),
        "PNC.Block3AzLo": parseFloat(bz4AzLo),
        "PNC.Block3AzHi": parseFloat(bz4AzHi),
        "PNC.Block3ElLo": parseFloat(bz4ElLo),
        "PNC.Block3ElHi": parseFloat(bz4ElHi),
      },
  };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        console.log("Post", response.data.Parameters);
       // getConditionalMuteOk(response.data.Parameters);
        fetchData()
        console.log(unsaved)
        setUnsaved(true);
        console.log(unsaved)
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getConditionalMuteOk = (param) => {
    let data = param;
    axios
      .get("https://" + sysIPAddress + "/api/param/get?", param, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log("Get", res.data);
        message.success({
          content:
            "The system updated with: PNC.RF.BUCMuteMinElev: " +
            data["PNC.RF.BUCMuteMinElev"] +
            " and BUC.MuteMinElevEn: " +
            data["BUC.MuteMinElevEn"] +
            " and PNC.RF.RSSIThresh: " +
            data["PNC.RF.RSSIThresh"] +
            " and BUC.MuteRSSIThreshEn: " +
            data["BUC.MuteRSSIThreshEn"],
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });

  };
  const postBucAttenuation = () => {
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "BUC.TxStepAttn": parseFloat(bucAttn),
      },
  };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, 
      {  headers: {
        Authorization: "Bearer " + token,
      },mode:'cors' })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        fetchData();
       setUnsaved(true)

      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getBucAttenuationOk = (param) => {
    let data = param;
    axios
      .get("https://" + sysIPAddress + "/api/param/get?", param, {
        headers: {
          'Access-Control-Origin': '*',
          //'Content-Type': 'text/plain',
               Authorization: "Bearer " + token
             },mode:'cors'
      })
      .then((res) => {
        console.log("Get", res.data);
        message.success({
          content:
            "The system updated with: BUC.TxStepAttn: " +
            data["BUC.TxStepAttn"] ,
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });

  };
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Conditional Mute" />
      </div>
      <div className="content-wrapper">
        <Row>
          <Col span={8}>
            <Space>
              <Switch
                size="large"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={minElevationEn}
                onChange={() => setMinElevationEn(!minElevationEn)}
              />{" "}
              Min Elevation [deg]
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              {" "}
              <InputNumber
                id="minElevation"
                min={0}
                max={90}
                step={0.1}
                onChange={(e) => setMinElevation(e)}
                value={minElevation}
              />
            </Space>
          </Col>

          <Col span={8}>
            <Space>
              <Button type="primary" shape="round" size="large" onClick={postConditionalMute}>
                Apply
              </Button>
            </Space>
          </Col>
        </Row>
       
        <Divider />
        <Row id="bz1 and bz2">
          <Col span={2}>
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={bz1En}
                onChange={() => setBZ1(!bz1En)}
              />{" "}
          </Col>
          <Col span={6}>
              <Collapse accordion>
                <Panel header="Block Zone 1" key="1">
                  <Row>
                    <Col span={1}> Az </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz1AzLo"
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz1AzLo(e)}
                          value={bz1AzLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz1AzHi"
                          padding={10}
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz1AzHi(e)}
                          value={bz1AzHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={1}> El   </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz1ElLo"
                          min={0}
                          max={90}
                          step={0.1}
                          onChange={(e) => setbz1ElLo(e)}
                          value={bz1ElLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz1ElHi"
                          min={0}
                          max={90}
                          step={0.1}
                          //disabled={bz1ElHi}
                          onChange={(e) => setbz1ElHi(e)}
                          value={bz1ElHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
          </Col>
          <Col span={2}></Col>
          <Col span={2}>
            <Space>
              <Switch
                size="large"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={bz2En}
                onChange={() => setBZ2(!bz2En)}
              />
            </Space>
          </Col>
          <Col span={6}>
            <Collapse accordion>
              <Panel header="Block Zone 2" key="1">
                  <Row>
                    <Col span={1}> Az </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz2AzLo"
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz2AzLo(e)}
                          value={bz2AzLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz2AzHi"
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz2AzHi(e)}
                          value={bz2AzHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={1}> El  </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz2ElLo"
                          min={0}
                          max={90}
                          step={0.1}
                          onChange={(e) => setbz2ElLo(e)}
                          value={bz2ElLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz2ElHi"
                          min={0}
                          max={90}
                          step={0.1}
                          onChange={(e) => setbz2ElHi(e)}
                          value={bz2ElHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
          </Col>
        </Row>
        <Row>
          <Col span={24}></Col>
        </Row>
        <Row id="bz3 and bz4">
          <Col span={2}>
              <Switch
                size="large"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={bz3En}
                onChange={() => setBZ3(!bz3En)}
              />
          </Col>
          <Col span={6}>
            <Collapse accordion>
            <Panel header="Block Zone 3" key="1">
                  <Row>
                    <Col span={1}> Az  </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz3AzLo"
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz3AzLo(e)}
                          value={bz3AzLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz3AzHi"
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz3AzHi(e)}
                          value={bz3AzHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={1}> El </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz3ElLo"
                          min={0}
                          max={90}
                          step={0.1}
                          onChange={(e) => setbz3ElLo(e)}
                          value={bz3ElLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz3ElHi"
                          min={0}
                          max={90}
                          step={0.1}
                          onChange={(e) => setbz3ElHi(e)}
                          value={bz3ElHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
          </Col>
          <Col span={2}></Col>
          <Col span={2}>
            <Space>
              <Switch
                size="large"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={bz4En}
                onChange={() => setBZ4(!bz4En)}
              />
            </Space>
          </Col>
          <Col span={6}>
            <Collapse accordion>
            <Panel header="Block Zone 4" key="1">
                  <Row>
                    <Col span={1}> Az     </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz4AzLo"
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz4AzLo(e)}
                          value={bz4AzLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz4AzHi"
                          min={0}
                          max={360}
                          step={0.1}
                          onChange={(e) => setbz4AzHi(e)}
                          value={bz4AzHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={1}> El </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz4ElLo"
                          min={0}
                          max={90}
                          step={0.1}
                          onChange={(e) => setbz4ElLo(e)}
                          value={bz4ElLo}
                        ></InputNumber>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Space>
                        {" "}
                        <InputNumber
                          id="bz4ElHi"
                          min={0}
                          max={90}
                          step={0.1}
                          onChange={(e) => setbz4ElHi(e)}
                          value={bz4ElHi}
                        ></InputNumber>
                      </Space>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>

          </Col>
        </Row>
        <Row  id="canvas">
        <canvas id="myCanvas" width="200" height="100" style={{width: '200', height: '200', border: '1px', color: 'black'}}></canvas>
        </Row>
      </div>     
      <div className="content-wrapper" style={{ display: bucAttenShow }}>
        <PageHeader className="site-page-header" title="BUC Attenuation" />
      </div>
      <div className="content-wrapper" style={{ display: bucAttenShow }}>
        <PageHeader className="site-page"/>
        <Row>
          <Col span={2}></Col>
        <Col span={12}>
          <Slider
            min={0}
            max={31}
            step={0.25}
            tooltipVisible
            marks={marks}
            onChange={(e) => setBucAttn(e)}
            //value={typeof bucAttn === 'number' ? bucAttn : 0}
            value={bucAttn}
          />
        </Col>
        
        <Col span={4}>
          <InputNumber
            min={0}
            max={31}
            step={0.25}
            style={{ margin: '0 16px' }}
            value={bucAttn}
            onChange={(e) => setBucAttn(e)}

          />
        </Col>
        <Col span={1}>
        <Space>
              <Button type="primary" shape="round" size="large" onClick={postBucAttenuation}>
                Apply
              </Button>
            </Space>
        </Col>

      </Row>
      </div>
   
    </>
  );
};

export default BUC;
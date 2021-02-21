import React, { useState, useEffect } from "react";
import axios from "axios";
import BackImage from "../../components/pic/diagram.jpg";
import useSessionstorage from "@rooks/use-sessionstorage";
import sysIPAddress from "../../location";
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
  Collapse,
} from "antd";
import { Stage, Layer, Rect } from "react-konva";

const BUC = () => {
  const LABEL = {
    fontWeight: "bold",
    color: "#034f84",
    fontWeight: "600",
    fontSize: "16px",
  };
  const StageImage = {
    backgroundImage: `url(${BackImage})`,
    margin: "0 auto",
    backgroundRepeat: "no-repeat",
    paddingTop: "65px",
    paddingRight: "124px",
    paddingLeft: "36px",
    paddingBottom: "35px",
    height: "276px",
    width: "879px",
  };
  const [token] = useSessionstorage("token");
  const [unsaved, setUnsaved] = useSessionstorage("unsavedConfigChanges");
  const [topButtonColor, setTopButtonColor] = useSessionstorage("color");
  const { Panel } = Collapse;
  const [minElevation, setMinElevation] = useState();
  const [minElevationEn, setMinElevationEn] = useState();
  const stageHeight = 180;
  const stageWidth = 720;
  const [bz1En, setBZ1] = useState(false);
  const [block1Az1, setBlock1Az1] = useState();
  const [block1Az2, setBlock1Az2] = useState();
  const [block1El1, setBlock1El1] = useState();
  const [block1El2, setBlock1El2] = useState();

  const [bz2En, setBZ2] = useState(false);
  const [block2Az1, setBlock2Az1] = useState();
  const [block2Az2, setBlock2Az2] = useState();
  const [block2El1, setBlock2El1] = useState();
  const [block2El2, setBlock2El2] = useState();

  const [bz3En, setBZ3] = useState(false);
  const [block3Az1, setBlock3Az1] = useState();
  const [block3Az2, setBlock3Az2] = useState();
  const [block3El1, setBlock3El1] = useState();
  const [block3El2, setBlock3El2] = useState();

  const [bz4En, setBZ4] = useState(false);
  const [bblock4Az1, setBlock4Az1] = useState();
  const [block4Az2, setBlock4Az2] = useState();
  const [block4El1, setBlock4El1] = useState();
  const [block4El2, setBlock4El2] = useState();
  // drawing zone
  const [blueRect, setBlueRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [redRect, setRedRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [perpelRect, setPerpelRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [greenRect, setGreenRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  //////////////
  var bucdata = [];

  const [bucAttn, setBucAttn] = useState();
  const [bucAttenShow, setBucAttenShow] = useState("none");
  const [TxLo, setTxLo] = useState();

  const marks = {
    0: "0 [dB]",
    5: "5",
    10: "10",
    15: "15",
    20: "20",
    25: "25",
    31: "31[dB]",
  };

  const { Option } = Select;
  const headers = {
    // 'Access-Control-Origin': '*',
    "Content-Type": "text/plain",
    Authorization: "Bearer " + token,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(
        "https://" +
          sysIPAddress +
          "/api/param/get?Parameters=BUC.TxLo,PNC.RF.BUCMuteMinElev,BUC.MuteMinElevEn,PNC.RF.RSSIThresh,BUC.MuteRSSIThreshEn,BUC.MuteNotInPosEn,PNC.Buc.MuteFlags,PNC.BlockZoEn,PNC.Block0AzLo,PNC.Block0AzHi,PNC.Block0ElLo,PNC.Block0ElHi,PNC.Block1AzLo,PNC.Block1AzHi,PNC.Block1ElLo,PNC.Block1ElHi,PNC.Block2AzLo,PNC.Block2AzHi,PNC.Block2ElLo,PNC.Block2ElHi,PNC.Block3AzLo,PNC.Block3AzHi,PNC.Block3ElLo,PNC.Block3ElHi,BUC.TxStepAttn",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          mode: "cors",
        }
      )
      .then((res) => {
        Object.keys(res).map(function (key) {
          if (!key.startsWith("Message")) {
            bucdata.push(res[key]);
          }
          console.log(bucdata);

          setMinElevation(
            parseFloat(bucdata[0]["PNC.RF.BUCMuteMinElev"]).toFixed(3)
          );
          setMinElevationEn(bucdata[0]["BUC.MuteMinElevEn"]);

          var BlockZoneEn = bucdata[0]["PNC.BlockZoEn"];
          setBZ1((BlockZoneEn & 1) !== 0 ? true : false);
          setBlock1Az1(parseFloat(bucdata[0]["PNC.Block0AzLo"]).toFixed(3));
          setBlock1Az2(parseFloat(bucdata[0]["PNC.Block0AzHi"]).toFixed(3));
          setBlock1El1(parseFloat(bucdata[0]["PNC.Block0ElLo"]).toFixed(3));
          setBlock1El2(parseFloat(bucdata[0]["PNC.Block0ElHi"]).toFixed(3));

          setBZ2((BlockZoneEn & 2) !== 0 ? true : false);
          setBlock2Az1(parseFloat(bucdata[0]["PNC.Block1AzLo"]).toFixed(3));
          setBlock2Az2(parseFloat(bucdata[0]["PNC.Block1AzHi"]).toFixed(3));
          setBlock2El1(parseFloat(bucdata[0]["PNC.Block1ElLo"]).toFixed(3));
          setBlock2El2(parseFloat(bucdata[0]["PNC.Block1ElHi"]).toFixed(3));

          setBZ3((BlockZoneEn & 4) !== 0 ? true : false);
          setBlock3Az1(parseFloat(bucdata[0]["PNC.Block2AzLo"]).toFixed(3));
          setBlock3Az2(parseFloat(bucdata[0]["PNC.Block2AzHi"]).toFixed(3));
          setBlock3El1(parseFloat(bucdata[0]["PNC.Block2ElLo"]).toFixed(3));
          setBlock3El2(parseFloat(bucdata[0]["PNC.Block2ElHi"]).toFixed(3));

          setBZ4((BlockZoneEn & 8) !== 0 ? true : false);
          setBlock4Az1(parseFloat(bucdata[0]["PNC.Block3AzLo"]).toFixed(3));
          setBlock4Az2(parseFloat(bucdata[0]["PNC.Block3AzHi"]).toFixed(3));
          setBlock4El1(parseFloat(bucdata[0]["PNC.Block3ElLo"]).toFixed(3));
          setBlock4El2(parseFloat(bucdata[0]["PNC.Block3ElHi"]).toFixed(3));

          setBucAttn(parseFloat(bucdata[0]["BUC.TxStepAttn"]).toFixed(3));
          setTxLo(parseFloat(bucdata[0]["BUC.TxLo"]).toFixed(1));
          if (
            bucdata[0]["BUC.TxLo"] !== null &&
            bucdata[0]["BUC.TxLo"] !== undefined
          ) {
            if (parseFloat(bucdata[0]["BUC.TxLo"]).toFixed(1) >= 29) {
              setBucAttenShow("block");
            } else {
              setBucAttenShow("none");
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
    var BlockZoneEn =
      (bz1En === true ? 1 : 0) |
      (bz2En === true ? 2 : 0) |
      (bz3En === true ? 4 : 0) |
      (bz4En === true ? 8 : 0);
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "PNC.RF.BUCMuteMinElev": parseFloat(minElevation),
        "BUC.MuteMinElevEn": minElevationEn,
        "PNC.BlockZoEn": parseFloat(BlockZoneEn),
        "PNC.Block0AzLo": parseFloat(block1Az1),
        "PNC.Block0AzHi": parseFloat(block1Az2),
        "PNC.Block0ElLo": parseFloat(block1El1),
        "PNC.Block0ElHi": parseFloat(block1El2),
        "PNC.Block1AzLo": parseFloat(block2Az1),
        "PNC.Block1AzHi": parseFloat(block2Az2),
        "PNC.Block1ElLo": parseFloat(block2El1),
        "PNC.Block1ElHi": parseFloat(block2El2),
        "PNC.Block2AzLo": parseFloat(block3Az1),
        "PNC.Block2AzHi": parseFloat(block3Az2),
        "PNC.Block2ElLo": parseFloat(block3El1),
        "PNC.Block2ElHi": parseFloat(block3El2),
        "PNC.Block3AzLo": parseFloat(bblock4Az1),
        "PNC.Block3AzHi": parseFloat(block4Az2),
        "PNC.Block3ElLo": parseFloat(block4El1),
        "PNC.Block3ElHi": parseFloat(block4El2),
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/param/set", param, { headers })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        // getConditionalMuteOk(response.data.Parameters);
        setUnsaved(true);
        setTopButtonColor("red");
        fetchData();
        console.log(unsaved);
        console.log(unsaved);
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
      .post("https://" + sysIPAddress + "/api/param/set", param, {
        headers: {
          Authorization: "Bearer " + token,
        },
        mode: "cors",
      })
      .then((response) => {
        console.log("Post", response.data.Parameters);
        setUnsaved(true);
        setTopButtonColor("red");

        fetchData();
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
          "Access-Control-Origin": "*",
          //'Content-Type': 'text/plain',
          Authorization: "Bearer " + token,
        },
        mode: "cors",
      })
      .then((res) => {
        console.log("Get", res.data);
        message.success({
          content:
            "The system updated with: BUC.TxStepAttn: " +
            data["BUC.TxStepAttn"],
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
  const drawRect = (A1, E1, A2, E2, rect) => {
    let X = A1;
    let Y = E1 * 2 - 180;
    let rectWidth = 2 * (A2 - A1); // (in px)
    let rectHeight = 2 * (E2 - E1); // (in px)
    switch (rect) {
      case 1:
        setBlueRect({ x: X, y: Y, w: rectWidth, h: rectHeight }); // {x:0,y:0,w:0,h:0}
        break;
      case 2:
        setPerpelRect({ x: X, y: Y, w: rectWidth, h: rectHeight });
        break;
      case 3:
        setGreenRect({ x: X, y: Y, w: rectWidth, h: rectHeight });
        break;
      case 4:
        setRedRect({ x: X, y: Y, w: rectWidth, h: rectHeight });
        break;
    }
  };
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Conditional Mute" />
      </div>{" "}
      <div className="content-wrapper">
        <Divider orientation="left" style={LABEL}>
          {" "}
          General definitions{" "}
        </Divider>{" "}
        <div className="divider-line"> & nbsp; </div>{" "}
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
              Minimum Elevation{" "}
            </Space>{" "}
          </Col>{" "}
          <Col span={12}>
            <Space>
              {" "}
              <InputNumber
                id="minElevation"
                min={0}
                max={90}
                step={0.1}
                onChange={(e) => setMinElevation(e)}
                value={minElevation}
              />{" "}
              [deg]{" "}
            </Space>{" "}
          </Col>{" "}
          <Col span={4}>
            <Space>
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={postConditionalMute}
              >
                Apply{" "}
              </Button>{" "}
            </Space>{" "}
          </Col>{" "}
        </Row>{" "}
        <div className="divider-line"> & nbsp; </div>{" "}
        <Divider orientation="left" style={LABEL}>
          {" "}
          Blockage Zones definition{" "}
        </Divider>{" "}
        <div className="divider-line"> & nbsp; </div>{" "}
        <Row id="bz1 and bz2">
          <Col span={2}>
            <Switch
              checkedChildren="On"
              unCheckedChildren="Off"
              checked={bz1En}
              onChange={() => setBZ1(!bz1En)}
            />{" "}
          </Col>{" "}
          <Col span={9}>
            <Collapse>
              <Panel header="Block Zone 1" key="1">
                <Row>
                  <Col span={2}>
                    {" "}
                    Az <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block1Az1"
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock1Az1(e)}
                        value={block1Az1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    Az <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block2Az2"
                        padding={10}
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock2Az2(e)}
                        value={block2Az2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
                <div className="divider-line"> & nbsp; </div>{" "}
                <Row>
                  <Col span={2}>
                    {" "}
                    El <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block1El1"
                        min={0}
                        max={90}
                        step={0.1}
                        onChange={(e) => setBlock1El1(e)}
                        value={block1El1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    El <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block1El2"
                        min={0}
                        max={90}
                        step={0.1}
                        //disabled={block1El2}
                        onChange={(e) => setBlock1El2(e)}
                        value={block1El2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
                <span style={{ marginLeft: "86%" }}>
                  {" "}
                  <Button
                    onClick={() =>
                      drawRect(block1Az1, block1El1, block2Az1, block2El2, 1)
                    }
                  >
                    {" "}
                    Draw{" "}
                  </Button>{" "}
                </span>{" "}
              </Panel>{" "}
            </Collapse>{" "}
          </Col>{" "}
          <Col span={1}> </Col>{" "}
          <Col span={2}>
            <Space>
              <Switch
                size="large"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={bz2En}
                onChange={() => setBZ2(!bz2En)}
              />{" "}
            </Space>{" "}
          </Col>{" "}
          <Col span={9}>
            <Collapse accordion>
              <Panel header="Block Zone 2" key="1" className="perpel">
                <Row>
                  <Col span={2}>
                    {" "}
                    Az <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block2Az1"
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock2Az1(e)}
                        value={block2Az1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    Az <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block2Az2"
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock2Az2(e)}
                        value={block2Az2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
                <div className="divider-line"> & nbsp; </div>{" "}
                <Row>
                  <Col span={2}>
                    {" "}
                    El <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block2El1"
                        min={0}
                        max={90}
                        step={0.1}
                        onChange={(e) => setBlock2El1(e)}
                        value={block2El1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    El <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block2El2"
                        min={0}
                        max={90}
                        step={0.1}
                        onChange={(e) => setBlock2El2(e)}
                        value={block2El2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
                <span style={{ marginLeft: "86%" }}>
                  {" "}
                  <Button
                    onClick={() =>
                      drawRect(block1Az1, block1El1, block2Az1, block2Az2, 1)
                    }
                  >
                    {" "}
                    Draw{" "}
                  </Button>{" "}
                </span>{" "}
              </Panel>{" "}
            </Collapse>{" "}
          </Col>{" "}
        </Row>{" "}
        <div className="divider-line"> & nbsp; </div>{" "}
        <div className="divider-line"> & nbsp; </div>{" "}
        <Row id="bz3 and bz4">
          <Col span={2}>
            <Switch
              size="large"
              checkedChildren="On"
              unCheckedChildren="Off"
              checked={bz3En}
              onChange={() => setBZ3(!bz3En)}
            />{" "}
          </Col>{" "}
          <Col span={9}>
            <Collapse accordion>
              <Panel header="Block Zone 3" key="1" className="green">
                <Row>
                  <Col span={2}>
                    {" "}
                    Az <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block3Az1"
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock3Az1(e)}
                        value={block3Az1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    Az <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block3Az2"
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock3Az2(e)}
                        value={block3Az2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
                <div className="divider-line"> & nbsp; </div>{" "}
                <Row>
                  <Col span={2}>
                    {" "}
                    El <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block3El1"
                        min={0}
                        max={90}
                        step={0.1}
                        onChange={(e) => setBlock3El1(e)}
                        value={block3El1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    El <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block3El2"
                        min={0}
                        max={90}
                        step={0.1}
                        onChange={(e) => setBlock3El2(e)}
                        value={block3El2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
              </Panel>{" "}
            </Collapse>{" "}
          </Col>{" "}
          <Col span={1}> </Col>{" "}
          <Col span={2}>
            <Space>
              <Switch
                size="large"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={bz4En}
                onChange={() => setBZ4(!bz4En)}
              />{" "}
            </Space>{" "}
          </Col>{" "}
          <Col span={9}>
            <Collapse accordion>
              <Panel header="Block Zone 4" key="1" className="red">
                <Row>
                  <Col span={2}>
                    {" "}
                    Az <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="bblock4Az1"
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock4Az1(e)}
                        value={bblock4Az1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    Az <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block4Az2"
                        min={0}
                        max={360}
                        step={0.1}
                        onChange={(e) => setBlock4Az2(e)}
                        value={block4Az2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
                <div className="divider-line"> & nbsp; </div>{" "}
                <Row>
                  <Col span={2}>
                    {" "}
                    El <sub> 1 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block4El1"
                        min={0}
                        max={90}
                        step={0.1}
                        onChange={(e) => setBlock4El1(e)}
                        value={block4El1}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                  <Col span={2}> </Col>{" "}
                  <Col span={2}>
                    {" "}
                    El <sub> 2 </sub>{" "}
                  </Col>{" "}
                  <Col span={8}>
                    <Space>
                      {" "}
                      <InputNumber
                        id="block4El2"
                        min={0}
                        max={90}
                        step={0.1}
                        onChange={(e) => setBlock4El2(e)}
                        value={block4El2}
                      ></InputNumber>{" "}
                    </Space>{" "}
                  </Col>{" "}
                </Row>{" "}
              </Panel>{" "}
            </Collapse>{" "}
          </Col>{" "}
        </Row>{" "}
        <Row id="canvas">
          <div style={StageImage}>
            <div style={{ height: "180px", width: "720px" }}>
              <Stage width={stageWidth} height={stageHeight}>
                <Layer>
                  <Rect x={30} y={20} width={200} height={100} fill="#0782ED" />
                  <Rect
                    x={blueRect.x}
                    y={blueRect.y}
                    width={blueRect.rectWidth}
                    height={blueRect.rectHeight}
                    fill="#1890ff"
                  />
                  <Rect
                    x={320}
                    y={250}
                    width={200}
                    height={100}
                    fill="#0746ED"
                  />
                  <Rect
                    x={520}
                    y={150}
                    width={200}
                    height={100}
                    fill="#73A6F7"
                  />
                </Layer>{" "}
              </Stage>{" "}
            </div>{" "}
          </div>{" "}
        </Row>{" "}
      </div>{" "}
      <div className="content-wrapper" style={{ display: bucAttenShow }}>
        <PageHeader className="site-page-header" title="BUC Attenuation" />
      </div>{" "}
      <div className="content-wrapper" style={{ display: bucAttenShow }}>
        <PageHeader className="site-page" />
        <Row>
          <Col span={2}> </Col>{" "}
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
            />{" "}
          </Col>{" "}
          <Col span={4}>
            <InputNumber
              min={0}
              max={31}
              step={0.25}
              style={{ margin: "0 16px" }}
              value={bucAttn}
              onChange={(e) => setBucAttn(e)}
            />{" "}
          </Col>{" "}
          <Col span={1}>
            <Space>
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={postBucAttenuation}
              >
                Apply{" "}
              </Button>{" "}
            </Space>{" "}
          </Col>{" "}
        </Row>{" "}
      </div>{" "}
    </>
  );
};

export default BUC;

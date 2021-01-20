import React, { useState, useEffect } from "react";
import useSessionstorage from "@rooks/use-sessionstorage";
import sysIPAddress from "../../location";
import { PageHeader, Button } from "antd";
import Message from "../Message";
import Progress from "../Progress";
import axios from "axios";
import FileUploaded from "./FileUploader";
import { v4 as uuidv4 } from "uuid";
import { ProgressBar, Jumbotron, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SWUpdate = () => {
  const [activeSW, setActiveSW] = useState(false);
  const [token, setToken, removeToken] = useSessionstorage("token");
  const [version, setVersion] = useState();
  const [stbyversion, setStbyversion] = useState();
  const [name, setName] = useState("");
  var sysversion = [];
  const chunkSize = 1048576 * 25; //  *3 is 3MB

  const [showProgress, setShowProgress] = useState(false);
  const [ifFileSelected, setIfFileSelected] = useState(false);
  const [ifStbyVersionUploaded, setIfStbyVersionUploaded] = useState(false);
  const [counter, setCounter] = useState(1);
  const [fileToBeUpload, setFileToBeUpload] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  //////////////
  // const [file, setFile] = useState('');
  // const [filename, setFilename] = useState('Choose File');
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  ///////////////
  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0);
  const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize);
  const [progress, setProgress] = useState(0);
  const [fileGuid, setFileGuid] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const progressInstance = (
    <ProgressBar animated now={progress} label={`${progress}%`} />
  );
  let activeVersion;
  let standbyVersion;
  const headers = {
    "Access-Control-Origin": "*",
    //'Content-Type': 'text/plain',
    Authorization: "Bearer " + token,
  };
  const LoadVersions = () => {
    // setInterval(() => {
    axios
      .get(
        "https://" +
          sysIPAddress +
          "/api/param/get?Parameters=SYS.Version,SYS.StbyVersion",
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
            sysversion.push(res[key]);
          }
        });
        activeVersion =
          sysversion[0]["SYS.Version"] !== null
            ? sysversion[0]["SYS.Version"]
            : "N/A";
        standbyVersion =
          sysversion[0]["SYS.StbyVersion"] !== null
            ? sysversion[0]["SYS.StbyVersion"]
            : "N/A";
        console.log('sysversion[0]["SYS.Version"] = ', activeVersion);
        console.log('sysversion[0]["SYS.StbyVersion"] = ', standbyVersion);
        setVersion(activeVersion);
        setStbyversion(standbyVersion);
        console.log("version = ", version);
        console.log("stbyversion = ", stbyversion);

        if (standbyVersion !== "N/A") {
          setIfStbyVersionUploaded(true);
        } else {
          setIfStbyVersionUploaded(false);
        }
      });
    // }, 2000);
  };

  useEffect(() => {
    LoadVersions();
  }, []);

  useEffect(() => {
    if (fileSize > 0) {
      fileUpload(counter);
    }
  }, [fileToBeUpload, progress]);

  const selectFile = (e) => {
    const _file = e.target.files[0];
    setSelectedFile(_file);
    if (_file !== undefined) {
      setIfFileSelected(true);
    } else {
      setIfFileSelected(false);
    }
  };
  const getFileContext = () => {
    resetChunkProperties();
    const _file = selectedFile;
    // setFileSize(_file.size)
    setFileSize(selectedFile.size);
    const _totalCount =
      _file.size % chunkSize == 0
        ? _file.size / chunkSize
        : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
    setChunkCount(_totalCount);
    setFileToBeUpload(_file);
    const _fileID = uuidv4() + "." + _file.name.split(".").pop();
    setFileGuid(_fileID);
  };

  const resetChunkProperties = () => {
    setShowProgress(true);
    setProgress(0);
    setCounter(1);
    setBeginingOfTheChunk(0);
    setEndOfTheChunk(chunkSize);
  };

  const fileUpload = () => {
    setCounter(counter + 1);
    if (counter <= chunkCount) {
      setFileToBeUpload(selectedFile);

      var chunk = fileToBeUpload;
      // var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
      uploadChunk(chunk);
    }
  };

  const uploadChunk = async () => {
    try {
      // debugger
      setIfFileSelected(false);
      setIfStbyVersionUploaded(false);
      let _chunk = fileToBeUpload;
      axios
        .post("https://" + sysIPAddress + "/api/files/update.tar", _chunk, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 600000);
          },
        })
        .then((res) => {
          console.log("uploadChunk data: ", res.data);
          setMessage(
            "File is uploaded, start writing...It may take several minutes"
          );
          setStbyversion("N/A");
          setUploadPercentage(0);
          const timetotal = 420000; //7 minutes
          let timeleft = 420000;
          setInterval(() => {
            if (timeleft <= 0) {
              clearInterval();
              setMessage("Standby version is installed successfully");
              setUploadPercentage(100);
            } else {
              setUploadPercentage(
                parseInt(100 - Math.floor((timeleft * 100) / timetotal))
              );
              timeleft -= 1000;
              axios
                .get(
                  "https://" +
                    sysIPAddress +
                    "/api/param/get?Parameters=SYS.Version,SYS.StbyVersion",
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
                      sysversion.push(res[key]);
                    }
                  });
                  activeVersion =
                    sysversion[0]["SYS.Version"] !== null
                      ? sysversion[0]["SYS.Version"]
                      : "N/A";
                  standbyVersion =
                    sysversion[0]["SYS.StbyVersion"] !== null
                      ? sysversion[0]["SYS.StbyVersion"]
                      : "N/A";
                  console.log('sysversion[0]["SYS.Version"] = ', activeVersion);
                  console.log(
                    'sysversion[0]["SYS.StbyVersion"] = ',
                    standbyVersion
                  );
                  setVersion(activeVersion);
                  setStbyversion(standbyVersion);
                  console.log("version = ", version);
                  console.log("stbyversion = ", stbyversion);

                  if (standbyVersion !== "N/A") {
                    setIfStbyVersionUploaded(true);
                  } else {
                    setIfStbyVersionUploaded(false);
                  }
                });
            }
          }, 1000);
        });
    } catch (error) {
      debugger;
      console.log("error", error);
    }
  };


  const TD = {
    width: "200px",
  };


  const activateForm = () => {
    if (
      window.confirm(
        "After the activation the system will be rebooted automatically."
      )
    ) {
      const param = {
        MessageName: "HTMLFormUpdate",
        Parameters: {
          "SYS.ActivateStbyVersion": true,
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
          console.log("Version has been activated successfully");
        })
        .catch((err) => alert("Version activation Error"));
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="SW Update" />
      </div>
      <div className="content-wrapper">
        <div style={{ padding: "30px" }}>
          <table>
            <thead></thead>
            <tbody>
              <tr style={{ color: "rgb(3, 79, 132)" }}>
                <td style={TD}>Active SW Version</td>
                <td>
                  <label>
                    {" "}
                    <strong>{version}</strong>
                  </label>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr style={{ height: "30px" }}>
                <td colSpan="4"></td>
              </tr>
              <tr>
                <td style={TD}>Standby SW Version</td>
                <td>
                  <label>
                    {" "}
                    <strong>{stbyversion}</strong>
                  </label>
                </td>
                <td style={TD}></td>
                <td style={TD}>
                  <Button
                    shape="round"
                    onClick={getFileContext}
                    disabled={!ifFileSelected}
                  >
                    Load Version
                  </Button>
                </td>
                <td style={TD}>
                  <Button
                    type="primary"
                    shape="round"
                    onClick={activateForm}
                    disabled={!ifStbyVersionUploaded}
                  >
                    Activate Version
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  &nbsp;
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Upload</span>
                    </div>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        id="SelectedFile1"
                        onChange={selectFile}
                      />
                      <label class="custom-file-label" for="inputGroupFile01">
                        Choose file
                      </label>
                    </div>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="4">
                  <Progress percentage={uploadPercentage} />
                </td>
              </tr>
              <tr>
                <td colSpan="4">
                  {message ? <Message msg={message} /> : null}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SWUpdate;

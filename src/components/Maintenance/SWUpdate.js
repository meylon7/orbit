import React, { useState, useEffect } from "react";
import useSessionstorage from "@rooks/use-sessionstorage";
import sysIPAddress from "../../location";
import { PageHeader, Button, Space, Switch, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import FileUploaded from "./FileUploader";
import { v4 as uuidv4 } from "uuid";
import { ProgressBar, Jumbotron, Form } from "react-bootstrap";

const SWUpdate = () => {
  const [activeSW, setActiveSW] = useState(false);
const [token, setToken, removeToken] = useSessionstorage('token');
  const [version, setVersion] = useState();
  const [stbyversion, setStbyversion] = useState();
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  var sysversion = [];
  const chunkSize = 1048576 * 25;//  *3 is 3MB

  const [showProgress, setShowProgress] = useState(false)
  const [counter, setCounter] = useState(1)
  const [fileToBeUpload, setFileToBeUpload] = useState({})
  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0)
  const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize)
  const [progress, setProgress] = useState(0)
  const [fileGuid, setFileGuid] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [chunkCount, setChunkCount] = useState(0)
const progressInstance = <ProgressBar animated now={progress} label={`${progress}%`} />;

  const headers = {
    "Access-Control-Origin": "*",
    //'Content-Type': 'text/plain',
    Authorization: "Bearer " + token,
  };
  const LoadVersions = () => {
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
        let activeVersion = sysversion[0]["SYS.Version"] !== null ? sysversion[0]["SYS.Version"] : 'N/A'
        let standbyVersion = sysversion[0]["SYS.StbyVersion"] !== null ? sysversion[0]["SYS.StbyVersion"] : 'N/A'
        setVersion(activeVersion);
        setStbyversion(standbyVersion);
      });
  };
useEffect(() =>{
  LoadVersions()
},[])
  useEffect(() => {
    if (fileSize > 0) {
      fileUpload(counter);
    }
  }, [fileToBeUpload, progress])

//LoadVersion()
  const LoadVersionStandby = () => {
    axios
      .get(
        "https://" +
          sysIPAddress +
          "/api/param/get?Parameters=SYS.StbyVersion",
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
        let stbyVersion = sysversion[0]["SYS.StbyVersion"] !== null ? sysversion[0]["SYS.StbyVersion"] : 'N/A'
        setStbyversion(stbyVersion);
      });
  }
  const getFileContext = (e) => {
   
    resetChunkProperties();
    const _file = e.target.files[0];
    setFileSize(_file.size)
    const _totalCount = _file.size % chunkSize == 0 ? _file.size / chunkSize : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
        setChunkCount(_totalCount)
    setFileToBeUpload(_file)
        const _fileID = uuidv4() + "." + _file.name.split('.').pop();
        setFileGuid(_fileID)
      }

      const resetChunkProperties = () => {
        setShowProgress(true)
        setProgress(0)
        setCounter(1)
        setBeginingOfTheChunk(0)
        setEndOfTheChunk(chunkSize)
      }
     
      const fileUpload = () => {
        setCounter(counter + 1);
        if (counter <= chunkCount) {
          var chunk = fileToBeUpload;
          // var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
          uploadChunk(chunk)
        }
      }

      const uploadChunk = async (chunk) => {
        try {
          // debugger
          const response = await axios.post("https://" + sysIPAddress + "/api/files/update.tar", chunk,{
        
            headers: {
              "content-type": "multipart/form-data",
              Authorization: "Bearer " + token,
            }
          });
          // debugger
          const data = response.data;
          if (data.isSuccess) {
            setBeginingOfTheChunk(endOfTheChunk);
            setEndOfTheChunk(endOfTheChunk + chunkSize);
            if (counter == chunkCount) {
              console.log('Process is complete, counter', counter)
              await uploadCompleted();
            } else {
              var percentage = (counter / chunkCount) * 100;
              setProgress(percentage);
            }
          } else {
            console.log('Error Occurred:', data.errorMessage)
          }
    } catch (error) {
          debugger
          console.log('error', error)
        }
      }
      const uploadCompleted = async () => {
        var formData = new FormData();
        formData.append('update.tar', fileGuid);
    const response = await axios.get(
      "https://" +
        sysIPAddress +
        "/api/param/get?Parameters=SYS.StbyVersion",
      {
        headers: {
          "Content-Type": "text/plain",
          Authorization: "Bearer " + token,
        },
        mode: "cors",
      }
    );
    const data = response.data;
        if (data['SYS.StbyVersion'] !== null) {
          setProgress(100);
        }
      }
  const TD = {
    width: "200px",
  };
  const submitForm = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", selectedFile);
  
    axios
      .post("https://" + sysIPAddress + "/api/files/update.tar", formData,{
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + token,
        }
      })
      .then((res) => {
        LoadVersionStandby() 
        message.success("File Upload success");
      })
      .catch((err) => alert("File Upload Error"));
  };



  const activateForm = () => {
 if(window.confirm("After the activation the system will be rebooted automatically.")){
  const param = {
    MessageName: "HTMLFormUpdate",
    Parameters: {
      "SYS.ActivateStbyVersion": true
    },
  };
  axios
    .post("https://" + sysIPAddress + "/api/param/set", param, {
      headers: {
        Authorization: "Bearer " + token,
      }, mode: 'cors'
    })
    .then((response) => {
        message.success("Version has been activated successfully");
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
        <div style={{padding: '30px'}}>
        <table>
            <tr style={{ color : 'rgb(3, 79, 132)'}}>
              <td style={TD}>Active SW Version</td>
              <td>
                  <label> <strong>{version}</strong></label>
                  
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr style={{height:'30px'}}>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td style={TD}>Standby SW Version</td>
              <td>
                <label> <strong>{stbyversion}</strong></label>
              </td>
              <td style={TD}>
                <Button shape="round" onClick={submitForm}>Load Version</Button>
              </td>
              <td style={TD}>
                <Button type="primary" shape="round"  onClick={activateForm}>Activate Version</Button>
              </td>
            </tr>
            <tr>
              <td>
                &nbsp;
                <FileUploaded
                  onFileSelectSuccess={(file) => setSelectedFile(file)}
                  onFileSelectError={({ error }) => alert(error)}
                />
              </td>
              <td>
                <button onClick={submitForm}>Upload</button>
              </td>
              <td>
                
              </td>
              <td></td>
            </tr>
          </table>
          </div>
      </div>
      <div className="content-wrapper">
        <div style={{padding: '30px'}}>
        <Jumbotron>
      <Form>
        <Form.Group>
          <Form.File
            id="exampleFormControlFile1"
            onChange={getFileContext}
            label="Example file input"
          />
        </Form.Group>
        <Form.Group style={{ display: showProgress ? "block" : "none" }}>
          {progressInstance}
        </Form.Group>
      </Form>
    </Jumbotron>
        </div>
      </div>
    </>
  );
};

export default SWUpdate
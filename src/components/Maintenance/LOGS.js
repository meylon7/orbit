import React, { useEffect, useState } from "react";
import { PageHeader, Button } from "antd";
import sysIPAddress from "../../location";
import useSessionstorage from "@rooks/use-sessionstorage";
import axios from "axios";
import '../style/table.css'
import fileDownload from 'js-file-download'
import Progress from "../Progress";

const LOGS = () => {
  const [token] = useSessionstorage("token");
  const [data, setData] = useState([]); 
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [downloadPercentage, setdownloadPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
const [showProgress, setshowProgress] = useState('none')
const [dlProgress, setdlProgress] = useState([])

  function timeConverter(UNIX_timestamp) {
    let date
    if ((UNIX_timestamp !== null) && (UNIX_timestamp !== undefined)) {
      //UNIX_timestamp = 1606129442000;
      date = new Date(UNIX_timestamp);
      return date.toUTCString();
    }
    else return "unknown"

  }
  const loadData = () => {
    axios
    .get("https://" + sysIPAddress + "/api/logging-info", {
      headers: {
        Authorization: "Bearer " + token,
      },
      mode: "cors",
    })
    .then((res) => {
      setData(res.data.LogFilesList);
      for (let i = 0; i < res.data.LogFilesList.length; i++) {
        dlProgress.push(0);
        
      }
      //console.log(data);
    });
  }
  useEffect(() => {
    loadData()
      return ()=> {
        
      }
  }, []);
  
  const downloadFile = (file) => {  
    setdownloadPercentage(0);
    setLoading(true);
    setshowProgress("block")
    setValue(file)
    console.log(value)
    axios
    .get("https://" + sysIPAddress + "/api/files/" + file, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      onDownloadProgress: progressEvent => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setdownloadPercentage(percentage);
        if (percentage === 100) {
          setTimeout(() => {
            setLoading(false);
          }, 400);
        }
      },
      mode: "cors",
      responseType: 'blob'
    })
    .then((res) => {
      console.log('res:', res)
      // 2. Create blob link to download
      // const url = window.URL.createObjectURL(new Blob([blob]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `log.${file}`);
      // // 3. Append to html page
      // document.body.appendChild(link);
      // // 4. Force download
      // link.click();
      // // 5. Clean up and remove the link
      // link.parentNode.removeChild(link);
      fileDownload(res.data, `${file}.log`)


      
    })
    .catch((error) => {
      console.log(error)
    });
  }
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Logs" />
      </div>
      <div className="content-wrapper">
          
          <table className="styled-table">
            <thead>
              <tr>
                <th> Name</th>
                <th> Size</th>
                <th> Date modified</th>
                <th> </th>
                <th style={{ display: showProgress}}> Progress</th>
              </tr>
            </thead>
            <tbody>
              {data.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{value.FileName}</td>
                    <td>{parseFloat(value.FileSize / 1000000).toFixed(2)} MB</td>
                    <td>{timeConverter(value.ModifiedDate)}</td>
                    <td style={{textDecoration: 'underline'}}><a onClick={() => downloadFile(value.FileName)} href="#">Download</a></td>
                    <td style={{ display: showProgress}}>{loading && <Progress percentage={downloadPercentage} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        
      </div>
    </>
  );
};

export default LOGS;
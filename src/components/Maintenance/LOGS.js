import React, { useEffect, useState } from "react";
import { PageHeader, Button } from "antd";
import sysIPAddress from "../../location";
import useSessionstorage from "@rooks/use-sessionstorage";
import axios from "axios";
import '../style/table.css'
const LOGS = () => {
  const [token] = useSessionstorage("token");
  const [data, setData] = useState([]); 
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  
  function timeConverter(UNIX_timestamp) {
    let date
    if ((UNIX_timestamp !== null) && (UNIX_timestamp !== undefined)) {
      //UNIX_timestamp = 1606129442000;
      date = new Date(UNIX_timestamp);
      return date.toUTCString();
    }
    else return "Trying to connect to the server..."

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
      //console.log(data);
    });
  }
  useEffect(() => {
    loadData()
      return ()=> {
        
      }
  }, []);
  
  const downloadFile = (file) => {    
    setValue(file)
    console.log(value)
    axios
    .get("https://" + sysIPAddress + "/api/files/" + file, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      mode: "cors",
    })
    .then((blob) => {
      console.log(blob)
      // 2. Create blob link to download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sample.${url}`);
      // 3. Append to html page
      document.body.appendChild(link);
      // 4. Force download
      link.click();
      // 5. Clean up and remove the link
      link.parentNode.removeChild(link);
      
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
                <th> Download</th>
              </tr>
            </thead>
            <tbody>
              {data.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{value.FileName}</td>
                    <td>{value.FileSize}</td>
                    <td>{timeConverter(value.ModifiedDate)}</td>
                    <td><a onClick={() => downloadFile(value.FileName)} href="#">Download</a></td>
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

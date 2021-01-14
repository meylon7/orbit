import React, {useEffect, useState} from "react";
import { PageHeader, Button } from "antd";
import sysIPAddress from '../../location'
import useSessionstorage from "@rooks/use-sessionstorage";
import axios from "axios";


const LOGS = () => {
const [token] = useSessionstorage('token');
const [data, setData] = useState([]);
const [logInfoData, setlogInfoData] = useState([]);
let logInfo = []
const [fileName, setfileName] = useState('')
const [fileSize, setfileSize] = useState('')
const [lastModified, setlastModified] = useState('')

useEffect(() => {    
  getLogInfo();
}, []);

  const getLogInfo = () => {
    axios.get("https://" + sysIPAddress + "/api/logging-info", {
      headers: {
        Authorization: "Bearer " + token,
      }, mode: 'cors'
    })
      .then((res) => {
        console.log("logging-info data: ",res)
        data.push(res.data)
        console.log("data = ",data)
      })
  }

  const renderTableData = () => {
    return data.map((logFile, index) => {
          return (
            <tr key={index}>
               <td>{logFile.FileName}</td>
               <td>{logFile.FileSize}</td>
               <td>{logFile.ModifiedDate}</td>
               <td>link</td>
            </tr>
         )

    })
 }
  const downloadLogs = () => {

//     axios
//           .get(
//             "https://" + sysIPAddress + "/api/files/messages", 
//             {
//               headers: {
//                 Authorization: "Bearer " + token,
//               },mode:'cors'
//             })
//             .response.blob().then(blob => {
              
//               let url = window.URL.createObjectURL(blob);
//               let a = document.createElement('a');
//               a.href = url;
//               a.download = 'employees.json';
//               a.click();
//               window.location.href = response.url;
//             });


// data.map((item) => (
                // <tr key={data.id}>
                //   <td>{item.FileName}</td>
                //   <td>{item.FileSize}</td>
                //   <td>{item.ModifiedDate}</td>
                //   <td>link</td>
                //   <td />
                // </tr>
              // ))
// });
}


  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Logs" />
      </div>
      <div className="content-wrapper">
        <table className="logInfo-table">
          <thead>
            <tr>
            <th> Name</th>
            <th> Date modified</th>
            <th> Size</th>
            <th> Download</th>
            </tr>
            {/* <li className='list-group-item'> <strong>System Control: </strong>{ManualEn}</li> */}
          </thead>
          <tbody>
            
              {renderTableData()}
              
            
          </tbody>
        </table>
        {/* <div className="steps-content">
            <h1> Download Logs</h1>
            <Button type="primary" shape="round" onClick={downloadLogs}>Download file</Button>
        </div> */}
      </div>
    </>
  );
};

export default LOGS;
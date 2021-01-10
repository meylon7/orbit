import React from "react";
import { PageHeader, Button } from "antd";
import sysIPAddress from '../../location'
import useSessionstorage from "@rooks/use-sessionstorage";
import axios from "axios";


const LOGS = () => {
const [token, setToken, removeToken] = useSessionstorage('token');
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
// });
}
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Logs" />
      </div>
      <div className="content-wrapper">
        <div className="steps-content">
            <h1> Download Logs</h1>
            <Button type="primary" shape="round" onClick={downloadLogs}>Download file</Button>
        </div>
      </div>
    </>
  );
};

export default LOGS;
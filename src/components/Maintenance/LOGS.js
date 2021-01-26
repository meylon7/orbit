import React, { useEffect, useState } from "react";
import { PageHeader, Button , message, Space } from "antd";
import sysIPAddress from "../../location";
import useSessionstorage from "@rooks/use-sessionstorage";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../style/table.css";
import fileDownload from "js-file-download";
import { DownloadOutlined } from '@ant-design/icons';
import Progress from "../Progress";

const LOGS = () => {
  const [token] = useSessionstorage("token");
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [downloadPercentage, setdownloadPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showProgress, setshowProgress] = useState("none");
  const [dlProgress, setdlProgress] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const columns = [
    {
      name: "Modified Date",
      selector: "ModifiedDate",
      sortable: false,
      format: row => timeConverter(row.ModifiedDate)
    },
    {
      name: "File Size",
      selector: "FileSize",
      sortable: false
    },
    {
      name: "File Name",
      selector: "FileName",
      sortable: false
    }
  ];
  const headers = {
    //'Access-Control-Origin': '*',
    'Content-Type': 'text/plain',
    Authorization: "Bearer " + token,
  };
  function timeConverter(UNIX_timestamp) {
    let date;
    if (UNIX_timestamp !== null && UNIX_timestamp !== undefined) {
      //UNIX_timestamp = 1606129442000;
      date = new Date(UNIX_timestamp);
      return date.toUTCString();
    } else return "unknown";
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
  };
  useEffect(() => {
    loadData();

    return () => {};
  }, []);

  const downloadFile = (file) => {
    setdownloadPercentage(0);
    setLoading(true);
    setshowProgress("block");
    setValue(file);
    console.log(value);
    axios
      .get("https://" + sysIPAddress + "/api/files/" + file, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        onDownloadProgress: (progressEvent) => {
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
        responseType: "blob",
      })
      .then((res) => {
        console.log("res:", res);

        fileDownload(res.data, `${file}.log`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  function handleChange(e) {    
    setSelectedRowKeys(e.selectedRows)
    console.log(selectedRowKeys);
  };

  function downloadSelectedFiles(){
    if(selectedRowKeys){
      selectedRowKeys.map((key)=>{
        downloadFile(key["FileName"])
      })
    }
  }
  const delteLogs = () => {
    if(selectedRowKeys.length > 0){
      selectedRowKeys.map((key)=>{
        deletSelectedFiles(key["FileName"])
      })
    }else{
      deletAll()
    }
  }
  const deletSelectedFiles = (file) => {
    axios
      .post("https://" + sysIPAddress + "/api/files",file, { headers: {
        Authorization: "Bearer " + token,
      },mode:'cors' })
      .then((res) => {
        console.log(res)  
      })
      .catch((error) => {
        console.error(error.message);
        message.error("Delete file failed")
      });
  }

  const deletAll = () => {
    const param = {
      MessageName: "HTMLFormUpdate",
      Parameters: {
        "ARM.ClearUserLog": true
      },
    };
    axios
      .post("https://" + sysIPAddress + "/api/files",param, { headers: {
        Authorization: "Bearer " + token,
      },mode:'cors' })
      .then((response) => {
        console.log(response)
      })      
      .catch((error) => {
        console.error(error.message);
        message.error("Delete files failed")
      });
  }
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Logs" />
      </div>
      <div className="content-wrapper">
      <DataTable
          title="Logs File"
          columns={columns}
          data={data}
          defaultSortField="FileName"
          pagination
          selectableRows
          onSelectedRowsChange={handleChange}
          highlightOnHover
          pointerOnHover
        />
        <Space size='small'>
        <Button type="primary" icon={<DownloadOutlined />} size="large" onClick={downloadSelectedFiles} >
          Download
        </Button>
        <Button type="primary"  size="large" onClick={delteLogs} >
          Delete logs file
        </Button></Space>
        <div>
          <p style={{ display: showProgress, marginTop: '20px' }}>
            {loading && <Progress percentage={downloadPercentage} />}
          </p>
        </div>
      </div>
    </>
  );
};

export default LOGS;

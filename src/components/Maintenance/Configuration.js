import React ,{useState, useEffect} from "react";
import { PageHeader, Select, Upload, Button, message } from "antd";
import sysIPAddress from "../../location";
import useSessionstorage from "@rooks/use-sessionstorage";
import { Jumbotron, Form } from "react-bootstrap";
import axios from 'axios'
import fileDownload from 'js-file-download'

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const { Option } = Select;


const Configuration = () => {
  const [token] = useSessionstorage('token');

  const actionsData = [
    {
      value: 1,
      label: "Upload configuration"
    },
    {
      value: 2,
      label: "Download configuration"
    }
  ];

const [selectedValue, setSelectedValue] = useState(2);
const [buttonTitle, setButtonTitle] = useState('')
const [fileBrowser, setfileBrowser] = useState('none')
const [selectedFile, setSelectedFile] = useState({})
const [ifFileSelected, setIfFileSelected] = useState(false)
const chunkSize = 1048576 * 25; //  *3 is 3MB
const [counter, setCounter] = useState(1)
const [fileToBeUpload, setFileToBeUpload] = useState({})
const [fileSize, setFileSize] = useState(0)
const [chunkCount, setChunkCount] = useState(0)
const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0)
const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize)

useEffect(() => {
  initView(selectedValue)
  
}, [])

const initView = (actionValue) => {

  console.log('actionValue: ', actionValue)
  switch (actionValue) {
    case 1: {
  setButtonTitle('Click to Upload')
  setIfFileSelected(false)

  setfileBrowser("block")

      console.log("Selected upload")
      break;
    }
    case 2: {
      setButtonTitle("Click to Download")
      setIfFileSelected(true)
      setfileBrowser("none")
      console.log("Selected Download")
      break;
    }
    default: {
      setButtonTitle("None")
      break;
    }
  }
}

const selectFile = (e) => {
  const _file = e.target.files[0];
  setSelectedFile(_file)
  if (_file !== undefined) {
    setIfFileSelected(true)
  } else {
    setIfFileSelected(false)
  }
}


const handleActionSelection = (e) => {
  setSelectedValue(e)
  initView(e)
};



function onChange(value) {
    console.log(`selected ${value}`);
    setButtonTitle({value})
  }
  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }
  const UploadDownload = ()=>{
    console.log(`selected value =  ${Select}`)
    if (selectedValue === 1) {
      if (window.confirm("After the upload the system will be rebooted automatically.\nWould you like to proceed?")) {
        getFileContext();
      }
    }
    else if (selectedValue === 2) {
         downloadConfig();

    }


  }

  const getFileContext = () => {
    resetChunkProperties();
    const _file = selectedFile;
    setFileSize(selectedFile.size)
    const _totalCount = _file.size % chunkSize == 0 ? _file.size / chunkSize : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
    setChunkCount(_totalCount)
    setFileToBeUpload(_file)
  }
  const resetChunkProperties = () => {
    setCounter(1)
    setBeginingOfTheChunk(0)
    setEndOfTheChunk(chunkSize)
  }

  const fileUpload = () => {
    setCounter(counter + 1);
    if (counter <= chunkCount) {
      //setFileToBeUpload(selectedFile)

      var chunk = fileToBeUpload;
      // var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
      uploadFullConfig(chunk)
    }
  }

  const uploadFullConfig = async () => {
    try {
      // debugger
      setIfFileSelected(false)

      const _file = selectedFile;
      setFileSize(selectedFile.size)
      console.log('Start uploading file ', fileToBeUpload)
      let _chunk = fileToBeUpload;
      axios.post("https://" + sysIPAddress + "/api/files/full_config/acu_config.obt", _chunk, {

        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + token,
        }
      })
      .then((res) => {
        console.log("uploading configuration: ", res.data);
      });
    } catch (error) {
      debugger
      console.log('error', error)
    }
  }

  const downloadConfig = () => {
    axios
      .get("https://" + sysIPAddress + "/api/files/acu_config.obt", {
        headers: {
          Authorization: "Bearer " + token,
        }, mode: 'cors',
        responseType: 'blob'
      })
      .then((res) => {
        console.log('res: ', res)
        fileDownload(res.data, 'acu_full_config.obt')
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    if (fileSize > 0) {
      fileUpload(counter);
    }
  }, [fileToBeUpload]);

  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Configuration" />
      </div>
      <div className="content-wrapper">
        <div className="steps-content">
            {/* <h1>Upload Configuration</h1> */}
          <Select
            style={{ width: 300 }}
            placeholder="Select option from the list"
            value={selectedValue}
            options={actionsData}
            onChange={handleActionSelection}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            {/* <Option value="uploadPartial">Upload Partial Configuration</Option> */}
            {/* <Option value="Click to upload">Upload Configuration</Option>
            <Option value="Click to download">Download Configuration</Option> */}
          </Select>
          <br /> <br />
            <Button type="primary" shape="round" disabled = {!ifFileSelected} onClick={UploadDownload}> {buttonTitle}</Button>
          <td  style={{ display: fileBrowser, width: '100%', align: 'center'}}>
                  <Jumbotron >
                  <Form>
                    <Form.Group>
                      <Form.File
                        id="SelectedFile1"
                        onChange={selectFile} 
                      />
                    </Form.Group>
                    
                  </Form>
                </Jumbotron>
                </td>
        </div>
        {/* <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"></span>
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
        </div> */}
      </div>
    </>
  );
};

export default Configuration;

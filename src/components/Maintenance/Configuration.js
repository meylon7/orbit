import React from "react";
import { PageHeader, Select, Upload, Button, message } from "antd";

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
  function onChange(value) {
    console.log(`selected ${value}`);
  }
  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }
  return (
    <>
      <div className="content-wrapper">
        <PageHeader className="site-page-header" title="Configuration" />
      </div>
      <div className="content-wrapper">
        <div className="steps-content">
            <h1>Upload Configuration</h1>
          <Select
            style={{ width: 300 }}
            placeholder="Select from the list"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            {/* <Option value="partial">Upload Partial Configuration</Option> */}
            <Option value="full">Upload Configuration</Option>
            <Option value="configuration">Download Configuration</Option>
          </Select>
          <br /> <br />
          <Upload {...props}>
            <Button type="primary" shape="round">Click to Upload</Button>
          </Upload>
        </div>
      </div>
    </>
  );
};

export default Configuration;

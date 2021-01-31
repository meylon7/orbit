import React, { useRef, useContext } from "react";
import sysIPAddress from '../location'
import axios from "axios";
import { Form, Input, Button, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import BackImage from "./pic/Login.png";
import useSessionstorage from "@rooks/use-sessionstorage";
import Context from "../store/contaxt";


export default function Login(){
 // const {state, actions}= useContext(Context)


   const [token, setToken, removeToken] = useSessionstorage('token', null);
  const [user, setUser, removeUser] = useSessionstorage('user', '');
  const [firstLogin, setFirstlogin, removeFirstLogin] = useSessionstorage('firstLogin');
  const [hosteName, setHostName, removeHostName] = useSessionstorage('hostName', '');
  
  const BACK_IMAGE = {
    backgroundImage: `url(${BackImage})`,
    backgroundRepeat: "no-repeat",
    backgroundColor: "#fafbff",
  };
  const passRef = useRef();
  const nameRef = useRef();
  const headers = {
              //'Access-Control-Origin': '*'
              'Content-Type': 'text/plain'
  };
  
  const getToken = () => {
    // setFirstlogin(false)
    sessionStorage.clear();
    const PostValue = {
      UserName: nameRef.current.state.value,
      Password: passRef.current.state.value,
    };
    console.log("https://" + sysIPAddress + "/api/login", PostValue,{headers})
    axios
      .post("https://" + sysIPAddress + "/api/login", PostValue,{headers})
      .then((response) => {
        return response.data

      })
      .then((res) => {
        setToken(res.Token)
        setUser(PostValue.UserName)
        window.location.reload(false);      
      })
      .catch((error) => {
        if((error.response === null || error.response === undefined)){
          console.log("Login failed. Server can't be reached. error.response is null or undefined");
          message.error("Login failed. Server can't be reached")
        }
        else if (error.response.status === 401) {
          message.error("Login failed. Username or password is incorrect")
          console.log("Login failed. Username or password is incorrect")
          
        } else 
          {
            console.log("Login failed");
            message.error("Login failed")
          }
      });
     
  };
  
  return (
    <div style={BACK_IMAGE}>
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Col span={4}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={getToken}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                ref={nameRef}
                id="name"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username" value='manager'
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                ref={passRef}
                id="password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};



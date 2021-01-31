import React from "react";
import { A } from "hookrouter";
import "./style/navbar.css";
import useSessionstorage from "@rooks/use-sessionstorage";
import { Menu } from "antd";

const SubMenu = Menu.SubMenu;

const Navbar = () => {
 const [user] = useSessionstorage('user'); 
  return (
    <>
      <div className="side-bar">
        <div className="side-bar-content">
          <div className="side-bar-items">
          <Menu
          style={{ width: 199 }}
          defaultSelectedKeys={['1']}
          mode={'inline'}
          theme={'light'}
        >
          <Menu.Item key="1">
             <A href="/">System Status</A>
              </Menu.Item>
              {user === "manager" ? <>
              <SubMenu key="sub2" title="Tools">
                <Menu.Item key="11"><A href="/syscontrol">System Control</A></Menu.Item>
                <Menu.Item key="17"><A href="/manualcontrol">Manual Control</A></Menu.Item>
              </SubMenu>
              <SubMenu key="sub1" title="Settings">
                <Menu.Item key="10"><A href="/connectivity">Connectivity</A></Menu.Item>
                <Menu.Item key="9"><A href="/buc">BUC Mute</A></Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title="Maintenance">
                <Menu.Item key="13"><A href="/logs">Logs</A></Menu.Item>
                <Menu.Item key="14"><A href="/config">Configuration Files</A></Menu.Item>
                <Menu.Item key="12"><A href="/swupdate">Firmware Update</A></Menu.Item>
                <Menu.Item key="15"><A href="/calibration">Calibration Wizard</A></Menu.Item>
              </SubMenu></>
              : null}
              <Menu.Item key="16">
                <A href="/about">
                  About
            </A>
              </Menu.Item>
            </Menu>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Navbar;

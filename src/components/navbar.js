import React from "react";
import { A } from "hookrouter";
import "./style/navbar.css";
import { Menu } from "antd";

const SubMenu = Menu.SubMenu;
const Navbar = () => {
  
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
          <SubMenu key="sub1"  title="Configuration">
            <Menu.Item key="10"><A href="/connectivity">Connectivity</A></Menu.Item>
            <Menu.Item key="9"><A href="/buc">BUC</A></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title="Maintenance">
            <Menu.Item key="11"><A href="/syscontrol">System Control</A></Menu.Item>
            <Menu.Item key="12"><A href="/swupdate">SW Update</A></Menu.Item>
            <Menu.Item key="13"><A href="/logs">Logs</A></Menu.Item>
            <Menu.Item key="14"><A href="/config">Config Management</A></Menu.Item>
            <Menu.Item key="15"><A href="/calibration">Calibration Wizard</A></Menu.Item>
          </SubMenu>
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

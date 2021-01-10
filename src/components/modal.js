import React from "react";
import ReactDom from "react-dom";

const MODAL_STYLES = {
  position: "fixed",
  minWidth: 800,
  minHeight: 500,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000,
  borderRadius: "0.25rem",
  boxShadow:
    "0 0.0625rem 0.1875rem rgba(0,0,0,0.12), 0 0.0625rem 0.125rem rgba(0,0,0,0.24)",
  animation: "anim-open",
  animationDuration: ".6s",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};
const BUTTON_STYLES = {
  padding: "15px 32px",
  border: "none",
  textAlign: "center",
  display: "inline-block",
  fontSize: "16px",
  backgroundColor: "#008CBA",
  color: "white",
};
export default function Modal({ open, children, onClose, onConfirm }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        
        <div>{children}</div>
        <button style={BUTTON_STYLES} onClick={onClose}>Cancel</button>
        <button style={BUTTON_STYLES} onClick={onConfirm}>Confirm</button>
      </div>
    </>,
    document.getElementById("portal")
  );
}

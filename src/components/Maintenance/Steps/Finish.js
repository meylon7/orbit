import React from "react";
import useSessionstorage from "@rooks/use-sessionstorage";
import BackImage from "../../pic/finish.png";
const Finish = () => {
  const StepImage = {
    backgroundImage: `url(${BackImage})`,
  };
  const DIVIDER_SIZE = {
      width:'200px'
  }
  const [finalElOffset] = useSessionstorage("finalElOffset")
  const [finalPitchOffset] = useSessionstorage("finalPitchOffset")
  const [finalRollOffset] = useSessionstorage("finalRollOffset")
  const [yaw] = useSessionstorage('finalYawOffset');
  return (
    <div className="steps-content" style={StepImage}>
      <h1>Callibration performed successfully</h1>
      <br />
      <br />
      <h2>Following offsets were installed</h2>
      <label>Elevation offset: {parseFloat(finalElOffset).toFixed(2)}</label>
      <hr style={DIVIDER_SIZE} />
      <label>Yaw offset: {parseFloat(yaw).toFixed(2)}</label>
      <hr style={DIVIDER_SIZE} />
      <label>Pitch offset: {parseFloat(finalPitchOffset).toFixed(2)}</label>
      <hr style={DIVIDER_SIZE} />
      <label>Roll offset: {parseFloat(finalRollOffset).toFixed(2)}</label>
      <hr style={DIVIDER_SIZE} />
      <h2>To finish Press Done</h2>
    </div>
  );
};


export default Finish;

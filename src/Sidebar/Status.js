import React from "react";
import ChatIcon from "@material-ui/icons/Chat";

function Status({ onClick }) {
  return (
    <div style={{ cursor: "pointer" }}>
      <ChatIcon style={{ color: "#de5751" }} onClick={onClick} />
    </div>
  );
}

export default Status;

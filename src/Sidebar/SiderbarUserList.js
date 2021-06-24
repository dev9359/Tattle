import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
// import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
// import VideocamIcon from "@material-ui/icons/Videocam";
// import db from "../firebase";
import "./SidebarChat.css";
// console.log(use.uid);

function SidebarUserList({ data }) {
  return (
    <Link to="" className="sidebarChat__link">
      <div className="sidebarChat">
        <Avatar src={data.photoURL}></Avatar>
        <div className="sidebarChat__info">
          <h2>{data.name}</h2>
          <p>{data.email}</p>
        </div>
      </div>
    </Link>
  );
}
export default SidebarUserList;

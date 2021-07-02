import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import VideocamIcon from "@material-ui/icons/Videocam";
import db from "../firebase";
import "./SidebarChat.css";
import CryptoJS from "crypto-js";
import { useStateValue } from "../StateProvider";

function SidebarChat({ id, data }) {
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  const [chatUser, setChatUser] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  useEffect(() => {
    const dev = data.participants.filter((userid) => userid !== user.uid);
    db.collection("users")
      .doc(dev[0])
      .onSnapshot((snapshot) => {
        setChatUser(snapshot.data());
      });
  }, []);

  const decrypt = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, "my-secret-key@123");
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    // return decryptedData
    return data ? decryptedData : data;
  };
  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <Link to={`/rooms/${id}`} className="sidebarChat__link">
        <div className="sidebarChat">
          <Avatar src={chatUser?.photoURL}></Avatar>
          <div className="sidebarChat__info">
            <h2>{chatUser?.name}</h2>
            {messages[0]?.photo ? (
              <div className="sideChat__photo">
                <PhotoCameraIcon /> <span>Photo</span>
              </div>
            ) : null}
            {messages[0]?.video ? (
              <div className="sideChat__photo">
                <VideocamIcon /> <span>Video</span>
              </div>
            ) : null}
            <p>{messages[0]?.message ? decrypt(messages[0]?.message) : ""}</p>
            <p>{messages[0]?.url}</p>
          </div>
        </div>
      </Link>
    </React.Suspense>
  );
}

export default SidebarChat;

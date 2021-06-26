import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import VideocamIcon from "@material-ui/icons/Videocam";
import db from "../firebase";
import "./SidebarChat.css";
import { useStateValue } from "../StateProvider";
// console.log(use.uid);

const CryptoJS = require("crypto-js");
function SidebarChat({ id, name, data }) {
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  // const { participants } = data;

  const [chatUser, setChatUser] = useState(null);

  const fetchuserbyID = () => {
    if (data.data.participants?.includes(user.uid)) {
      data.data.participants?.splice(
        data.data.participants.indexOf(user.uid, 1)
      );
      db.collection("users")
        .doc(data.data.participants[0])
        .get()
        .then((snapshot) => {
          setChatUser(snapshot.data());
        });
      // console.log(chatUser);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchuserbyID();
  }, [id]);

  const fetchRooms = () => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  };

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

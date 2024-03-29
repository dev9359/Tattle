import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
// importing component
//importing material-ui-icon
import LockIcon from "@material-ui/icons/Lock";
import AlarmIcon from "@material-ui/icons/Alarm";
import DoneIcon from "@material-ui/icons/Done";
//importing styles
import "./ChatBody.css";
const CryptoJS = require("crypto-js");

function ChatBody({
  roomOwner,
  roomCreatedBy,
  messages,
  user,
  roomId,
  isRoomExist,
}) {
  const decrypt = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, "my-secret-key@123");
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    // return decryptedData
    return data ? decryptedData : data;
  };
  const messagesEndRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    //listens when room is changed, then it sets playing to false
    if (isRoomExist >= 0) {
      setPlaying(false);
    }
  }, [isRoomExist]);

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const scrollToBottom = () => {
    if (roomId) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };
  useEffect(scrollToBottom, [messages, roomId]);

  return (
    <div>
      <p className="chat__message_reminder">
        <LockIcon /> Welcome to Tattle. Messages are encrpyted.
      </p>
      <p className="chat__message_reminder chat__createdBy">
        {roomOwner === user.uid
          ? "You created this group"
          : `${roomCreatedBy} created this group`}
      </p>

      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat__message 
                    ${message.uid === user.uid && "chat__sender"} 
                    ${message.photo && "chat__message_media_image"}
                    ${message.video && "chat__message_media_video"}
                    ${
                      message.video &&
                      !message.caption &&
                      "chat__message_media_video_noCaption"
                    } `}
        >
          <span
            className={`chat__name ${
              message.uid === user.uid && "chat__name_sender"
            }`}
          >
            {message.name}
          </span>

          <div className="chat__body_image_container">
            {message.photo ? (
              <>
                <img alt="" className="chat__body_image" src={message.photo} />
              </>
            ) : null}
          </div>

          <div className="chat__body_video_container">
            {message.video ? (
              <>
                <div className="player-wrapper">
                  <ReactPlayer
                    className="react-player"
                    width="100%"
                    height="100%"
                    url={message.video}
                    controls={true}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handlePause}
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="chat__message_box">
            <div
              className={`chat__message_box_text ${
                message.uid === user.uid && "chat__message_box_text_sender"
              }
              ${
                message.photo &&
                !message.caption &&
                "chat__message_box_text_no_caption"
              } `}
            >
              {message.message ? decrypt(message.message) : null}
              {message.caption ? message.caption : null}
              {message.url ? (
                <a
                  target="_blank"
                  href={`${message.url}`}
                  rel="noopener noreferrer"
                >
                  {message.url}
                </a>
              ) : null}

              <div
                className={`chat__timestamp_container ${
                  message.uid === user.uid && "chat__timestamp_container_sender"
                }`}
              >
                {message.timestamp ? (
                  <div
                    className={`chat__timestamp 
                                    ${
                                      message.photo &&
                                      !message.caption &&
                                      "chat__timestamp_media_photo"
                                    }  
                                    ${
                                      message.video &&
                                      !message.caption &&
                                      "chat__timestamp_media_video"
                                    }
                                    ${
                                      message.video &&
                                      !message.caption &&
                                      playing === true &&
                                      "chat__timestamp_media_displayNone"
                                    }`}
                  >
                    <span>
                      {new Date(message.timestamp.toDate()).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          hour12: true,
                          minute: "numeric",
                        }
                      )}
                      {message.uid === user.uid ? <DoneIcon /> : null}
                    </span>
                  </div>
                ) : (
                  <div className="chat__timestamp">
                    <span>
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        hour12: true,
                        minute: "numeric",
                      })}
                      {message.uid === user.uid ? <AlarmIcon /> : null}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* it will automatically scroll drown everytime the user enters new chat message */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatBody;

import React, { useEffect, useState } from "react";
import { useStateValue } from "../StateProvider";
import { useHistory, useParams } from "react-router-dom";
//importing firebase
import db from "../firebase";
import { storage, firebase } from "../firebase";
//importing components
//importing material-ui
import CircularProgress from "@material-ui/core/CircularProgress";
//importing styles
import "react-toastify/dist/ReactToastify.css";
import "./Chat.css";

const ChatHeader = React.lazy(() => import("./ChatHeader"));
const ChatBody = React.lazy(() => import("./ChatBody"));
const ChatFooter = React.lazy(() => import("./ChatFooter"));
const ChatLandingScreen = React.lazy(() => import("./ChatLandingScreen"));
function Chat({ isRoomExist }) {
  const history = useHistory();
  const [{ user }] = useStateValue();
  const { roomId } = useParams();
  const [_roomId, set_RoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCreatedBy, setRoomCreatedBy] = useState("");
  const [roomOwner, setRoomOwner] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLandingScreenPhoto, setShowLandingScreenPhoto] = useState(false);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot(function (doc) {
          setRoomName(doc.data()?.name);
          setRoomCreatedBy(doc.data()?.createdBy);
          setRoomOwner(doc.data()?.roomOwner);
          set_RoomId(doc.data()?.id);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(function (doc) {
          setMessages(doc.docs.map((doc) => doc.data()));
          setLoading(true);
        });

      setShowLandingScreenPhoto(false);
    } else {
      setShowLandingScreenPhoto(true);
      history.push("/");
    }
  }, [roomId, history]);

  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <div className="chat">
        {roomId ? (
          <>
            <div>
              <ChatHeader
                roomCreatedBy={roomCreatedBy}
                roomOwner={roomOwner}
                roomName={roomName}
                roomId={roomId}
                _roomId={_roomId}
                messages={messages}
                db={db}
                history={history}
                isRoomExist={isRoomExist}
              />
            </div>

            <div className="chat__body">
              {loading ? (
                <ChatBody
                  roomCreatedBy={roomCreatedBy}
                  roomOwner={roomOwner}
                  roomId={roomId}
                  messages={messages}
                  user={user}
                  isRoomExist={isRoomExist}
                />
              ) : (
                <div className="chat__body_loading">
                  <div>
                    <CircularProgress />
                  </div>
                </div>
              )}
            </div>

            <div>
              <ChatFooter
                roomName={roomName}
                roomId={roomId}
                db={db}
                firebase={firebase}
                storage={storage}
              />
            </div>
          </>
        ) : (
          <ChatLandingScreen showLandingScreenPhoto={showLandingScreenPhoto} />
        )}
      </div>
    </React.Suspense>
  );
}

export default Chat;

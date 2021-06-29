import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { useStateValue } from "../StateProvider";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import db from "../firebase";
import "./SiderbarUserList.css";
import { firebase } from "../firebase";

const TooltipCustom = React.lazy(() => import("../shared/TooltipCustom"));
function SidebarUserList({ data }) {
  const [{ user }] = useStateValue();

  const createChat = (e) => {
    e.preventDefault();

    db.collection("rooms")
      .add({
        roomOwner: user.uid,
        createdBy: user.displayName,
        name: "room",
        participants: [user.uid, data.uid],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function (docRef) {
        db.collection("rooms").doc(docRef.id).set(
          {
            id: docRef.id,
          },
          { merge: true }
        );
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            const userRooms = snapshot.data().rooms;
            userRooms.push(docRef.id);
            db.collection("users").doc(user.uid).update({ rooms: userRooms });
          });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };
  return (
    <Link to="/" className="sidebarChat__link">
      <div className="sidebarChat">
        <Avatar src={data.photoURL}></Avatar>
        <div className="sidebarChat__info">
          <h2>{data.name}</h2>
          <p>{data.email}</p>
          <TooltipCustom
            name="Add Friend"
            icon={<PersonAddIcon style={{ color: "#de5751" }} />}
            onClick={createChat}
          />
        </div>
      </div>
    </Link>
  );
}
export default SidebarUserList;

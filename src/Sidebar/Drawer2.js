import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// import { useStateValue } from "../StateProvider";
//importing components
//importing material-ui
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import SearchBar from "../shared/SearchBar";
import SidebarChat from "./SidebarChat";
import CircularProgress from "@material-ui/core/CircularProgress";
//importing material-ui-icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
//importing styles
import "./Drawer2.css";
// import "./Sidebar.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerPaper: {
    position: "absolute",
  },
}));

function Drawer2({ drawer2, setDrawer2, rooms, setIsRoomExist, isRoomExist }) {
  const classes = useStyles();
  const history = useHistory();
  const { roomId } = useParams();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);
  const [isSearchFound, setIsSetSearchFound] = useState(false);

  const findRoom = function (myRooms) {
    return function (x) {
      var searchRoom = x.data.name + "";
      return (
        searchRoom.toLowerCase().includes(myRooms.toLowerCase()) || !myRooms
      );
    };
  };

  useEffect(() => {
    const roomResult = () => {
      return (
        <>
          {rooms.filter(findRoom(search)).map((room) => (
            <p key={room.id}>{room.name}</p>
          ))}
        </>
      );
    };

    if (search) {
      var result = roomResult();
      if (result.props.children.length > 0) {
        setIsSetSearchFound(true);
      } else {
        setIsSetSearchFound(false);
      }
    }

    //checks if room exists, else will be redirect to landing screen
    var roomList = rooms;
    if (roomList) {
      //checks if the current route(roomId) exists in roomList(array)
      const index = roomList.findIndex(function (id, index) {
        return id.id === roomId;
      });

      if (index >= 0) {
        setIsRoomExist(index);
        // console.log("ROOM EXISTS");
      } else if (index === -1) {
        setIsRoomExist(index);
        history.push("/");
        // console.log("ROOM DOES NOT EXIST");
      }
    }
  }, [search, rooms, roomId, history, setIsRoomExist]);

  useEffect(() => {
    if (rooms) {
      if (rooms.length > 0) {
        setNoRooms(false);
        setLoading(true);
      } else if (rooms.length === 0 && isRoomExist === -1) {
        setNoRooms(true);
        setLoading(true);
      }
    }
  }, [isRoomExist, rooms]);

  const handleDrawerClose = () => {
    setDrawer2(false);
  };

  return (
    <div>
      <Drawer
        anchor="left"
        variant="persistent"
        open={drawer2}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className="drawerLeft__header">
          <div className="drawerLeft__header_container">
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIcon />
            </IconButton>
            <p>Add User</p>
          </div>
        </div>
        <div className="drawerLeft__content">
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search or start new chat"
          />
          <div className="sidebar__chats">
            {loading ? (
              <>
                {search ? (
                  <>
                    {isSearchFound ? (
                      <div>
                        {rooms.filter(findRoom(search)).map((room) => (
                          <SidebarChat
                            key={room.id}
                            id={room.id}
                            name={room.data.name}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="sidebar__chatsContainer_empty">
                        <span>No chat room found</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {rooms.map((room) => (
                      <SidebarChat
                        key={room.id}
                        id={room.id}
                        name={room.data.name}
                        owner={room.data.roomOwner}
                      />
                    ))}
                  </>
                )}
              </>
            ) : (
              <div className="sidebar__chatsContainer_loading">
                <div>
                  <CircularProgress />
                </div>
              </div>
            )}

            {noRooms && loading ? (
              <div className="sidebar__chatsContainer_empty">
                <span>No chats</span>
              </div>
            ) : null}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default Drawer2;

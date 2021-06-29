import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useStateValue } from "../StateProvider";
//importing firebase
import db from "../firebase";
import { auth, storage } from "../firebase";
//importing components
import { toastInfo } from "../shared/toastInfo";
//importing material-ui
import CircularProgress from "@material-ui/core/CircularProgress";
import MoreVertIcon from "@material-ui/icons/MoreVert";
//importing styles
import "./Sidebar.css";

const use = auth.currentUser;
console.log(use.uid);
const UserAvatar = React.lazy(() => import("./UserAvatar"));
const ChatIcon = React.lazy(() => import("@material-ui/icons/Chat"));
const DropdownMenu = React.lazy(() => import("../shared/DropdownMenu"));
const DrawerLeft = React.lazy(() => import("./DrawerLeft"));
const Drawer2 = React.lazy(() => import("./Drawer2"));
const SearchBar = React.lazy(() => import("../shared/SearchBar"));
const SidebarChat = React.lazy(() => import("./SidebarChat"));
const TooltipCustom = React.lazy(() => import("../shared/TooltipCustom"));

function Sidebar({ rooms, setIsRoomExist, isRoomExist }) {
  const history = useHistory();
  const { roomId } = useParams();
  const [{ user }] = useStateValue();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [drawer2, setDrawer2] = useState(false);
  const [menuSidebar, setMenuSidebar] = useState(null);
  const [userData, setUserData] = useState(null);
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

    var roomList = rooms;
    if (roomList) {
      const index = roomList.findIndex(function (id, index) {
        return id.id === roomId;
      });

      if (index >= 0) {
        setIsRoomExist(index);
      } else if (index === -1) {
        setIsRoomExist(index);
        history.push("/");
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

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    db.collection("users").onSnapshot((snapshot) =>
      setUserData(snapshot.docs.map((doc) => doc.data()))
    );
  };

  const handleDrawerLeftOpen = () => {
    setMenuSidebar(null);
    setDrawerLeft(true);
  };
  const handleDrawer2Open = () => {
    setMenuSidebar(null);
    setDrawer2(true);
  };
  const handleMenuOpen = (event) => {
    setMenuSidebar(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuSidebar(null);
  };

  const archive = () => {
    const archive = "archive";
    toastInfo("Archive is not yet available!", archive, "top-center");
  };

  const starred = () => {
    const starred = "starred";
    toastInfo("Starred is not yet available!", starred, "top-center");
  };

  const settings = () => {
    const settings = "settings";
    toastInfo("Settings is not yet available!", settings, "top-center");
  };

  const logout = () => {
    if (user.isAnonymous === true) {
      auth.currentUser
        .delete()
        .then(function () {
          history.push("/");
        })
        .catch(function (error) {
          // An error happened.
          console.log("error deleting anonymous user", error);
        });
    } else {
      auth.signOut();
    }
  };

  const menuLists = [
    {
      title: "Profile",
      onClick: () => handleDrawerLeftOpen(),
      id: Math.random() * 100000,
    },
    {
      title: "Archived",
      onClick: () => archive(),
      id: Math.random() * 100000,
    },
    {
      title: "Starred",
      onClick: () => starred(),
      id: Math.random() * 100000,
    },
    {
      title: "Settings",
      onClick: () => settings(),
      id: Math.random() * 100000,
    },
    {
      title: "Logout",
      onClick: () => logout(),
    },
  ];

  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <div className="sidebar">
        <div className="sidebar__header">
          <UserAvatar
            id="UserProfile"
            photoURL={user.photoURL}
            onClick={() => handleDrawerLeftOpen()}
          />
          <DrawerLeft
            drawerLeft={drawerLeft}
            setDrawerLeft={setDrawerLeft}
            db={db}
            auth={auth}
            storage={storage}
          />

          <div className="sidebar__headerRight">
            <Drawer2
              drawer2={drawer2}
              setDrawer2={setDrawer2}
              userData={userData}
              db={db}
              auth={auth}
              storage={storage}
            />
            <TooltipCustom
              icon={<ChatIcon style={{ color: "#de5751" }} />}
              name="New Chat"
              onClick={() => handleDrawer2Open()}
            />
            <TooltipCustom
              name="Menu"
              icon={<MoreVertIcon style={{ color: "#de5751" }} />}
              onClick={handleMenuOpen}
            />
            <DropdownMenu
              menuLists={menuLists}
              menu={menuSidebar}
              handleMenuOpen={handleMenuOpen}
              handleMenuClose={handleMenuClose}
            />
          </div>
        </div>

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
                          data={room.data}
                          name={room.data.name}
                          owner={room.data.roomOwner}
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
                      data={room.data}
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
    </React.Suspense>
  );
}

export default Sidebar;

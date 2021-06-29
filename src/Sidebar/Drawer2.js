import React, { useState } from "react";
//importing components
//importing material-ui
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
//importing material-ui-icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
//importing styles
import "./Drawer2.css";
import SidebarUserList from "./SiderbarUserList";

const SearchBar = React.lazy(() => import("../shared/SearchBar"));

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerPaper: {
    position: "absolute",
  },
}));

function Drawer2({
  drawer2,
  setDrawer2,
  rooms,
  setIsRoomExist,
  isRoomExist,
  userData,
}) {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);

  const handleDrawerClose = () => {
    setDrawer2(false);
  };

  const findUser = function (myUsers) {
    return function (x) {
      var searchRoom = x.name + "";
      return (
        searchRoom.toLowerCase().includes(myUsers.toLowerCase()) || !myUsers
      );
    };
  };

  return (
    <React.Suspense fallback={<p>Loading</p>}>
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
            <div className="drawerLeft__not">
              <span>Select or Search for your new friends here at Tattle.</span>
            </div>
            <div className="sidebar__chats">
              {loading === false ? (
                <>
                  {search ? (
                    <>
                      <div>
                        {userData ? (
                          userData
                            .filter(findUser(search))
                            .map((user) => <SidebarUserList data={user} />)
                        ) : (
                          <div className="sidebar__chatsContainer_empty">
                            <span>No Users searched found</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {userData ? (
                        userData.map((user) => <SidebarUserList data={user} />)
                      ) : (
                        <div className="sidebar__chatsContainer_empty">
                          <span>No Users found</span>
                        </div>
                      )}
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
    </React.Suspense>
  );
}

export default Drawer2;

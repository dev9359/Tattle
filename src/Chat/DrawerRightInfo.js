import React from "react";

import DrawerRight from "./DrawerRight";
import IconButton from "@material-ui/core/IconButton";
import Zoom from "@material-ui/core/Zoom";
// import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";

import CloseIcon from "@material-ui/icons/Close";
// import DoneIcon from "@material-ui/icons/Done";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import GroupIcon from "@material-ui/icons/Group";
//importing styles
import "./DrawerRightInfo.css";

function DrawerRightInfo({
  drawerRightInfo,
  setDrawerRightInfo,
  messages,
  user,
}) {
  const handleDrawerClose = () => {
    setDrawerRightInfo(false);
  };

  return (
    <div>
      <DrawerRight
        drawerRight={drawerRightInfo}
        content={
          <>
            <div className="drawer-right-info__header">
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon style={{ color: "#de5751" }} />
              </IconButton>
              <p>Group Info</p>
            </div>
            <div className="drawer-right-info-content">
              <div className="drawer-right-info-content__photo">
                <div className="profilePhoto">
                  <Zoom
                    in={drawerRightInfo}
                    style={{
                      transitionDelay: drawerRightInfo ? "300ms" : "0ms",
                    }}
                  >
                    <Avatar>
                      <GroupIcon />
                    </Avatar>
                  </Zoom>
                  <div className="profilePhoto__layer_top">
                    <div className="profilePhoto__text">
                      <PhotoCameraIcon />
                      <p>CHANGE</p>
                      <p>PROFILE PHOTO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
}

export default DrawerRightInfo;

import React from "react";
import LaptopIcon from "@material-ui/icons/Laptop";
import Divider from "@material-ui/core/Divider";
import "./ChatLandingScreen.css";
import Zoom from "@material-ui/core/Zoom";

function ChatLandingScreen({ showLandingScreenPhoto }) {
  return (
    <div className="chat-landing-screen">
      <div>
        <Zoom
          in={showLandingScreenPhoto}
          style={{ transitionDelay: showLandingScreenPhoto ? "300ms" : "0ms" }}
        >
          <img
            className="chat-landing-screen__photo"
            src="https://firebasestorage.googleapis.com/v0/b/tattle-9359.appspot.com/o/Folder%2Flogo.webp?alt=media&token=c0d6ec1c-5261-4864-a820-539a731fb7d1"
            alt="TattleLogo"
          />
        </Zoom>
      </div>

      <div className="chat-landing-screen__title">
        <p>Keeps you Connected</p>
      </div>

      <div>
        <p>
          Tattle is driven by a fascination for mobile technology that was once
          viewed as a passing trend.
        </p>
      </div>

      <Divider />

      <div className="chat-landing-screen__footer">
        <LaptopIcon />
        <p>Tattle is available for Windows.</p>
        <a
          target="_blank"
          href="https://tattle-9359.web.app"
          rel="noopener noreferrer"
        >
          Get it here.
        </a>
      </div>
    </div>
  );
}

export default ChatLandingScreen;

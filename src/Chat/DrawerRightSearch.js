import React, { useState, useEffect } from "react";
//importing components
import SearchBar from "../shared/SearchBar";
//importing material-ui
import DrawerRight from "./DrawerRight";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
//importing material-ui-icons
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
//importing styles
import "./DrawerRightSearch.css";
const CryptoJS = require("crypto-js");

function DrawerRightSearch({
  drawerRightSearch,
  setDrawerRightSearch,
  messages,
  user,
}) {
  const [search, setSearch] = useState("");
  const [isFoundMessage, setIsFoundMessage] = useState(false);

  const findMessage = function (myMessages) {
    return function (x) {
      var searchMessage = x.message + "" + x.caption;
      return (
        searchMessage.toLowerCase().includes(myMessages.toLowerCase()) ||
        !myMessages
      );
    };
  };
  const decrypt = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, "my-secret-key@123");
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    // return decryptedData
    return data ? decryptedData : data;
  };
  useEffect(() => {
    const messageResult = () => {
      return (
        <>
          {messages.filter(findMessage(search)).map((message) => (
            <p key={message.id}>
              {message.message ? decrypt(message.message) : ""}
              {message.caption}
            </p>
          ))}
        </>
      );
    };

    if (search) {
      var result = messageResult();
      // console.log("result", result.props.children)
      if (result.props.children.length > 0) {
        setIsFoundMessage(true);
        console.log("search message sucess");
      } else {
        setIsFoundMessage(false);
        console.log("search message fail");
      }
    }
  }, [search, messages]);

  const handleDrawerClose = () => {
    setDrawerRightSearch(false);
  };

  return (
    <div>
      <DrawerRight
        drawerRight={drawerRightSearch}
        content={
          <>
            <div className="drawerRight__header">
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
              <p>Search Messages</p>
            </div>

            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Search..."
            />

            <div
              className={`drawerRight__content ${
                isFoundMessage === true &&
                search.length > 0 &&
                "drawerRight__content_searched"
              }`}
            >
              {search.length > 0 ? (
                <>
                  {isFoundMessage ? (
                    <>
                      {messages.filter(findMessage(search)).map((message) => (
                        <div
                          key={message.id}
                          className="drawerRight__content_searched_message"
                        >
                          <p>
                            {new Date(
                              message.timestamp?.toDate()
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              hour12: true,
                              minute: "numeric",
                            })}
                            <br />
                          </p>
                          <p id="last_p">
                            {message.uid === user.uid ? <DoneIcon /> : null}
                            {message.message ? decrypt(message.message) : ""}
                            {message.caption}
                          </p>
                          <Divider />
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No message found</p>
                  )}
                </>
              ) : (
                <p>Search for messages in this room.</p>
              )}
            </div>
          </>
        }
      />
    </div>
  );
}

export default DrawerRightSearch;

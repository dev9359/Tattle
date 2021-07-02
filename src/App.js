import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
//importing firebase
import db from "./firebase";
import { auth, firebase } from "./firebase";
//importing actions
import { setUser } from "./actions/userAction";
//importing components
import { ToastContainer } from "react-toastify";
import { toastInfo } from "./shared/toastInfo";
//importing material-ui
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
//importing styles
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Login = React.lazy(() => import("./Login"));
const Sidebar = React.lazy(() => import("../src/Sidebar/Sidebar"));
const Chat = React.lazy(() => import("../src/Chat/Chat"));
function App() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [isRoomExist, setIsRoomExist] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUser(authUser));
        setLoading(true);

        db.collection("rooms")
          .where("participants", "array-contains", authUser.uid)
          .onSnapshot((snapshot) =>
            setRooms(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            )
          );

        if (authUser.isAnonymous === true && authUser.displayName === null) {
          var anonymousName =
            // eslint-disable-next-line no-useless-concat
            "anonymous" + Math.floor(Math.random() * 1000000);

          auth.currentUser.updateProfile({
            displayName: anonymousName,
            photoURL: "",
          });

          db.collection("users")
            .doc(authUser.uid)
            .set({
              uid: authUser.uid,
              name: anonymousName,
              about: "Hey there! I am using Tattle.",
              photoURL: "https://avatars.dicebear.com/api/human/ugtjh.svg",
              role: "anonymous",
              email: anonymousName + "@anonymous.com",
              dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(function () {
              console.log("Document successfully updated!");
            })
            .catch(function (error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
            });
        }

        if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL !== null
        ) {
          const errorAbout = "errorAbout";
          db.collection("users")
            .doc(authUser.uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                // console.log("USER EXIST");
              } else {
                db.collection("users").doc(authUser.uid).set({
                  uid: authUser.uid,
                  name: authUser.displayName,
                  about: "Hey there! I am using Tattle.",
                  photoURL: user.photoURL,
                  role: "regular",
                  email: authUser.email,
                  dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            })
            .catch(function (error) {
              toastInfo(`${error}`, errorAbout, "top-center");
            });
        } else if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL === null
        ) {
          const errorAbout = "errorAbout";
          db.collection("users")
            .doc(authUser.uid)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                console.log("USER EXIST");
              } else {
                db.collection("users").doc(authUser.uid).set({
                  uid: authUser.uid,
                  name: authUser.displayName,
                  about: "Hey there! I am using Tattle.",
                  photoURL: "",
                  role: "regular",
                  email: authUser.email,
                  dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                });
              }
            })
            .catch(function (error) {
              toastInfo(`${error}`, errorAbout, "top-center");
            });
        }
      } else {
        dispatch(setUser(null));
        setLoading(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, user]);

  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <div className={`app ${loading === false && "app-no-bg"}`}>
        {loading ? (
          <>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
            />
            {!user ? (
              <Login />
            ) : (
              <div className="app__body">
                <Router>
                  <Switch>
                    <Route exact path="/">
                      <Sidebar
                        rooms={rooms}
                        setIsRoomExist={setIsRoomExist}
                        isRoomExist={isRoomExist}
                      />
                      <Hidden only={["xs"]}>
                        {" "}
                        {/* Chat component will be hidden in mobile view */}
                        <Chat isRoomExist={isRoomExist} />
                      </Hidden>
                    </Route>

                    <Route exact path="/rooms/:roomId">
                      <Hidden only={["xs"]}>
                        {" "}
                        {/* Sidebar component will be hidden in mobile view */}
                        <Sidebar
                          rooms={rooms}
                          setIsRoomExist={setIsRoomExist}
                          isRoomExist={isRoomExist}
                        />
                      </Hidden>
                      <Chat isRoomExist={isRoomExist} />
                    </Route>

                    <Route path="*">
                      <Redirect to="/" />
                    </Route>
                  </Switch>
                </Router>
              </div>
            )}
          </>
        ) : (
          <div className="app__loading">
            <div>
              <div className="app__loading_circular">
                <CircularProgress />
              </div>
              <div className="app__loading_linear">
                <LinearProgress />
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Suspense>
  );
}

export default App;

import React from "react";
import { auth, provider } from "./firebase";
import { toastInfo } from "./shared/toastInfo";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import GoogleLogo from "./images/Google G Logo.png";
import Logo from "./images/logo.png";
import "./Login.css";

function Login() {
  const signInGoogle = () => {
    const google = "google";

    auth
      .signInWithPopup(provider)
      .catch((error) => toastInfo(`${error}`, google, "top-center"));
  };

  const loginAnonymously = () => {
    const anonymous = "anonymous";

    auth
      .signInAnonymously()
      .catch((error) => toastInfo(`${error}`, anonymous, "top-center"));
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={Logo} alt="Tattle Logo" />
        <div className="login__text">
          <h2>Keeps you Connected</h2>
          <br></br>
          <p>Tattle is driven by a fascination for communication </p>
          <p>technology that was once viewed as a passing trend.</p>
        </div>
        <div className="login__withGoogle" onClick={signInGoogle}>
          <img src={GoogleLogo} alt="Google Logo" />
          <span>Sign in with Google</span>
        </div>

        <div
          className="login__withGoogle login__Anonymously"
          onClick={loginAnonymously}
        >
          <PermIdentityIcon />
          <span>Login Anonymously</span>
        </div>
      </div>
    </div>
  );
}

export default Login;

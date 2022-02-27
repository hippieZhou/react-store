import React from "react";
import { Link, withRouter } from "react-router-dom";
import Panel from "components/Panel";
import UserProfile from "components/UserProfile";

const Header = (props) => {
  const toProfile = () => {
    Panel.open({
      component: UserProfile,
      props: {
        user: props.user,
      },
      callback: (data) => {
        if (data === "logout") {
          props.history.go(0);
        }
      },
    });
  };

  return (
    <div className="header">
      <div className="grid">
        <div className="start">
          <a href="/">Home</a>
        </div>
        <div className="end">
          {props.user.nickName ? (
            <span className="nickname" onClick={toProfile}>
              <i className="far fa-user"></i>
              {props.user.nickName}
            </span>
          ) : (
            <React.Fragment>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
export default withRouter(Header);

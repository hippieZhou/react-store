import React from "react";

export default function userProfile(props) {
  const logout = () => {
    global.auth.logout();
    props.close("logout");
  };
  return (
    <div className="user-profile">
      <p className="title has-text-centered">Profile</p>
      <fieldset disabled="disabled">
        <div className="field">
          <label className="label">NickName</label>
          <input
            type="text"
            className="input"
            defaultValue={props.user.nickName}
          />
        </div>
        <div className="field">
          <label className="label">Email</label>
          <input
            type="text"
            className="input"
            defaultValue={props.user.email}
          />
        </div>
        <div className="field">
          <label className="label">Type</label>
          <input
            type="text"
            className="input"
            defaultValue={props.user.type === 1 ? "Manager" : "General User"}
          />
        </div>
      </fieldset>
      <br />
      <div className="field is-grouped is-grouped-centered">
        <div className="control">
          <button type="button" className="button is-danger" onClick={logout}>
            Logout
          </button>
        </div>
        <div className="control">
          <button
            className="button"
            type="button"
            onClick={() => props.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

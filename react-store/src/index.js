import ReactDOM from "react-dom";
import Router from "router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "commons/auth";
import "css/app.scss";
import "css/style.scss";

ReactDOM.render(
  <div>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    ></ToastContainer>
    <Router />
  </div>,
  document.getElementById("root")
);

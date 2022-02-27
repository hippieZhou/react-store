import axios from "commons/axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Login(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { email, password } = data;
    axios
      .post("/auth/login", { email, password })
      .then((res) => {
        const jwtToken = res.data;
        global.auth.setToken(jwtToken);

        toast.success("Login Success");
        props.history.push("/");
      })
      .catch((error) => {
        const message = error.response.data.message;
        toast.error(message);
      });
  };

  return (
    <div className="login-wrapper">
      <form className="box login-box" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className={`input ${errors.email} && 'is-danger'`}
              name="email"
              type="text"
              placeholder="Email"
              {...register("email", {
                pattern: {
                  value:
                    /^[A-Za-z0-9]+([_\\.][A-Za-z0-9]+)*@([A-Za-z0-9\\-]+\.)+[A-Za-z]{2,6}$/,
                  message: "invalid email",
                },
                required: "email required",
              })}
            />
            {errors.email && (
              <p className="helper has-text-danger">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className={`input ${errors.password} && 'is-danger'`}
              type="password"
              name="password"
              placeholder="Password"
              {...register("password", {
                minLength: {
                  value: 3,
                  message: "cannot be less than 3 digits",
                },
                required: "password required",
              })}
            />
            {errors.password && (
              <p className="helper has-text-danger">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <div className="control">
          <button className="button is-fullwidth is-primary">Login</button>
        </div>
      </form>
    </div>
  );
}

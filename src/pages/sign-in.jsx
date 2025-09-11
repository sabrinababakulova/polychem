import React, { useEffect, useState } from "react";
import { ReactComponent as CloseEye } from "../icons/close-eye.svg";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/isAuth/get-user";
import { getUserInfo } from "../store";
import Cookies from "js-cookie";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userFetched } = useSelector(getUserInfo);
  const token = Cookies.get("token");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleVisibilityChange = () => setPasswordVisible(!passwordVisible);
  const handleClick = () => {
    if (email && password) {
      setLoading(true);
      dispatch(fetchUser({ email, password }));
    } else {
      email ? setError("password") : setError("email");
    }
  };

  useEffect(() => {
    if (userFetched && token) {
      setLoading(false);
      navigate("/");
    }
  }, [userFetched, navigate, token]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleClick();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [email, password]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-grey-border">
      <div className="w-[416px] h-[570px] rounded-lg border-grey-border border shadow-md px-12 py-10 bg-white flex flex-col gap-8">
        <div className="flex text-center flex-col gap-3 px-14">
          <h1 className="text-2xl">Sign In</h1>
          <p className="text-sm text-grey-text">
            Enter your credentials in order to get access to the platform
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p>Email</p>
            <Input
              error={error && error === "email"}
              onChange={(e) => handleEmailChange(e)}
              placeholder="Enter your e-mail"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Password</p>
            <Input
              type={passwordVisible ? "text" : "password"}
              error={error && error === "password"}
              onChange={(e) => handlePasswordChange(e)}
              placeholder="Enter your password"
              icon={
                <CloseEye
                  className={`cursor-pointer ${
                    passwordVisible ? "#000" : "#757682"
                  }`}
                  onClick={handleVisibilityChange}
                />
              }
            />
          </div>
        </div>
        <hr className="border-grey-border" />
        <Button isLoading={loading} text="Sign In" onClick={handleClick} />
      </div>
    </div>
  );
};

export default SignIn;

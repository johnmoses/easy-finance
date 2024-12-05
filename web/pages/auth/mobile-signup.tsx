import Layout from "@/components/layout/auth";
import { apiClient } from "@/clients/axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { log } from "@/utils/logs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { usePageAnalytics } from "@/hooks";
import { useDispatch } from "react-redux";
import { setOtpCode } from "@/store/slices/app";

const MobileSignUpPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const usernameRef = useRef(null);
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState<any>("");
  const [disabled, setDisabled] = useState(true);
  // usePageAnalytics();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const userData = {
      username: username,
      mobile: mobile,
      password: password,
    };
    apiClient
      .post("/mobile-signup/", JSON.stringify(userData))
      .then((response) => {
        if (response.status === 200) {
          setDisabled(true);
          log("Sign up successful: " + response.data);
          dispatch(setOtpCode(response.data.otp));
          router.push({
            pathname: "/auth/signup-verify",
            query: { mode: "mobile" },
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          setMessage(Object.values(error.response.data.message));
        } else {
          setMessage("Signup not successful this time!");
          log("Signup not successful: " + error);
        }
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [username, mobile, password, passwordConfirm, isChecked]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(username)
    ) {
      setMessage(" Enter valid username ");
      return true;
    } else if (
      !/^\+[1-9]{1}[0-9]{0,2}[2-9]{1}[0-9]{2}[2-9]{1}[0-9]{2}[0-9]{4}$/.test(
        mobile
      )
    ) {
      setMessage(" Enter valid mobile number ");
      return true;
    } else if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(password)
    ) {
      setMessage(" Enter valid password ");
      return true;
    } else if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(
        passwordConfirm
      )
    ) {
      setMessage(" Enter valid confirmation ");
      return true;
    } else if (password !== passwordConfirm) {
      setMessage("Passwords do not match");
      return true;
    } else if (isChecked !== true) {
      setMessage("Must agree with terms");
      return true;
    } else {
      setMessage("");
      setDisabled(false);
      return false;
    }
  };

  return (
    <Layout title="Sign up">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex max-w-md flex-col gap-4"
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          Sign Up
        </h1>
        <div className="mb-2 block text-red-600">{message}</div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" />
          </div>
          <Input
            id="username"
            type="text"
            value={username}
            ref={usernameRef}
            placeholder="User name"
            autoCapitalize="false"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="mobile" />
          </div>
          <Input
            id="mobile"
            type="text"
            value={mobile}
            placeholder="Mobile number(+2348...)"
            required
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" />
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password-confirm" />
          </div>
          <Input
            id="password-confirm"
            type="password"
            value={passwordConfirm}
            placeholder="Password Confirmation"
            required
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="agree"
            value={isChecked ? "checked" : "unchecked"}
            checked={isChecked}
            onCheckedChange={() => setIsChecked(!isChecked)}
          />
          <Label htmlFor="agree" className="flex">
            I agree with the&nbsp;
            <Link
              href="/forms"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              terms and conditions
            </Link>
          </Label>
        </div>
        <Button type="submit" disabled={disabled}>
          Register new account
        </Button>
        <div>
          <Link
            href={"/auth/signin"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Sign In |</span>
          </Link>
          <Link
            href={"/auth/email-signup"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">
              Sign up - email |
            </span>
          </Link>
          <Link
            href={"/auth/mobile-signup-verify-resend"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Resend OTP</span>
          </Link>
          {/* <Link
            href={{
              pathname: "/auth/signup-verify",
              query: { mode: "mobile" },
            }}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Verify</span>
          </Link>  */}
        </div>
      </form>
    </Layout>
  );
};

export default MobileSignUpPage;

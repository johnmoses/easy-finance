import Layout from "@/components/layout/auth";
import { apiClient } from "@/clients/axios";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { log } from "@/utils/logs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
// import { usePageAnalytics } from "@/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const PasswordResetVerifyPage: NextPage = () => {
  const router = useRouter();
  const state = useSelector((state: RootState) => state.app);
  const firstRender = useRef(true);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  // usePageAnalytics();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      code: code,
      password: password,
    };
    apiClient
      .post("/password-reset-verify/", JSON.stringify(userData))
      .then((response) => {
        if (response.status === 200) {
          setDisabled(true);
          log("Password reset successful: " + response.data);
          router.push("/auth/signin");
        }
      })
      .catch((error) => {
        setMessage("Password reset not successful this time");
        setDisabled(false);
        log("Password reset not successful: " + error);
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [code, password, passwordConfirm]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(code)
    ) {
      setMessage(" Enter valid code ");
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
    } else {
      setMessage("");
      setDisabled(false);
      return false;
    }
  };

  return (
    <Layout title="Password reset verify">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          Password Reset Verification
        </h1>
        <div className="mb-2 block text-red-600">{message}</div>
        <div>Your OTP is: {state.otpCode}</div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="code" />
          </div>
          <Input
            id="code"
            type="text"
            value={code}
            // ref={usernameRef}
            placeholder="Code"
            autoCapitalize="false"
            required
            onChange={(e) => setCode(e.target.value)}
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
            placeholder="New password"
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
        <Button type="submit" disabled={disabled}>
          Reset
        </Button>
        <div>
          <Link
            href={"/auth/signin"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Sign In</span>
          </Link>
        </div>
      </form>
    </Layout>
  );
};

export default PasswordResetVerifyPage;

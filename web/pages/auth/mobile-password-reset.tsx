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
// import { usePageAnalytics } from "@/hooks";
import { useDispatch } from "react-redux";
import { setOtpCode } from "@/store/slices/app";

const MobilePasswordResetPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState<any>("");
  const [disabled, setDisabled] = useState(true);
  // usePageAnalytics();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      mobile: mobile,
    };
    apiClient
      .post("/mobile-password-reset/", JSON.stringify(userData))
      .then((response) => {
        if (response.status === 200) {
          setDisabled(true);
          log("Password reset initiated: " + response.data);
          if (response.data.otp) {
            dispatch(setOtpCode(response.data.otp));
            router.push("/auth/password-reset-verify");
          }
        }
        if (response.status === 400) {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          setMessage(Object.values(error.response.data.message));
        } else {
          setMessage("Reset not successful this time!");
          log("Reset not successful: " + error);
        }
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [mobile]);

  const validateForm = () => {
    if (
      !/^\+[1-9]{1}[0-9]{0,2}[2-9]{1}[0-9]{2}[2-9]{1}[0-9]{2}[0-9]{4}$/.test(
        mobile
      )
    ) {
      setMessage(" Enter valid mobile number ");
      return true;
    } else {
      setMessage("");
      return false;
    }
  };

  return (
    <Layout title="Password Reset">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex max-w-md flex-col gap-4"
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          Password Reset
        </h1>
        <div className="mb-2 block text-red-600">{message}</div>
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
        <Button type="submit" title="Reset" disabled={disabled}>
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

export default MobilePasswordResetPage;

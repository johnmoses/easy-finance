import Layout from "@/components/layout/auth";
import { apiClient } from "@/clients/axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useRef, useState } from "react";
import { log } from "@/utils/logs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { usePageAnalytics } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from "@/context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setOtpCode } from "@/store/slices/app";

const SignUpVerifyPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.app);
  const firstRender = useRef(true);
  const { toast } = useToast();
  const { track } = useContext(AppContext);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<any>("");
  const [disabled, setDisabled] = useState(true);
  const mode = router.query.mode as string;
  // usePageAnalytics();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    apiClient
      .get(`/signup-verify/${otp}`)
      .then((response) => {
        if (response.status === 200) {
          // setDisabled(true);
          dispatch(setOtpCode(""));
          log("Account verified " + response.data);

          toast({
            title: "Account Verified",
            description: "Your account has been verified. Thanks!",
          });
          track("Verifed account", `OTP: ${otp}`);
          router.push("/auth/signin");
        }
      })
      .catch((error:any) => {
        if (error.response) {
          setMessage(Object.values(error.response.data.message));
        } else {
          setMessage("Verification not successful this time!");
          log("Verification not successful: " + error);
        }
      });
  };

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [otp]);

  const validateForm = () => {
    if (!/^(?!\s*$).+/.test(otp)) {
      setMessage(" Invalid otp ");
      return true;
    } else {
      setMessage("");
      return false;
    }
  };

  return (
    <Layout title="Sign up verification">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex max-w-md flex-col gap-4"
      >
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          Verify Code
        </h1>
        <div className="mb-2 block text-red-600">{message}</div>
        <div>Your OTP is: {state.otpCode}</div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="otp" />
          </div>
          <Input
            id="otp"
            type="text"
            value={otp}
            placeholder="OTP Code"
            required
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          title="Verify"
          disabled={disabled}
          // onClick={() => handleSubmit()}
        >
          Verify
        </Button>
        <div>
          {mode === "email" && (
            <Link
              href={"/auth/email-signup-verify-resend"}
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              <span className="text-blue p-2 hover:text-gray-400">
                Resend Code
              </span>
            </Link>
          )}
          {mode === "mobile" && (
            <Link
              href={"/auth/mobile-signup-verify-resend"}
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              <span className="text-blue p-2 hover:text-gray-400">
                Resend Code
              </span>
            </Link>
          )}
        </div>
      </form>
    </Layout>
  );
};

export default SignUpVerifyPage;

import Layout from "@/components/layout/auth";
import { AppContext } from "@/context/AppContext";
import { useTokenAuthMutation } from "@/gql/schemas";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useRef, useState } from "react";
import { log } from "@/utils/logs";
import { useDispatch } from "react-redux";
import { setAuth, setToken } from "@/store/slices/app";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
// import { usePageAnalytics } from "@/hooks";

const SignInPage: NextPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tokenAuth, { data, loading, error }] = useTokenAuthMutation({
    variables: {
      username: username,
      password: password,
    },
  });
  const usernameRef = useRef(null);
  const router = useRouter();
  // usePageAnalytics();

  const { showhelp, showchat, setup } = useContext(AppContext);

  const handleSignIn = async (tokenAuth: any) => {
    try {
      const res = await tokenAuth();
      // console.log("Token Auth: ", res.data?.tokenAuth?.token);
      if (res) {
        localStorage.setItem("authToken", res.data?.tokenAuth?.token);
        log("Got token, setting up account!");
        setup();
        dispatch(setToken(res.data?.tokenAuth?.token));
        dispatch(setAuth(true));
        await router.push("/");
      }
    } catch (e) {
      setMessage("Please enter valid user name and password!");
      log("Sign in not successful!");
      // console.log("Sign-in error: ", e);
    }
  };

  return (
    <Layout title="Sign in">
      <form className="flex max-w-md flex-col gap-4">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          Sign In
        </h1>
        <div>{message}</div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" />
          </div>
          <Input
            id="username"
            type="text"
            value={username}
            ref={usernameRef}
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
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
        <Button
          type="submit"
          title="Sign in"
          disabled={
            loading ||
            !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(
              username
            ) ||
            !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(
              password
            )
          }
          onClick={() => handleSignIn(tokenAuth)}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div>Sign In</div>
          )}
        </Button>
        <div>
          Sign up?
          <Link
            href={"/auth/email-signup"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Email</span>
          </Link>{" "}
          |
          <Link
            href={"/auth/mobile-signup"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Mobile</span>
          </Link>
        </div>
        <div>
          Forgot password?
          <Link
            href={"/auth/email-password-reset"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Email</span>
          </Link>{" "}
          |
          <Link
            href={"/auth/mobile-password-reset"}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Mobile</span>
          </Link>
        </div>
        <div>
          <Link
            onClick={() => showhelp("SGVscFR5cGU6Mg==")}
            href={""}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">
              Learn more...
            </span>
          </Link>{" "}
          |
          <Link
            onClick={() => showchat()}
            href={""}
            className="text-cyan-600 hover:underline dark:text-cyan-500"
          >
            <span className="text-blue p-2 hover:text-gray-400">Chat</span>
          </Link>
        </div>
      </form>
    </Layout>
  );
};

export default SignInPage;

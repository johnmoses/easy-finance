import { AppContext } from "@/context/AppContext";
import React, { useContext } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "../theme/theme-toggle";
import { apixURL } from "@/clients/utils";

const Header = () => {
    const { showhelpcats, showchat, signout } = useContext(AppContext);
    const state = useSelector((state: RootState) => state.app);

    return (
        <header className="m-0 fixed border-b dark:border-none dark:bg-slate-800 dark:text-white py-3 top-0 w-full z-50">
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <img className="h-8 w-auto" src="/logo.png" alt="" />
                    </Link>
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="p-2">Easy Finance</span>
                    </Link>
                </div>
                <Link href="/portfolios">
                    <div className="block mr-5">
                        <span className="p-1">Portfolios</span>
                    </div>
                </Link>
                {!state.isAuth && (
                    <Link href="/auth/signin">
                        <div className="block mr-5">
                        <span className="p-1">Sign In</span>
                        </div>
                    </Link>
                    )}
                <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <svg
              width={"100%"}
              className="w-6 h-6"
              viewBox="0 0 32 32"
              style={{ fill: "blue" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <title />
              <g data-name="Square Menu Alt" id="Square_Menu_Alt">
                <path d="M17.5,11h-3a2,2,0,0,1-2-2V6a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2V9A2,2,0,0,1,17.5,11Z" />
                <path d="M9,11H6A2,2,0,0,1,4,9V6A2,2,0,0,1,6,4H9a2,2,0,0,1,2,2V9A2,2,0,0,1,9,11Z" />
                <path d="M26,11H23a2,2,0,0,1-2-2V6a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2V9A2,2,0,0,1,26,11Z" />
                <path d="M17.5,28h-3a2,2,0,0,1-2-2V23a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2v3A2,2,0,0,1,17.5,28Z" />
                <path d="M9,28H6a2,2,0,0,1-2-2V23a2,2,0,0,1,2-2H9a2,2,0,0,1,2,2v3A2,2,0,0,1,9,28Z" />
                <path d="M26,28H23a2,2,0,0,1-2-2V23a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2v3A2,2,0,0,1,26,28Z" />
                <path d="M17.5,19.5h-3a2,2,0,0,1-2-2v-3a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2v3A2,2,0,0,1,17.5,19.5Z" />
                <path d="M9,19.5H6a2,2,0,0,1-2-2v-3a2,2,0,0,1,2-2H9a2,2,0,0,1,2,2v3A2,2,0,0,1,9,19.5Z" />
                <path d="M26,19.5H23a2,2,0,0,1-2-2v-3a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2v3A2,2,0,0,1,26,19.5Z" />
              </g>
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-46">
            <DropdownMenuItem>
              <Link
                href="/portfolios"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Portfolios
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/stocks"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Stocks
              </Link>
            </DropdownMenuItem>
            {!state.isAuth && (
              <>
                <DropdownMenuItem>
                  <Link
                    href="/auth/signin"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Sign in
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/auth/email-signup"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Sign up
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem>
              <Link
                onClick={() => showchat()}
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Chat
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                onClick={() => showhelpcats()}
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Help
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {state.isAuth && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="ml-2">
                  <AvatarImage
                    src={
                      state.authUserAvatar
                        ? `${apixURL}/static/uploads/users/${state.authUserAvatar}`
                        : `${apixURL}/static/uploads/users/user.svg`
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-46">
                <DropdownMenuItem>
                  <Link href="/users/me">{state.authUserName}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/users/lists">My Lists</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/admin"}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <ThemeToggle />
            </nav>
        </header>
    )
}

export default Header;
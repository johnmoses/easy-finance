import React, { useState } from "react";

interface IProps {
  placeholder?: string;
  isNotShown?: boolean;
  doSearch: (search: string) => void;
}

export const SearchBox = ({ placeholder, isNotShown, doSearch }: IProps) => {
  const [search, setSearch] = useState("");
  return (
    <div className="flex">
      {!isNotShown ? (
        <>
          <label className="sr-only">Search</label>
          <div className="relative w-full">
            <input
              value={search}
              type="search"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder={placeholder ? placeholder : "Search..."}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  doSearch(search);
                }
              }}
            />
            <button
              onClick={() => doSearch(search)}
              type="submit"
              className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

import React, { useState, createContext } from "react";
import { set } from "react-ga";

export const SearchContext = createContext();

const SearchContextProvider = props => {
  const [searchPref, setSearchPref] = useState({
    page: 1,
    job_title: null,
    company_name: null,
    filter_companies: new Set(),
  });

  const incPage = () => {
    setSearchPref({
      ...searchPref,
      page: searchPref.page + 1,
    })
  }

  const resetSearchPref = (params) => {
    setSearchPref({
      ...searchPref,
      page: 1,
      job_title: null,
      company_name: null,
      ...params,
    })
  }

  return <SearchContext.Provider value={{ searchPref, setSearchPref, incPage, resetSearchPref }}>{props.children}</SearchContext.Provider>;
};

export default SearchContextProvider;
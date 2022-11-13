import React, { useState, createContext } from "react";

export const JobContext = createContext();

const JobContextProvider = props => {
  const [jobs, setJobs] = useState([]);

  return <JobContext.Provider value={{ jobs, setJobs }}>{props.children}</JobContext.Provider>;
};

export default JobContextProvider;
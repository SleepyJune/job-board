import React, { useState, createContext } from "react";

export const UserContext = createContext();

const UserContextProvider = props => {
  const [user, setUser] = useState({
    isLoggedIn: false
  });

  const [appliedJobs, setAppliedJobs] = useState();

  return <UserContext.Provider value={{ user, setUser, appliedJobs, setAppliedJobs }}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;
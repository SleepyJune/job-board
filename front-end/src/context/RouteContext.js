import React, { useState, createContext } from "react";

export const RouteContext = createContext();

const RouteContextProvider = props => {
  const [route, setRoute] = useState("Home");

  return <RouteContext.Provider value={{ route, setRoute }}>{props.children}</RouteContext.Provider>;
};

export default RouteContextProvider;
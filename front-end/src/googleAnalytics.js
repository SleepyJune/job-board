import React from "react";
import ReactGA from "react-ga";

const useEventTracker = (category="Website", action="Test", label="Test") => {
  const eventTracker = () => {
    ReactGA.event({category, action, label});
  }
  return eventTracker;
}

export default useEventTracker;
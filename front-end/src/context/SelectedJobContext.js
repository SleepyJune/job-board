import React, { createContext, useState } from "react";

export const SelectJobContext = createContext();

const SelectJobContextProvider = (props) => {
    const [selectedJob, setSelectedJob] = useState({
        job: null,
        description: null,
        loading: true,
      });

    return (
        <SelectJobContext.Provider value={{selectedJob, setSelectedJob}}>
            {props.children}
        </SelectJobContext.Provider>
    );
}

export default SelectJobContextProvider;
import React, {useContext} from "react";
import {Submission} from "./type";

export const DataContext = React.createContext<{submissions: Submission[]}>({
    submissions: []
})

export const useSubmissions = () => {
    const data = useContext(DataContext)
    return data.submissions;
}
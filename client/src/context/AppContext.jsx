import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    //this is created for what we enter in search is fetched here
    const[searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })

    //Whenever user searches a data it becomes true/false
    const [isSearched, setIsSearched] = useState(false)

    //For Recruiter Login
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [jobs, setJobs] = useState([])
    //Function to fetch job data
    const fetchJobs = async () =>{
        setJobs(jobsData)
    }

    useEffect(() =>{
        fetchJobs()
    })

    const value = {
        //Whenever we'll add anything in value like state variables or function then we can access those variables and functions in entire project
        setSearchFilter, searchFilter,
        setIsSearched, isSearched,
        setJobs, jobs,
        setShowRecruiterLogin, showRecruiterLogin,
    }

    return (<AppContext.Provider value = {value}>
        {props.children}
    </AppContext.Provider>)


}
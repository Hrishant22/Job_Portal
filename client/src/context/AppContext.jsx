import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const {user} = useUser()
    const {getToken} = useAuth()

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

    const[companyToken, setCompanyToken] = useState(null)
    const[companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setuserApplications] = useState([])

    //Function to fetch job data
    const fetchJobs = async () =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/jobs')

            if(data.success){
                setJobs(data.jobs)
                console.log(data.jobs);
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to fetch company data
    const fetchCompanyData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/company/company', {headers: {token: companyToken}})
            if(data.success){
                setCompanyData(data.company)
                console.log(data)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    //Function to fetch user data
    const fetchUserData = async () => {
        try {
            
            const token = await getToken()

            const {data} = await axios.get(backendUrl+'/api/users/user',
                {headers: {Authorization: `Bearer ${token}`}}
            )
            if (data.success) {
                setUserData(data.user)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to get user applied application data
    const fetchUserApplications = async () => {
        try {
            
            const token = await getToken()

            const {data} = await axios.get(backendUrl + '/api/users/appliations',
                {headers: {Authorization : `Bearer ${token}`}}
            )

            if (data.success) {
                setuserApplications(data.applications)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() =>{
        fetchJobs()
        const storedCompanyToken = localStorage.getItem('companyToken')

        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)
        }
    }, [])

    useEffect(() =>{
        if(companyToken){
            fetchCompanyData()
        }

    }, [companyToken])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserApplications()
        }
    },[user])

    const value = {
        //Whenever we'll add anything in value like state variables or function then we can access those variables and functions in entire project
        setSearchFilter, searchFilter,
        setIsSearched, isSearched,
        setJobs, jobs,
        setShowRecruiterLogin, showRecruiterLogin,
        setCompanyToken, companyToken,
        setCompanyData, companyData,
        backendUrl,
        setUserData, userData,
        setuserApplications, userApplications,
        fetchUserData,
        fetchUserApplications

    }

    return (<AppContext.Provider value = {value}>
        {props.children}
    </AppContext.Provider>)


}
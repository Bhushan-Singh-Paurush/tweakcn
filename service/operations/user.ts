import { apiConnector } from "../apiConnector"
import { GET_USERS } from "../apis"



export const fetchUser=async(search:string)=>{
       try {
           const{data:response}=await apiConnector(`${GET_USERS}?search=${search}`,"GET")

           return response
       } catch (error) {
          console.log(error)
       }
}
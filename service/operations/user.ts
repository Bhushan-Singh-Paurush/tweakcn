import { apiConnector } from "../apiConnector"
import { GET_USERS, SEARCH_USER } from "../apis"



export const fetchUsers=async():Promise<UserResponse>=>{
       try {
           const{data:response}=await apiConnector(`${GET_USERS}`,"GET")

           return response
       } catch (error) {
          throw error
       }
}

export const searchUser=async(name:string):Promise<UserResponse>=>{
       try {
           const{data:response}=await apiConnector(`${SEARCH_USER}/search`,"POST",{name})

           return response
       } catch (error) {
          throw error
       }
}
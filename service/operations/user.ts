import { apiConnector } from "../apiConnector"
import { GET_USERS } from "../apis"



export const fetchUsers=async():Promise<UserResponse>=>{
       try {
           const{data:response}=await apiConnector(`${GET_USERS}`,"GET")

           return response
       } catch (error) {
          throw error
       }
}
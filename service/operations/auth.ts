import { loginSchema } from "@/components/login-form";
import * as z from "zod"
import { apiConnector } from "../apiConnector";
import { FORGOT_PASSWORD, LOGIN, LOGOUT, REFRESH_TOKEN, RESET_PASSWORD, SEND_LOGIN_OTP } from "../apis";


export const login=async(data: z.infer<typeof loginSchema>,otp:string)=>{
       try {
           const{data:response}=await apiConnector(LOGIN,"POST",{...data,otp})
           
           return response
       
        } catch (error) {
          console.log(error)
       }
}

export const refreshToken=async()=>{
   try {
       const{data:response}=await apiConnector(REFRESH_TOKEN,"POST")

       return response;
   } catch (error) {
      throw error
   }
}

export const sendLoginOTP=async(email:string)=>{
   try {
      const{data:response}=await apiConnector(SEND_LOGIN_OTP,"POST",{email})
      
      return response;
   
   } catch (error) {
      throw error
   }
}

export const forgotPasswordService=async(email:string)=>{
   try {
      const{data:response}=await apiConnector(FORGOT_PASSWORD,"POST",{email})
      
      return response;
   
   } catch (error) {
      throw error
   }
}

export const resetPasswordService=async(password:string,token:string)=>{
   try {
      const{data:response}= await apiConnector(RESET_PASSWORD,"POST",{password,token})

      return response;
   } catch (error) {
      console.log(error)
      
   }
}

export const logout=async()=>{
   try {
       await apiConnector(LOGOUT,"POST")

       return ;
   } catch (error) {
      throw new Error("Logout Failed");
   }
}
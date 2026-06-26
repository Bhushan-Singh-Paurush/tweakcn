"use client"
import { LoginForm } from "@/components/login-form"
import { useAppDispatch } from "@/hooks/reduxHook"
import { refreshToken } from "@/service/operations/auth"
import { addUser } from "@/slices/user"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {BounceLoader} from "react-spinners"
import { motion } from "framer-motion"

export default function LoginPage() {
  
  const[loading,setLoading]=useState(true)
  const dispatch=useAppDispatch()

  const route = useRouter()
  useEffect(()=>{
        (async()=>{
          try {
              const result = await refreshToken()

              dispatch(addUser(result.data))

              
              if(result.data.role==="client")
                route.push("/client")
              else
                route.push("/admin/dashboard")
              
          } catch (error) {
            console.log(error)
            setLoading(false)  
          }
        })()
  },[dispatch,route])

  
  if(loading)
    return (
    <div className="w-screen h-screen flex items-center justify-center">
     <BounceLoader color="#34a85a"/>
    </div>
    );
  
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full max-w-sm flex-col gap-6"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
           M
          </div>
          Motion Tech
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        >
          <LoginForm />
        </motion.div>
      </motion.div>
    </div>
  )
}

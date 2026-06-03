"use client"
import { LoginForm } from "@/components/login-form"
import { useAppDispatch } from "@/hooks/reduxHook"
import { refreshToken } from "@/service/operations/auth"
import { addUser } from "@/slices/user"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {BounceLoader} from "react-spinners"
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
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div  className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
           M
          </div>
          Motion Tech
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

"use client"
import React, { createContext, useState } from 'react'


export const sidebarContext=createContext({
    open:true,
    setOpen:(value:boolean)=>{}
})

export const SidebarProvider = ({children}:{children:React.ReactNode}) => {
  
    const[open,setOpen]=useState<boolean>(true)
  
    return (
       <sidebarContext.Provider value={{open,setOpen}}>
           {children}
       </sidebarContext.Provider>
  )
}

export default SidebarProvider
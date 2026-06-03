"use client"
import React, { useContext } from 'react'
import {PanelRightOpen} from "lucide-react"
import { sidebarContext } from '@/context/sidebar-context'
import ProfileInfo from './ProficeInfo'
const Topbar = () => {
  const{setOpen,open}=useContext(sidebarContext)
  return (
    <div className=' h-[50px] w-full border-b flex justify-between items-center'>

        <div className=' flex items-center gap-4'>
             <PanelRightOpen onClick={()=>setOpen(!open)} size={20}/>
             <div className='w-px h-[20px] bg-border'></div>
        </div>

        <div><ProfileInfo/></div>
    </div>
  )
}

export default Topbar
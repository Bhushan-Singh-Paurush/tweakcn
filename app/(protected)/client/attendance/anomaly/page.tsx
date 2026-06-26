"use client"
import ReactTable from '@/components/table/reactTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'


const array = [
  { timestamp: "2026-06-11 09:00:00", number: "9876543210", role: "Admin" },
  { timestamp: "2026-06-11 09:05:12", number: "9876543211", role: "User" },
  { timestamp: "2026-06-11 09:10:25", number: "9876543212", role: "Manager" },
  { timestamp: "2026-06-11 09:15:40", number: "9876543213", role: "User" },
  { timestamp: "2026-06-11 09:20:18", number: "9876543214", role: "Guest" },
  { timestamp: "2026-06-11 09:25:30", number: "9876543215", role: "Admin" },
  { timestamp: "2026-06-11 09:30:11", number: "9876543216", role: "User" },
  { timestamp: "2026-06-11 09:35:50", number: "9876543217", role: "Manager" },
  { timestamp: "2026-06-11 09:40:22", number: "9876543218", role: "Guest" },
  { timestamp: "2026-06-11 09:45:09", number: "9876543219", role: "User" },

  { timestamp: "2026-06-11 10:00:00", number: "9876543220", role: "Admin" },
  { timestamp: "2026-06-11 10:05:17", number: "9876543221", role: "User" },
  { timestamp: "2026-06-11 10:10:41", number: "9876543222", role: "Manager" },
  { timestamp: "2026-06-11 10:15:29", number: "9876543223", role: "Guest" },
  { timestamp: "2026-06-11 10:20:13", number: "9876543224", role: "User" },
  { timestamp: "2026-06-11 10:25:54", number: "9876543225", role: "Admin" },
  { timestamp: "2026-06-11 10:30:36", number: "9876543226", role: "Manager" },
  { timestamp: "2026-06-11 10:35:07", number: "9876543227", role: "User" },
  { timestamp: "2026-06-11 10:40:48", number: "9876543228", role: "Guest" },
  { timestamp: "2026-06-11 10:45:15", number: "9876543229", role: "Admin" },
];


const Anomaly = () => {
  const [state,setState]=useState({email:"",password:"",name:"",status:false})
  
  const [error,setError]=useState({email:"",password:"",name:"",status:""})
  
  const [open,setOpen]=useState(false)

  const [file,setFile]=useState<File | null>(null)

  const [image,setImage]=useState<string>("")

  function validator(){
    const newError={
      email:"",
      name:"",
      password:"",
      status:""
    }

    if(state.email.trim()==="")
      newError.email="Email is required"
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email))
      newError.email="Invalid email formate"
    
    setError((pre)=>({...pre,email:newError.email}))
    
    if(state.password.trim()==="")
      newError.password="Password is required"
    else if(!/^.{8,}$/.test(state.password))
      newError.password="Invalid Password formate"
    
    setError((pre)=>({...pre,password:newError.password}))


    if(state.name.trim()==="")
      newError.name="Name is required"
    else if(!/^.{3,}$/.test(state.name))
      newError.name="Invalid Name formate"
    
    setError((pre)=>({...pre,name:newError.name}))
    

    
    if(state.status!==true)
      newError.status="Please tick the box"
    
    setError((pre)=>({...pre,status:newError.status}))


    return Object.values(newError).every((error)=>error==="")
    

  }



  function onSubmitHandler(e:React.FormEvent){
          e.preventDefault()

          if(validator()){
            try {
              console.log("make api call")
            } catch (error) {
              
            }
          }
  }



  return (
    
    <div>
    
    {/* <form onSubmit={onSubmitHandler} className=' flex flex-col gap-4 my-10 '>
     
<label htmlFor='email'>Email</label>
<input type="text" id='email' name='email' className={` border w-fit ${error.email ? "border-destructive" : ""}`} onChange={changeHandler} value={state.email}/>
{error.email && <div>{error.email}</div>}

<label htmlFor='password'>Password</label>
<input type="password" id='password' name='password' className={` border w-fit ${error.password ? "border-destructive" : ""}`} onChange={changeHandler} value={state.password}/>
{error.password && <div>{error.password}</div>}


<label htmlFor='name'>Name</label>
<input type="text" id='name' name='name' className={` border w-fit ${error.name ? "border-destructive" : ""}`} onChange={changeHandler} value={state.name}/>
{error.name && <div>{error.name}</div>}


<label htmlFor='status'>Status</label>
<input type="checkbox" id='status' name='status' className={` border w-fit ${error.status ? "border-destructive" : ""}`} onChange={changeHandler} checked={state.status}/>
{error.status && <div>{error.status}</div>}

<button type='submit'>Submit</button>
      
    </form>
    

    <ReactTable previous={()=>{}} next={()=>{}} page={1} data={array}/>
    */}
    <Button onClick={()=>setOpen(!open)}>Add</Button>
    {open && <div className=' w-full h-full flex items-center justify-center left-0 top-0 absolute bg-border/80 '>
      <Card className=' mt-20 w-[400px] h-[200px] '>
          <CardHeader>
            <CardTitle className=' flex items-center justify-between w-full'>
              <h1>Add</h1>
              <Button onClick={()=>setOpen(!open)} variant="outline">X</Button>
            </CardTitle>
          </CardHeader>

          <CardContent className=' flex flex-col items-center'>
            {image!=="" && <img src={image} alt='image' className=' w-[100px] h-[100px] rounded-2xl'/>}
            <Label>
               <div>Add Image</div>

               <Input type='file' accept='image/*' onChange={()=>{}} className=' hidden'/>
            </Label>
          </CardContent>
      </Card>
    
    </div>}
   
   
    </div>
  )
}

export default Anomaly
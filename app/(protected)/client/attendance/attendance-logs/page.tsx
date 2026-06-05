"use client"
import { Card, CardContent } from '@/components/ui/card'

import React, { useState } from 'react'

const Attendance = () => {

  const[search,setSearch]=useState<string>("")
  const[users]=useState<{name:string}[]>([])
  
  // useEffect(()=>{
  //   async function getUser() {
  //        const result  = await fetchUser(search)
  //        setUsers(result.data)
  //   }

  //   if(search.length===3)
  //     getUser();
    
    
  // },[search])


  return (
    <div>
      <input value={search} onChange={(e)=>setSearch(e.target.value)} type='text' placeholder='Search Bar'/>
       
       {users.length>0 && <div>
       <Card className=' w-fit'>
        <CardContent className=' flex flex-col gap-2 w-fit'>{users.map((ele:{name:string},index:number)=>(
          <button onClick={()=>setSearch(ele.name)} key={index}>{ele.name}</button>
        ))}</CardContent>
       </Card>
       </div>}
    
    </div>
  )
}

export default Attendance
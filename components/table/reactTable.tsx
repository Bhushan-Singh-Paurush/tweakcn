"use client"
import React, {useMemo, memo} from 'react'
import { Button } from '../ui/button'

interface Props{
  data:Record<string,string | number>[],
  page:number,
  next:()=>void,
  previous:()=>void
}

const ReactTable = ({data,next,previous,page}:Props) => {
      
      const col = useMemo(()=>{
        if(data.length!==0){
          return Object.keys(data[0])
        }      
      },[data])
    
  
    return (
    <div>
     <table className="w-full h-screen border-collapse border border-gray-300  shadow-sm rounded-lg overflow-hidden">
  <thead>
    <tr >
      {col && col.map((ele, index) => (
        <th
          key={index}
          className="border border-gray-300 px-4 py-3 text-left font-semibold capitalize"
        >
          {ele}
        </th>
      ))}
    </tr>
  </thead>

  <tbody>
    {data.map((ele, index1) => {
      const value = Object.values(ele);

      return (
        <tr
          key={index1}
          className="hover:bg-gray-900 transition-colors"
        >
          {value.map((item, index2) => (
            <td
              key={`${index1}-${index2}`}
              className="border border-gray-300 px-4 py-3"
            >
              {String(item)}
            </td>
          ))}
        </tr>
      );
    })}
  </tbody>
</table>
<div className=' flex items-center justify-end gap-4'>
  <Button variant="secondary" onClick={()=>previous()}>Previous</Button>
 <Button variant="outline" disabled>{page}</Button>
 <Button variant="secondary" onClick={()=>next()}>Next</Button>
</div>
    </div>
  )
}

export default memo(ReactTable)

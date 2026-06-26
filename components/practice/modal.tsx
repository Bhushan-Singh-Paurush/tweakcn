import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'


interface Props{
  heading:string,
  subHeading:string,
  cancel:()=>void,
  submit:()=>void
}
const Modal = ({heading,subHeading,cancel,submit}:Props) => {
  return (
    <div className='absolute top-0 right-0 w-full bg-border/80 h-full z-50 flex justify-center'>
          <Card className=' h-[200px] mt-40 fixed w-[400px]'>
            <CardHeader>
              <CardTitle>{heading}</CardTitle>
              <div>{subHeading}</div>
            </CardHeader>
            <CardContent>
              <div className=' w-full items-center justify-between'>
                    <Button variant="destructive" onClick={()=>cancel()}>Cancel</Button>
                     <Button variant="default" onClick={()=>submit()}>Submit</Button>
              </div>
            </CardContent>
          </Card>
    </div>
  )
}

export default Modal

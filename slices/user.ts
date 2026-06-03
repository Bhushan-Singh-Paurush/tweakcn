import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Module{
         module_name:String,
         subModule_name:String,
         read:boolean,
         write:boolean
}


interface User{
    name:string,
    email:string,
    logo?:string,
    _id:string,
    role:["client","admin"],
    modulesDetails:Module[]
}


const initialState=null


const userSlice=createSlice({
    name:"user",
    initialState:initialState as User | null,
    reducers:{
        addUser:(_,action:PayloadAction<User>)=>{
                return action.payload
        },
        removeUser:()=>{
            null
        }
    }
})

export const{addUser,removeUser}=userSlice.actions
export default userSlice.reducer
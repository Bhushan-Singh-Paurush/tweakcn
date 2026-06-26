import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface Cart{
    productId:string,
    name:string,
    image:string,
    price:number,
    size:"xs" |"s" | "m" | "l" | "xl" | "2xl" | "3xl" | "4xl",
    color:string
}

const initialState:Cart[]=[]

const cartSlice=createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        addToCart:(state,action:PayloadAction<Cart>)=>{
            state.push(action.payload)
        },
        removeFromCart:(state,action:PayloadAction<{productId:string}>)=>{
            const index = state.findIndex((ele)=>ele.productId===action.payload.productId)
            
            
            if(index!==-1)
            state.slice(index,1)
        },
        clearCart:()=>{
            return []
        }
    }
})

export const{addToCart,removeFromCart,clearCart}=cartSlice.actions

export default cartSlice.reducer
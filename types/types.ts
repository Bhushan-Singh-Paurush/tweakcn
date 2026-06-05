interface User{
    name:string
    email:string
    role:string
    logo?:string
    createdAt:string
    phone?:string
}

interface UserResponse{
     success:boolean;
     message:string;
     data:User[]   
}
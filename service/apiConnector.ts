import axios, { AxiosRequestConfig } from "axios"


const axiosInstance=axios.create({
    withCredentials:true
})

export const apiConnector=(url:string,method:string,bodyData?: any,headers?: AxiosRequestConfig["headers"],params?: AxiosRequestConfig["params"])=>{
    return axiosInstance({
          url:`${url}`,
          method:`${method}`,
          data:bodyData ? bodyData : null,
          headers:headers ? headers : undefined,
          params:params ? params : undefined
    })
}
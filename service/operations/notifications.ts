import { apiConnector } from "../apiConnector";
import { GET_NOTIFICATION, GET_SECURITY_PERSON, SEND_NOTIFICATION } from "../apis";



export async function getNotifications() {
    try {
        const{data:response}=await apiConnector(`${GET_NOTIFICATION}`,"GET")

        return response
    } catch (error) {
        throw error;
    }
}

export async function getNotificationById(id:string) {
    try {
        const{data:response}=await apiConnector(`${GET_NOTIFICATION}/${id}`,"GET")

        return response
    } catch (error) {
        throw error;
    }
}


export async function getSecurityPerson() {
    try {
        const{data:response}=await apiConnector(GET_SECURITY_PERSON,"GET")

        return response
    } catch (error) {
        console.log(error)
    }
}


export async function sendNotification(recipientEmails:string,emailSubject:string,emailBody:string) {
    try {
        
        await apiConnector(SEND_NOTIFICATION,"POST",{recipientEmails,emailSubject,emailBody})
        
        return ;
        
    } catch (error) {
       throw error;
       
    }
}


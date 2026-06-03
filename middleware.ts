import { NextRequest, NextResponse } from "next/server";
import { WEBSITE_LOGIN } from "./routes/auth";
import { jwtVerify } from "jose";
import { ADMIN_DASHBOARD } from "./routes/admin";
import { CLIENT_HOME_PAGE } from "./routes/client";

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    
    if (path.startsWith("/auth")) {
        return NextResponse.next();
    }

    const hasToken = request.cookies.has("accessToken");

    if (!hasToken) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }


    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
    );

    
       if(path==="/"){
        if(payload.role=="client")
           return NextResponse.redirect(new URL(CLIENT_HOME_PAGE,request.nextUrl))
        else
           return NextResponse.redirect(new URL(ADMIN_DASHBOARD,request.nextUrl))   
    }



    if (path.startsWith("/client")) {

      if(payload.role=="client"){  
      const endPoints = path.split("/");

      if(endPoints.length<3)
        return NextResponse.next();

      if (
        Array.isArray(payload.modulesDetails) &&
        payload.modulesDetails.some(
          (ele: { module_name: string; subModule_name: string }) =>
            ele.module_name === endPoints[2] && ele.subModule_name===endPoints[3].replace("-"," "),
        )
      ) {
        return NextResponse.next();
      }else{
        return NextResponse.redirect(new URL(CLIENT_HOME_PAGE,request.nextUrl))
      }
    }else{
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD,request.nextUrl))
    }
    }

    if(path.startsWith("/admin")){

        if(payload.role==="admin")
            return NextResponse.next();
        else
            return NextResponse.redirect(new URL(CLIENT_HOME_PAGE,request.nextUrl))  
    }

  } catch (error) {
    const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    response.cookies.delete("accessToken");
    return response;
  }

}

export const config={
    matcher:["/","/admin/:path*","/client/:path*","/auth/:path*"]
}

"use client";

import { sidebarContext } from "@/context/sidebar-context";
import { sidebarData } from "@/data";

import { useAppSelector } from "@/hooks/reduxHook";
import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Sidebar = () => {
  const params = usePathname();
  const { open } = useContext(sidebarContext);

  const user = useAppSelector((state) => state.user);
  const[isMounted,setIsMounted]=useState(false)
  useEffect(()=>{
    setIsMounted(true)
  },[])

  function checkPath(path: string) {
    return params === path;
  }

  if(!isMounted)
    return null;


  return (
    <div
      className={`${open ? "w-[250px]" : "w-0"} overflow-x-hidden transition-all duration-200`}
    >
      <div className="w-full h-[50px] flex items-center justify-center">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            M
          </div>
          Motion Tech
        </div>
      </div>

      <div className=" p-4 flex flex-col gap-4 text-sm">
        {user?.role=="client" && <Link
          href={"/client"}
          className={`flex gap-2 capitalize items-center p-1 rounded-sm ${checkPath("/client") ? "bg-primary" : "hover:bg-secondary transition-all duration-100"}`}
        >
          <House className=" w-4" />
          Home
        </Link>}
        {sidebarData.length > 0 &&
          user?.modulesDetails  &&
          sidebarData.map((ele, index1) => {
            if (
              user?.modulesDetails.some(
                (value) => value.module_name === ele.module,
              )
            ) {
              return (
                <div key={index1} className=" flex flex-col gap-1">
                  <h3 className=" capitalize text-border">{ele.module}</h3>

                  <div className=" flex flex-col gap-1">
                    {ele.subModules.map((item, index2) => {
                      if (
                        user.modulesDetails.some(
                          (x) =>
                            x.module_name === ele.module &&
                            x.subModule_name === item.name,
                        )
                      ) {
                        return (
                          <Link
                            href={item.path}
                            key={index2}
                            className={` text-xs flex gap-2 capitalize items-center p-1 rounded-sm ${checkPath(item.path) ? "bg-primary" : "hover:bg-secondary transition-all duration-100"}`}
                          >
                            {" "}
                            <item.icon className=" w-4" />
                            {item.name}
                          </Link>
                        );
                      } else return null;
                    })}
                  </div>
                </div>
              );
            } else return null;
          })}
      </div>
    </div>
  );
};

export default Sidebar;

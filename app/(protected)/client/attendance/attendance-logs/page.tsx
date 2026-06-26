"use client";
import { Card, CardContent } from "@/components/ui/card";
import { fetchUsers, searchUser } from "@/service/operations/user";

import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<{ name: string }[]>([]);

  async function getUser() {
    try {
      const result = await searchUser(search);
      setUsers(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    if(search.trim()==="")
    return ;

    const timer = setTimeout(() => {
      getUser();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);
 


  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Search Bar"
      />

      {users.length > 0 && (
        <div>
          <Card className=" w-fit">
            <CardContent className=" flex flex-col gap-2 w-fit">
              {users.map((ele: { name: string }, index: number) => (
                <button onClick={() => setSearch(ele.name)} key={index}>
                  {ele.name}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Attendance;

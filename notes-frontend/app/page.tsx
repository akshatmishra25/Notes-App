"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
interface userInterface {
  id : number,
  name: string,
  username : string,
  text : string,
}

export default function Home() {

  const [users , setUsers] = useState<userInterface[]>([])
  const fetchUsers = async ()=>{
    try {
      const {data} = await axios.get("http://localhost:3000/user")
      console.log(data);
      setUsers(data);
    } catch (error) {
      alert("Something went wrong!");
      console.log("error");
    }
  }

  useEffect(()=>{
    fetchUsers()
  },[])
  return (
    <h1 className="text-3xl text-blue font-bold underline">
      Hello world!
    </h1>
  );
}

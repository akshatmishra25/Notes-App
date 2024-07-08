"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useRouter } from "next/navigation";
interface userInterface {
  id: number;
  name: string;
  username: string;
  text: string;
}
interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}
const CustomButtonComponent = () => {
  return (
    <Tooltip title="Edit">
      <Button    icon={<EditOutlined />}>Edit</Button>
    </Tooltip>
  );
};
export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<userInterface[]>([]);
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/user");
      console.log(data);
      setUsers(data);
    } catch (error) {
      alert("Something went wrong!");
      console.log("error");
    }
  };

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<ColDef<userInterface>[]>([
    { field: "name" },
    { field: "username" },
    { field: "text" },
    {
      field: "",
      cellRenderer: CustomButtonComponent,
      flex: 1,
    },
  ]);
  const defaultColDef: ColDef = {
    flex: 1,
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <h1 className="text-2xl font-medium p-5 underline-offset-4 underline">
        Notes App
      </h1>
      <FloatButton
        onClick={()=>router.push("/notes")}
        icon={<PlusCircleOutlined />}
        type="primary"
        style={{ right: 24 }}
      />

      <main className="flex flex-col justify-items-center align-middle justify-center   h-[100vh] w-full items-center">
        <div
          className={"ag-theme-quartz-dark h-full mt-16"}
          style={{ width: "75%" }}
        >
          <AgGridReact
            rowData={users}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
          />
        </div>
        <div
          className="ag-theme-quartz" // applying the Data Grid theme
          style={{ height: 500 }}
        >
          {/* <AgGridReact rowData={rowData} columnDefs={colDefs} /> */}
        </div>
      </main>
    </>
  );
}

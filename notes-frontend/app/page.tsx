"use client";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { Input, Modal, Spin } from "antd";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  ColDef,
  ModuleRegistry,
  GetRowIdParams,
} from "@ag-grid-community/core";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, message, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useRouter } from "next/navigation";
import type { PopconfirmProps } from "antd";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
interface userInterface {
  id: number;
  name: string;
  username: string;
  text: string;
}

const cancel: PopconfirmProps["onCancel"] = (e) => {
  console.log(e);
  message.error("Click on No");
};
const ActionsCellRenderer = (data: any) => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.data.name || "");
  const [username, setUsername] = useState(data.data.username || "");
  const [text, setText] = useState(data.data.text || "");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async (id: number) => {
    // setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    try {
      const { data } = await axios.patch(`http://localhost:3000/user/${id}`,{name,text, username});
      if (data) {
        toast.success("Done !");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setConfirmLoading(false);
    }
    // setTimeout(() => {
    //   setOpen(false);
    //   setConfirmLoading(false);
    // }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };
  const [loading, setLoading] = useState(false);
  const handleDelete = async (id: number) => {
    console.log(id);
    try {
      setLoading(true);
      const { data } = await axios.delete(`http://localhost:3000/user/${id}`);
      router.refresh();
      if (data) {
        console.log(data);
        toast.success("Deleted successfully!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(err);
      error();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin indicator={<LoadingOutlined spin />} />;
  }
  return (
    <div className="flex gap-2 items-center ">
      <Tooltip title="edit">
        <Button type="primary" onClick={showModal}>
          Edit <EditOutlined />
        </Button>
        <Modal
          title="Edit the fields"
          open={open}
          onOk={() => handleOk(data.data.id)}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <div className="flex flex-col justify-around gap-5">
            <div className="flex-row flex items-center gap-3">
              <p className="font-semibold text-base">Name:</p>
              <Input
                id="Name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className="flex flex-row items-center gap-3">
              <p className="font-semibold text-base">Username:</p>
              <Input
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
            </div>

            <div className="flex flex-row gap-3 items-center">
              <p className="font-semibold text-base">Text:</p>
              <Input
                value={text}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setText(e.target.value)
                }
              />
            </div>
          </div>
        </Modal>
      </Tooltip>
      <Tooltip title="Delete">
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => handleDelete(data.data.id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>
            Delete <DeleteOutlined />
          </Button>
        </Popconfirm>
      </Tooltip>
    </div>
  );
};

const CustomButtonComponent = (params: any) => {
  return (
    <Tooltip title="Edit">
      <Button onClick={() => console.log(params)} icon={<EditOutlined />}>
        Edit
      </Button>
    </Tooltip>
  );
};
export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<userInterface[]>([]);
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/user");
      // console.log(data);
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
      cellRenderer: ActionsCellRenderer,
      flex: 1,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  // const getRowId = useCallback(
  //   (params: GetRowIdParams) => String(params.data.id),
  //   [],
  // );

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <h1 className="text-2xl font-medium p-5 underline-offset-4 underline">
        Notes App
      </h1>
      <FloatButton
        onClick={() => router.push("/notes")}
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
            // getRowId={getRowId}
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

// const ActionsCellRenderer = (data: any) => {
//   // const { setOpen } = useModal();
//   // const [user, setUser] = useState<User>();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userData = await currentUser();
//       setUser(userData);
//     };

//     fetchUser();
//   }, []);

//   const handleDelete = async (userId: number) => {
//     if (user && userId === user.id) {
//       const rsp = await deleteUser(userId);
//       handleSignOut();
//     } else {
//       const rsp = await deleteUser(userId);
//     }
//   };

//   const items: MenuProps["items"] = [
//     {
//       key: 1,
//       label: (() => {
//         if (user?.role === "ADMIN" || data.data.id === user?.id) {
//           return (
//             <Button
//               type="link"
//               icon={<EditOutlined />}
//               onClick={() => {
//                 setOpen("user", { user: data.data });
//                 console.log(data.data);
//               }}
//             >
//               Edit
//             </Button>
//           );
//         }
//       })(),
//     },
//     {
//       key: 2,
//       label: (() => {
//         if (user?.role === "ADMIN" || data.data.id === user?.id) {
//           return (
//             <Button
//               type="link"
//               icon={<DeleteOutlined />}
//               onClick={() => {
//                 handleDelete(data.data.id);
//               }}
//             >
//               Delete
//             </Button>
//           );
//         }
//       })(),
//     },
//   ];

//   return (
//     <Dropdown menu={{ items }} trigger={["click"]}>
//       <MoreOutlined />
//     </Dropdown>
//   );
// };

// const UserTable: React.FC<TableProps> = ({ TData }) => {
//   const [cols, setCols] = useState<ColDef[]>([
//     { field: "username", headerName: "Name" },
//     { field: "email", headerName: "Email" },
//     { field: "role", headerName: "Role" },
//     { field: "actions", headerName: "", cellRenderer: ActionsCellRenderer },
//   ]);
//   return (
//     <div className="ag-theme-quartz" style={{ width: "100%", height: "500px" }}>
//       <AgGridReact rowData={TData} columnDefs={cols} pagination={true} />
//     </div>
//   );
// };

// export default UserTable;

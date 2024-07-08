"use client";
import React, { useState } from "react";
import { Input, Form, Button } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
type LayoutType = Parameters<typeof Form>[0]["layout"];

const CreationPage = () => {
    const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [loading , setLoading] = useState(false);
  const onSubmit = async ()=>{
    try {
        setLoading(true);
        console.log({name, username, text})
        const {data} = await axios.post("http://localhost:3000/user", {name, username, text});
        if(data){
            router.push("/")
        }
    } catch (error) {
        console.log(error)
        alert("Something went wrong!");
    }finally{
        setLoading(false)
    }
  }
  const buttonItemLayout =
    formLayout === "horizontal"
      ? { wrapperCol: { span: 14, offset: 4 } }
      : null;
  return (
    <div className="p-5">
        <h1 className="text-xl font-medium underline underline-offset-2">Create User</h1>
      <Form
        //   {...formItemLayout}
        className="p-10"
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        //   onValuesChange={onFormLayoutChange}
        style={{ maxWidth: formLayout === "inline" ? "none" : 600 }}
      >
        <Form.Item label="Name" rules={[{ required: true, message: 'Please input your name' }]}>
          <Input  onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setName(e.target.value)} placeholder="john jacob" />
        </Form.Item>
        <Form.Item label="Username " rules={[{ required: true, message: 'username!' }]}>
          <Input placeholder="startrooper" onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setUsername(e.target.value)} />
        </Form.Item>
        <Form.Item label="Text" rules={[{ required: true, message: 'Please input your text!' }]}>
          <Input placeholder="Enter your text" onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setText(e.target.value)} />
        </Form.Item>
        <Form.Item {...buttonItemLayout}>
          <Button onClick={onSubmit} disabled = {loading} type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreationPage;

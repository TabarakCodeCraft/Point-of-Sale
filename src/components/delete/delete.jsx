import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";


function Delete({ id ,  onDelete}) {
  const handleDelete = () => {
    fetch(`http://tabarak-point-of-sale.vercel.app//api/products/${id}`, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id})
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete product with ID ${id}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(`Product with ID ${id} deleted successfully`);
        alert("Product deleted successfully");

        onDelete();

      })
      .catch((error) => {
        console.error(`Error deleting product with ID ${id}:`, error);
      });
  };
  return (
    <div>
      <Popconfirm
        title="حذف هذا الطبق من الموقع..!"
        description="هل انت واثق من حذفه نهائيا ؟"
        onConfirm={handleDelete}
        okText="نعم"
        cancelText="لا"
        okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
      >
       
  
        <Button
          type="dashed"
          danger
          style={{  color: "red" }}
        >
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </div>
  );
  
  }
export default Delete;

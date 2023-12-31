import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

function Delete({ id, onDelete }) {
  const handleDelete = () => {
    fetch(`http://localhost:3000/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete category with ID ${id}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(`Category with ID ${id} deleted successfully`);
        alert("Category deleted successfully");

        onDelete(); 

      })
      .catch((error) => {
        console.error(`Error deleting category with ID ${id}:`, error);
      });
  };
  return (
    <div>
      <Popconfirm
        title="حذف هذا الصنف من الموقع"
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

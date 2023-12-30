"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { DollarOutlined, EditOutlined } from "@ant-design/icons";

function Edit({ id, onEdit, productDetails }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");

  const showEditing = () => {
    setIsModalOpen(true);
  };

  const handleOK = () => {
    setIsModalOpen(false);
    onEdit(id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const updateProduct = () => {
    setIsLoading(true);

    fetch(`http://localhost:3000/api/products`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        image,
        price,
        categoryId: 1
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        handleOK();
      })
      .catch((error) => {
        console.error("Error editing product:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (productDetails) {
      setName(productDetails.name || "");
      setImage(productDetails.image || "");
      setPrice(productDetails.price || "");
    }
  }, [productDetails]);

  return (
    <div>
      <Button
        type="primary"
        onClick={showEditing}
        style={{ backgroundColor: "black", color: "white" }}
      >
        <EditOutlined />
      </Button>
      <Modal
        title="Edit Product"
        visible={isModalOpen}
        onOk={updateProduct}
        onCancel={handleCancel}
        confirmLoading={isLoading}
      >
        <p>
          Product Name
          <Input
            placeholder="Edit Product"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </p>
        <p>
          Image
          <Input
            placeholder="URL.."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </p>
        <p>
          Price
          <Input
            addonAfter={<DollarOutlined />}
            placeholder="Ex:20000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </p>
      </Modal>
    </div>
  );
}

export default Edit;

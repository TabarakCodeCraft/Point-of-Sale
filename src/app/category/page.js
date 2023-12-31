// Category.jsx
"use client";
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, Image, Table, Space, Pagination } from 'antd';
import Header from '../../components/Header/header';
import AppContainer from '@/components/Contaner/container';
import styles from "./page.module.css";
import Delete from "@/components/delete2/Delete";

function Category() {
  const [editForm] = Form.useForm();
  const [selectedCatsId, setSelectedCatsId] = useState(null);
  const [cats, setCats] = useState([]);
  const [list, setList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newProductData, setNewProductData] = useState({});

  const getCategories = async () => {
    try {
      let res = await fetch(`http://localhost:3000/api/categories`);
      let jsonData = await res.json();
      setCats(jsonData);
      setList(jsonData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddModalOk = () => {
    try {
      let url = `http://localhost:3000/api/categories`;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductData),
      });
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
    setAddModalVisible(false);
    console.log(newProductData);
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
    setNewProductData({ name: '', image: '' });
  };

  const handleAddInputChange = (e, id) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === "categoryId" && /^\d+$/.test(value)) {
      parsedValue = parseInt(value, 10);
    } else if (name === "price") {
      parsedValue = parseFloat(value);
    }

    setNewProductData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
      id: id,
    }));
  };

  const handleEditSuccess = async () => {
    try {
      const values = await editForm.validateFields();
      await fetch(`http://localhost:3000/api/categories/${selectedCatsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, image: selectedImage }),
      });
      alert("Category edited successfully");
      setEditModalVisible(false);
      getCategories();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleEdit = (id, image) => {
    setSelectedCatsId(id);
    setSelectedImage(image);
    setEditModalVisible(true);
  };

  const handleDelete = (id) => {
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
        getCategories();
      })
      .catch((error) => {
        console.error(`Error deleting category with ID ${id}:`, error);
        alert(`Error deleting category with ID ${id}: ${error.message}`);
      });
  };

  const handleAddSuccess = async () => {
    setAddModalVisible(false);
    getCategories();
  };

  useEffect(() => {
    getCategories();
  }, [skip]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Image',
      key: 'image',
      render: (_, record) => (
        <Image src={record.image} alt={'Image'} width={70} height={70} style={{ borderRadius: "50%" }} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record.id, record.image)} style={{ background: "white", color: "red" }}> Edit </Button>
        </Space>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_, record) => (
        <Delete id={record.id} onDelete={() => handleDelete(record.id)} />
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.table_container}>
        <AppContainer>
          <Button type="primary" onClick={handleAdd}
            style={{
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              color: 'red',
              backgroundColor: 'white',
            }}>
            + Add Category
          </Button>
          <Modal
            title="Add Product"
            open={isAddModalVisible}
            onOk={handleAddModalOk}
            onCancel={handleAddModalCancel}
            okButtonProps={{
              style: {
                backgroundColor: 'blue',
                color: 'white',
              },
            }}
          >
            <Input
              name='id'
              placeholder="id"
              onChange={handleAddInputChange}
            />
            <Input
              name='name'
              placeholder="Product Name"
              onChange={handleAddInputChange}
            />
            <Input
              name='image'
              placeholder="Image URL"
              onChange={handleAddInputChange}
            />
          </Modal>
          <div>
            <div className={styles.table1}>
              <Table columns={columns} dataSource={list} pagination={false} />
              <Modal
                title="Edit Category"
                open={editModalVisible}
                onOk={handleEditSuccess}
                onCancel={() => setEditModalVisible(false)}
                footer={[
                  <Button key="cancel" onClick={() => setEditModalVisible(false)}>
                    Cancel
                  </Button>,
                  <Button key="ok" type="primary" onClick={handleEditSuccess} style={{ backgroundColor: 'red' }}>
                    Ok
                  </Button>,
                ]}
              >
              </Modal>
            </div>
            <br />
            <center>
              <Pagination
                defaultCurrent={1}
                total={100}
                showSizeChanger={false}
                onChange={(page) => setSkip((page - 1) * 10)}
              />
            </center>
            <br />
          </div>
        </AppContainer>
      </div>
    </>
  );
}

export default Category;

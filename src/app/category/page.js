"use client";
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, Image, Table, Space, Pagination } from 'antd';
import Header from '../../components/Header/header';
import AppContainer from '@/components/Contaner/container';
import styles from "./page.module.css";

function Category() {

  const [editForm] = Form.useForm();

  const [selectedCatsId, setSelectedCatsId] = useState(null);
  const [cats, setCats] = useState([]);
  const [list, setList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId]=useState(null);


  const getCategories = async () => {
    try {
      let res = await fetch("http://localhost:3000/api/categories");
      let jsonData = await res.json();
      setCats(jsonData);
      setList(jsonData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const handleEditSuccess = async () => {
    try {
      const values = await editForm.validateFields();
      await fetch(`http://localhost:3000/api/categories/${selectedCatsId}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      alert("Category edited successfully");
      setEditModalVisible(false);
      getCategories();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleEdit = (itemId) => {
    setSelectedItemId(itemId);
    setEditModalVisible(true);
  };

  const handleDelete = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteModalVisible(true);
  };

  const handleDeleteSuccess = async () => {
    try {
      await fetch(`http://localhost:3000/api/categories/${selectedCatsId}`, {
        method: 'DELETE',
      });
      alert("Category deleted successfully");
      setDeleteModalVisible(false);
      getCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
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
          <Button onClick={() => handleEdit(record.id)} 
          style={{background:"white", color:"red"}}> Edit </Button>
        </Space>
      ),


    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleDelete(record.id)}
            style={{background:"white", color:"red"}}
          >Delete</Button>
        </Space>
      ),

    },

  ];

  return (
    <>
      <Header />
      <div className={styles.table_container}>
        <AppContainer>
          <div>
            <div className={styles.table1}>
              <Table columns={columns} dataSource={list} pagination={false} />
              <Modal
        title="Edit Category"
        visible={editModalVisible}
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
        <Form form={editForm}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete Category"
        visible={deleteModalVisible}
        onOk={handleDeleteSuccess}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={handleEditSuccess} style={{ backgroundColor: 'red' }}>
            Ok
          </Button>,
        ]}
        
      >
        <p>Are you sure you want to delete this category?</p>
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

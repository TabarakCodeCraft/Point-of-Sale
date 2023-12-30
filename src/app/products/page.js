"use client";

import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, Image, Table, Pagination } from 'antd';
import Delete from '../../components/delete/delete';
import Edit from '../../components/eadit/edit';
import Header from '../../components/Header/header';
import AppContainer from '@/components/Contaner/container';
import styles from "./page.module.css";



function Product() {

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [newProductData, setNewProductData] = useState({
    name: '',
    image: '',
    price: '',
  });
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const getProducts = async (cats, searchTerm) => {
    let url = 'http://localhost:3000/api/products';
    if (cats) url = `http://localhost:3000/api/products?cat=${cats}`;

    try {
      let res = await fetch(url);
      let jsonData = await res.json();
      if (searchTerm) {
        jsonData = jsonData.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setList(jsonData);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };
  const handleAdd = () => { setAddModalVisible(true); };

  const handleAddModalOk = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setList((prevList) => [...prevList, newProduct]);
        setAddModalVisible(false);
        setNewProductData({ name: '', image: '', price: '' });
      } else {

        console.error('Failed to add product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };


  const handleAddModalCancel = () => {
    setAddModalVisible(false);
    setNewProductData({ name: '', image: '', price: '' });
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
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

        getProducts();
      })
      .catch((error) => {
        console.error(`Error deleting product with ID ${id}:`, error);
        alert(`Error deleting product with ID ${id}: ${error.message}`);
      });
  };
  const handleEdit = async (id) => {
    setSelectedProductId(id);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleOK = () => {
    setIsModalOpen(false);
    setSelectedProductId(id);
  };


  const handleCancel = () => {
    setSelectedProductId(null);
  };
  const handleEditSuccess = () => {
    alert("Product edited successfully");
    getProducts();
  };

  const handleSearch = (value) => {
    getProducts(null, value);
    setSearchTerm(value);
  };
  const filteredList = list.filter(product =>
    product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price}$`,
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (_, record) => (
        <Edit
          id={record.id}
          onEdit={handleEdit}
          productDetails={record}
          onSuccess={handleEditSuccess}
        />
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
      <AppContainer>
        <Button type="primary" onClick={handleAdd}
          style={{
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            color: 'red',
            backgroundColor: 'white',

          }}>
          + Add Product
        </Button>
        <Modal
          title="Add Product"
          visible={isAddModalVisible}
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
            placeholder="Product Name"
            value={newProductData.name}
            onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newProductData.image}
            onChange={(e) => setNewProductData({ ...newProductData, image: e.target.value })}
          />
          <Input
            placeholder="Price"
            value={newProductData.price}
            onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
          />
        </Modal>
      </AppContainer>
      <AppContainer>
        <Input
          placeholder="Search Products"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      </AppContainer>
      <div className={styles.table_container}>
        <AppContainer>
          <div>
            <div className={styles.table1}>
              <Table columns={columns} dataSource={list} pagination={false} />
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

export default Product;

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
  const [newProductData, setNewProductData] = useState({});
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const getProducts = async (cats, searchTerm) => {
    let url = 'http://tabarak-point-of-sale.vercel.app//api/products';
    if (cats) url = `http://tabarak-point-of-sale.vercel.app/api/products?cat=${cats}`;

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

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddModalOk = () => {
    try {
      let url = `http://tabarak-point-of-sale.vercel.app/api/products`;

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
    console.log(newProductData)
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


  const handleAddModalCancel = () => {
    setAddModalVisible(false);
    setNewProductData({ name: '', image: '', price: '' });
  }

  const handleDelete = (id) => {
    fetch(`http://tabarak-point-of-sale.vercel.app/api/products/${id}`, {
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

  const handleEditSuccess = () => {
    alert("Product edited successfully");
    getProducts();
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
        record.image ? (
          <Image src={record.image} alt={'Image'} width={70} height={70} style={{ borderRadius: '50%' }} />
        ) : null
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
      render: (price) => price !== undefined ? `${price}$` : '',
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (_, record) => (
        <Edit
          setSelectedProductId={record.id}
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
          <Input
            name='price'
            placeholder="Price"
            onChange={handleAddInputChange}
          />
          <Input
            name='categoryId'
            placeholder="catID"
            onChange={handleAddInputChange}
          />
        </Modal>

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

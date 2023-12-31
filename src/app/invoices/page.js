"use client";
import React, { useEffect, useState } from 'react'
import AppContainer from '@/components/Contaner/container';
import Header from '@/components/Header/header';
import { Table, Button, Space } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";


const InvoicesPage = () => {
  
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => {
        const cart = items && items.cart ? items.cart : [];
        const cartItems = cart
          .map((cartItem) => cartItem.product.name)
          .join(", ");
        return <div>{cartItems}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleExportPDF(record)}>Export to PDF</Button>
          {selectedInvoice && (
            <Button onClick={() => exportToPDF(selectedInvoice)}>
              Export to PDF
            </Button>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `https://tabarak-point-of-sale.vercel.app/api/invoice`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const jsonData = await res.json();

        if (jsonData.success && Array.isArray(jsonData.invoices)) {
          const invoices = jsonData.invoices;
          const formattedData = invoices.map((item) => ({
            ...item,
            items:
              typeof item.items === "string"
                ? JSON.parse(item.items)
                : item.items,
          }));

          setList(formattedData);
        } else {
          console.error("Invalid data format:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportPDF = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const exportToPDF = (invoice) => {
    const tableRef = document.getElementById("invoiceTable");

    const dataPDF = list.map((item) => ({
      id: item.id,
      date: item.date,
      number: item.number,
      items:
        item.items && item.items.cart
          ? item.items.cart.map((cartItem) => cartItem.product.name).join(", ")
          : "",
    }));
    console.log("Data for PDF:", dataPDF);
    const pdf = new jsPDF();
  pdf.autoTable({
    head: [["ID", "Date", "Number", "Items"]],
    body: dataPDF.map((row) => [
      row.id,
      row.date,
      row.number,
      row.items, 
    ]),
  });
    pdf.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <div>
      <Header />
      <AppContainer width={1000}>
        <Space height={40} />
        <Table
          id="invoiceTable"
          columns={columns}
          dataSource={list}
          loading={loading}
        />
      </AppContainer>
    </div>
  );
};


export default InvoicesPage;
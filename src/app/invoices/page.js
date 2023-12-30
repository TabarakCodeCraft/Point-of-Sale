"use client";
import React from 'react'
import AppContainer from '@/components/Contaner/container';
import Header from '@/components/Header/header';
import html2pdf from 'html2pdf.js';
// import styles from "./page.module.css";

const InvoicesPage = () => {
  const exportPDF = () => {
    const element = document.getElementById('invoiceContent');
    html2pdf(element);
  };
  
  return (
    <>
      <Header />

      <AppContainer>
        <button onClick={exportPDF}>Export PDF</button>
         <h1>Invoice</h1>
         
    
      </AppContainer>
    </>
  );
};

export default InvoicesPage;
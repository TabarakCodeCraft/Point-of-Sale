"use client";
import React from 'react'
import AppContainer from '@/components/Contaner/container';
import Header from '@/components/Header/header';
import html2pdf from 'html2pdf.js';

const InvoicesPage = () => {
  const exportPDF = () => {
    const element = document.getElementById('invoiceContent'); // Replace 'invoiceContent' with the actual ID of your content div
    html2pdf(element);
  };
  return (
    <>
      <Header />

      <AppContainer>
      <button onClick={exportPDF}>Export PDF</button>
        <div id="invoiceContent">

        <p>Invoices Page</p>
        </div>
      </AppContainer>
    </>
  );
};

export default InvoicesPage;
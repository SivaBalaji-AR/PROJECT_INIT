import React from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const DownloadWordButton = ({ publications }) => {
  const handleDownload = () => {
    const doc = new Document({
      creator: "Your App Name", 
      title: "User's Publications",
      description: "This document contains the user's publications.",
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "User Details",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Name: "Unknown Name"`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total Publications: ${publications.length}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              pageBreakBefore: true, // This adds the page break
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Publications",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({}),
            ...publications.map((pub, index) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. Title: ${pub.title || "Unknown Title"}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Authors: ${Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors || "Unknown Authors"}`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Details: ${pub.description || "No details available"}`,
                  }),
                ],
              }),
              new Paragraph({}), // Add a blank line between publications
            ]).flat(),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "UserPublications.docx");
      console.log("Word document created successfully.");
    });
  };

  return <button onClick={handleDownload}>Download Publications as Word</button>;
};

export default DownloadWordButton;

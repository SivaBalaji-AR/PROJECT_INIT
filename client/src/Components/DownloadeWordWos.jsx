import React from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const DownloadWordWos = ({ publications }) => {
  const handleDownload = () => {
    const doc = new Document({
      creator: "Your App Name",
      title: "Web of Science Publications",
      description: "This document contains publications data from Web of Science.",
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "User Publications",
                  bold: true,
                  size: 28,
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
              pageBreakBefore: true,
            }),
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
                    text: `Authors: ${
                      pub.names && pub.names.authors
                        ? pub.names.authors.map(author => author.displayName).join(', ')
                        : "Unknown Authors"
                    }`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Journal: ${pub.source?.sourceTitle || "Unknown Journal"}`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Year: ${pub.source?.publishYear || "Unknown Year"}`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `DOI: ${pub.identifiers?.doi || "No DOI available"}`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Keywords: ${
                      pub.keywords?.authorKeywords
                        ? pub.keywords.authorKeywords.join(', ')
                        : "No Keywords available"
                    }`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Record Link: ${pub.links?.record || "No Link available"}`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `References Link: ${pub.links?.references || "No References Link available"}`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Related Records Link: ${pub.links?.related || "No Related Records Link available"}`,
                  }),
                ],
              }),
              new Paragraph({}),
              new Paragraph({}), // Add a blank line between publications
            ]).flat(),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "WebOfSciencePublications.docx");
      console.log("Word document created successfully.");
    });
  };

  return <button onClick={handleDownload}>Download Publications as Word</button>;
};

export default DownloadWordWos;

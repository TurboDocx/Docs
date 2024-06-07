import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

// import { Button } from "@/components/ui/button"

// need a place to put
const JsonToTable = ({ data, title, columns }) => {
  const [decodedData, setDecodedData] = useState({});
  const [tableHeaderdata, setTableHeaderData] = useState([
    {
      id: 1,
      name: 'Parameter',
    },
    {
      id: 2,
      name: 'Description',
    },
    {
      id: 3,
      name: 'Data type',
    },
    {
      id: 4,
      name: 'Required?',
    }
  ]);

  useEffect(() => {
    if (data) {
      try {
        console.log("Raw data:", data);
  
        // Decode the Base64 string
        const decoded64JSON = atob(data);
        console.log("Decoded Base64 JSON string:", decoded64JSON);
  
        // Replace placeholders {value} or {{value}} with value

  
        // Remove { and } characters from string values
      
  
        // Parse the sanitized JSON string
        const decodedJSON = JSON.parse(decoded64JSON);
        console.log("Parsed JSON object:", decodedJSON);
  
        console.log("Setting decoded data");
        setDecodedData(decodedJSON);
        console.log("Decoded data set successfully");
  
      } catch (error) {
        console.error("Error occurred:", error.message);
        console.error("Stack trace:", error.stack);
      }
    }
  }, [data]);
  

  const renderTable = (json, tableName = "Root") => {
    console.log("WHAT IS DA JSON BOI", typeof json)
    if (!json) return null;

    const nestedTables = [];

    const iteratedTableRows = Object.entries(json).map(([key, value], index) => {
      // console.log("######", key)
      // console.log("######", value)
      if (value.type || value.description) {
        return (
          <TableRow key={key} className={index % 2 === 0 ? 'table-row-even': 'table-row-odd'}>
            <TableCell><span className="font-bold text-md">{key}</span></TableCell>
            <TableCell className="w-[300px]">{value}</TableCell>
            <TableCell>{value}</TableCell>
            <TableCell>Yes</TableCell>
          </TableRow>
        );
      }
      return null;
    });

    let tableRows = [...iteratedTableRows];

    return (
      <>
        <Table>
          {
            tableHeaderdata.length > 0 && <TableHeader>
              <TableRow>
                {
                  tableHeaderdata.map((item) => {
                    return (
                      <TableHead>{item.name}</TableHead>
                    )
                  })
                }
              </TableRow>
            </TableHeader>
          }
          <TableBody>{tableRows}</TableBody>
        </Table>
        {nestedTables}
      </>
    );
  };

  return (
    <>
      {decodedData && Object.keys(decodedData).length > 0 && (
            <Card>
              <CardHeader></CardHeader>
              <CardContent>
                <pre>
                  <code>
                    {JSON.stringify(decodedData)}
                  </code>
                </pre>
              </CardContent>
            </Card>
      )}
    </>
  );
};

export default JsonToTable;

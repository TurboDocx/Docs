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
      name: "Parameter",
    },
    {
      id: 2,
      name: "Example Value",
    },
  ]);

  useEffect(() => {
    if (data) {
      try {
        // Decode the Base64 string
        const decoded64JSON = atob(data);

        // Replace placeholders {value} or {{value}} with value

        // Remove { and } characters from string values

        // Parse the sanitized JSON string
        const decodedJSON = JSON.parse(decoded64JSON);
        setDecodedData(decodedJSON);
      } catch (error) {
        console.error("Error occurred:", error.message);
        console.error("Stack trace:", error.stack);
      }
    }
  }, [data]);

  const renderTable = (json, tableName = "Root") => {
    try {
    } catch (e) {}
    if (!json) return null;

    const nestedTables = [];

    const iteratedTableRows = Object.entries(json).map(
      ([key, value], index) => {
        if (key || value) {
          return (
            <TableRow
              key={key}
              className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
            >
              <TableCell>
                <span className="font-bold text-md">{key}</span>
              </TableCell>
              <TableCell className="w-[300px]">{value.type}</TableCell>
            </TableRow>
          );
        }
        return null;
      }
    );

    let tableRows = [...iteratedTableRows];

    return (
      <>
        <Table>
          {tableHeaderdata.length > 0 && (
            <TableHeader>
              <TableRow>
                {tableHeaderdata.map((item) => {
                  return <TableHead>{item.name}</TableHead>;
                })}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>{tableRows}</TableBody>
        </Table>
        {nestedTables}
      </>
    );
  };

  return (
    <>
      {decodedData && Object.keys(decodedData).length > 0 && (
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-boady-table-1">
              <AccordionTrigger>Body Parameters</AccordionTrigger>
              <AccordionContent>
                {/* <Card className="card-item">
              <CardHeader>
              <h3>Body Values</h3> */}
                {/* </CardHeader>
              <CardContent> */}
                {renderTable(decodedData)}
                {/* </CardContent>
            </Card> */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default JsonToTable;

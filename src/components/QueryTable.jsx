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
      name: "Type",
    },
  ]);

  useEffect(() => {
    if (data) {
      try {
        const decoded64JSON = atob(data);
        const decodedJSON = JSON.parse(decoded64JSON);
        console.log("this is the query", decodedJSON);
        setDecodedData(decodedJSON);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [data]);

  const renderTable = (json, tableName = "Root") => {
    if (!json) return null;

    const nestedTables = [];

    const iteratedTableRows = Object.entries(json).map(
      ([key, value], index) => {
        console.log("what is the key", key);
        console.log("what is the value", value);
        if (value.type || value.description || value.key) {
          return (
            <TableRow
              key={key}
              className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
            >
              <TableCell>
                <span className="font-bold text-md">{value.key}</span>
              </TableCell>
              <TableCell className="w-[300px]">
                {typeof value.example}
              </TableCell>
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
        <>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-query-1">
              <AccordionTrigger>Query Parameters</AccordionTrigger>
              <AccordionContent>
                {/* <Card className="query-table">
                  <CardHeader></CardHeader>
                  <CardContent> */}
                    {decodedData && Object.keys(decodedData).length > 0 ? (
                      renderTable(decodedData)
                    ) : (
                      <p></p>
                    )}
                  {/* </CardContent>
                </Card> */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}
    </>
  );
};

export default JsonToTable;

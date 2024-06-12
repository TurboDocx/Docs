import { Badge } from "./ui/badge"
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";

const DisplayEndpoint = ({ endpoint, method }) => {
    const [isCopied, setIsCopied] = useState(false);

    let badgeColor;
    switch (method) {
        case "GET":
            badgeColor = "green";
            break;
        case "PUT":
            badgeColor = "blue";
            break;
        case "POST":
            badgeColor = "yellow";
            break;
        case "DELETE":
            badgeColor = "red";
            break;
        default:
            badgeColor = "gray";
            break;
    }

    const handleCopy = async (value) => {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            return;
        }
    }

    return (
        <>
            <Alert className="mt-[2em] mb-[1em] font-bold api" disabled value={ `${method} ${endpoint}`}>
                <AlertTitle>
                    <div className="flex justify-between">
                        <span><Badge>{method.toUpperCase()}</Badge><span className="ml-2">{endpoint}</span></span>
                    </div>
                </AlertTitle>
            </Alert>
        </>
    )
}

export default DisplayEndpoint;
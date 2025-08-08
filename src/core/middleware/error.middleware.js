import { ZodError } from "zod";
import ResponseError from "../utils/response-error.js";

/**
 * Middleware for handling errors in the application.
 *
 * This function handles different types of errors and sends appropriate
 * HTTP responses based on the error type. It currently handles:
 * 
 * - ZodError: Returns a 400 status code with validation issues.
 * - ResponseError: Returns a custom status and message as defined by the error.
 * - General Errors: Returns a 500 status code with error details.
 */

export default async function ErrorMiddleware (error, req, res, next)  {
    if (error instanceof ZodError) {
        const { issues } = error;
        return res.status(400).json({
            data: issues.map((issue) => ({
                path: issue.path[0],
                message: issue.message
            }))
        });
    }

    if (error instanceof ResponseError) {
        return res.status(error.status).json({
            message: error.message,
        });
    }

    const status = 500;
    const lines = error.message?.split("\n").map(line => line.trim()).filter(Boolean) || [];

    const title = lines[0] || "Internal Server Error";
    const lastLine = lines[lines.length - 1];
    const argumentMatch = lastLine?.match(/Argument `(.*?)` is missing/);

    const responseError = {
        title,
        details: {
            message: lastLine,
        }
    };

    if (argumentMatch) {
        responseError.details.argument = argumentMatch[1];
    }

    return res.status(status).json({ error: responseError });
};
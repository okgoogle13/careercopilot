import { Response } from "express";
import { ApiResponse } from "../types/api.types";

/**
 * Send a standardized API response
 */
export const sendResponse = <T = unknown>(
  res: Response,
  status: number,
  data?: T,
  error?: string,
): void => {
  const response: ApiResponse<T> = { success: status >= 200 && status < 300 };

  if (data) {
    response.data = data;
  }

  if (error) {
    response.error = error;
  }

  res.status(status).json(response);
};

/**
 * Handle API errors consistently
 */
export const handleError = (
  res: Response,
  error: unknown,
  message: string,
  status: number = 500,
): void => {
  console.error(`[${new Date().toISOString()}] Error: ${message}`, error);

  // Don't send internal errors to client in production
  const errorMessage =
    process.env.NODE_ENV === "production" && status >= 500 ? "Internal server error" : message;

  sendResponse(res, status, null, errorMessage);
};

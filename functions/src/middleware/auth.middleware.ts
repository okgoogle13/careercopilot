// @ts-expect-error - TS2497: esModuleInterop is enabled, but TypeScript 5.9 still complains about namespace import
import * as admin from "firebase-admin";
import type {Request, Response, NextFunction} from "express";
import {sendResponse} from "../utils/api.utils";
import {AuthResponse} from "../types/api.types";

// Extend Express Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
      userId?: string;
    }
  }
}

/**
 * Middleware to validate Firebase ID token from Authorization header or __session cookie
 */
export const validateFirebaseIdToken = async (
  req: Request,
  res: Response,
): Promise<AuthResponse> => {
  console.log("Check if request is authorized with Firebase ID token");

  if (
    (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.',
    );
    res.status(403).send("Unauthorized");
    return {userId: null};
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send("Unauthorized");
    return {userId: null};
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log("ID Token correctly decoded", decodedIdToken);
    req.user = decodedIdToken;
    return {userId: decodedIdToken.uid};
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
    return {userId: null, error: "Unauthorized"};
  }
};

// Middleware to check if user is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const {userId, error} = await validateFirebaseIdToken(req, res);
  if (!userId || error) {
    sendResponse(res, 401, null, error || "Unauthorized");
    return;
  }
  {
    next();
  }
};

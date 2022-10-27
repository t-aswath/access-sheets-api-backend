require("dotenv").config();
import { google } from "googleapis";
import { Request, Response, NextFunction } from "express";
export const sheetData = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      token_url: process.env.TOKEN_URL,
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
      client_id: process.env.CLIENT_ID,
      type: process.env.TYPE,
      audience: process.env.AUDIENCE,
      subject_token_type: process.env.SUBJECT_TOKEN_TYPE,
    },
    clientOptions: {
      keyId: process.env.KEY_ID,
    },
    projectId: process.env.PROJECT_ID,
    scopes: process.env.SCOPES,
  });

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  });

  req.body.sheet = sheets;
  next();
};

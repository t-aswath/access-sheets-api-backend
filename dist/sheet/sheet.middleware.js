"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheetData = void 0;
require("dotenv").config();
const googleapis_1 = require("googleapis");
const sheetData = async (req, _res, next) => {
    const auth = new googleapis_1.google.auth.GoogleAuth({
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
    const sheets = googleapis_1.google.sheets({
        version: "v4",
        auth: client,
    });
    req.body.sheet = sheets;
    next();
};
exports.sheetData = sheetData;
//# sourceMappingURL=sheet.middleware.js.map
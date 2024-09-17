import { Response, Router, Request, NextFunction } from "express";
import { google } from "googleapis";
import { prisma } from "../index.js";

import jwt from "jsonwebtoken";
import { error } from "console";

export const authHandler = Router();
export const authCallback = Router();

export interface CustomRequest extends Request {
  user?: string | object;
}
export const access_token_key = process.env.JWT_ACCESS as string;
const refresh_token_key = process.env.JWT_REFRESH as string;
authHandler.post("", async (req: Request, res: Response) => {
  const userDetail = req.body;
  const oauth2Client = new google.auth.OAuth2();
  if (userDetail.access_token) {
    const { access_token } = userDetail;
    oauth2Client.setCredentials({ access_token });
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    try {
      const userInfo = await oauth2.userinfo.get();
      console.log(userInfo.data);
      const { email, given_name, family_name, picture } = userInfo.data;

      if (email) {
        console.log("EMAIL,email", email);
        const UserAlreadyExist = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!UserAlreadyExist && given_name) {
          const fristTimeUser = await prisma.user.create({
            data: {
              email: email,
              firstName: given_name,
              lastName: family_name,
              dp: picture,
            },
          });
        }
        const token = generateAccessToken(email);
        console.log("TOKEN", token);

        return res.status(200).json({ access_token: token });
      }

      return res.send({ message: "Couuld not authnticate" });
    } catch (error) {
      return res.send(error);
    }
  }
});
function generateAccessToken(user: string) {
  try {
    console.log("JSON");
    return jwt.sign({ user }, access_token_key, { expiresIn: "1d" });
  } catch (error) {
    console.log(error);
  }
}
function generateRefreshToken(user: string) {
  return jwt.sign({ user }, refresh_token_key, { expiresIn: "30d" });
}

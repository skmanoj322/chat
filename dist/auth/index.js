import { Router } from "express";
import { google } from "googleapis";
import { prisma } from "../index.js";
import jwt from "jsonwebtoken";
export const authHandler = Router();
export const access_token_key = process.env.JWT_ACCESS;
const refresh_token_key = process.env.JWT_REFRESH;
authHandler.post("", async (req, res) => {
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
            const { email, given_name, family_name, picture } = userInfo.data;
            if (email) {
                let UserAlreadyExist = await prisma.user.findUnique({
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
                    UserAlreadyExist = fristTimeUser;
                }
                if (UserAlreadyExist !== null) {
                    const token = generateAccessToken(UserAlreadyExist.id);
                    return res.status(200).json({ access_token: token });
                }
            }
            return res.send({ message: "Couuld not authnticate" });
        }
        catch (error) {
            return res.send(error);
        }
    }
});
function generateAccessToken(id) {
    try {
        return jwt.sign({ id }, access_token_key, { expiresIn: "1d" });
    }
    catch (error) {
        console.log(error);
    }
}
function generateRefreshToken(user) {
    return jwt.sign({ user }, refresh_token_key, { expiresIn: "30d" });
}

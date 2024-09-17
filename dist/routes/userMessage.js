import { Router } from "express";
export const userMessage = Router();
userMessage.get("", async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    res.send({ urlObj });
});

import { Router } from "express";
import { prisma } from "../../index.js";
import { query, validationResult } from "express-validator";
export const searchUser = Router();
const allowedParams = ["name", "email", "page", "limit", "sortBy", "order"];
const validateQueryParams = (req, res, next) => {
    const queryKeys = Object.keys(req.query);
    const invalidKeys = queryKeys.filter((key) => !allowedParams.includes(key));
    if (invalidKeys.length > 0) {
        return res.status(400).json({ error: "Invalid query parameters(s)" });
    }
    next();
};
searchUser.get("", [
    query("name").optional().isString().withMessage("Username must be string"),
    query("email")
        .optional()
        .isEmail()
        .withMessage("Must be a valid email address"),
    validateQueryParams,
], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, email, page = 1, limit = 10, sortBy = "createdAt", order = "desc", } = req.query;
        const filters = {};
        if (name)
            filters.username = { contains: name, mode: "insensitive" };
        if (email)
            filters.email = { contains: email, mode: "insensitive" };
        const user = await prisma.user.findMany({
            where: {
                OR: [{ email: filters.email }, { firstName: filters.username }],
            },
            take: parseInt(page),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                [sortBy]: order,
            },
        });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

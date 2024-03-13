import {RequestHandler} from "express";

export const wrapRequestHandler = (fn: RequestHandler) => async (req, res, next) => {
    try {
        const result = await fn(req, res, next);
        if (result !== undefined)
            res.json(result);
    } catch (e) {
        next(e);
    }
};

import ResponseError from "@/utils/response-error";

type CustomOrigin = (
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
) => void;

const allowedOrigins = process.env.EXPRESS_CORS_ORIGIN?.split(",") || [];

const corsOrigin: CustomOrigin = (origin, callback) => {
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
        return callback(
            new ResponseError({
                status: 403,
                message: "CORS policy does not allow access from the specified origin.",
                code: "CORS_NOT_ALLOWED",
                details: { origin },
            }),
            false
        );
    }

    return callback(null, true);
};

export default corsOrigin;
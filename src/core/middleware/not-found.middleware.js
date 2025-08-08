/**
 * This middleware is called when a route is not found.
 * It sends a 404 status code with a JSON response containing the message:
 * "Route <method> <path> not found!".
 */
export default async function NotFoundMiddleware(error, req, res, next) {
    const method = req.method;
    const path = req.path;

    return res.status(404).json({
        message: `Route ${method} ${path} not found!`
    });
}
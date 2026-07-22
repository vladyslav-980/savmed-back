export const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;

  res.status(status).json({
    status: "error",
    message:
      status === 500
        ? "Internal server error"
        : error.message,
  });
};
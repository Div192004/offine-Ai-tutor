export function notFoundHandler(request, response) {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `No API route matches ${request.method} ${request.originalUrl}.`,
    },
  });
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "The request body must contain valid JSON.",
      },
    });
  }

  if (error.type === "entity.too.large") {
    return response.status(413).json({
      error: {
        code: "REQUEST_TOO_LARGE",
        message: "The request body is too large.",
      },
    });
  }

  console.error("Unexpected API error.", error);
  return response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "The server could not complete the request.",
    },
  });
}

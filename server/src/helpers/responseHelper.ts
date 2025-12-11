const standardResponse = (data: unknown, statusCode: number = 200) => ({
  success: true,
  statusCode,
  data,
  message: null,
  error: null
});

const errorResponse = (message: string, statusCode: number = 400, error?: unknown) => ({
  success: false,
  statusCode,
  data: null,
  message,
  error: error || null
});

export {standardResponse, errorResponse};
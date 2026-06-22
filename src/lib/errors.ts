export class AppError extends Error {
  constructor(public message: string, public code: string, public statusCode: number = 400) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} غير موجود`, "NOT_FOUND", 404);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "حدث خطأ في قاعدة البيانات") {
    super(message, "DB_ERROR", 500);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "بيانات غير صالحة") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "غير مصرح لك بإجراء هذه العملية") {
    super(message, "UNAUTHORIZED", 401);
  }
}

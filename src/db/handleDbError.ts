export enum PostgresErrorCode {
  UniqueViolation = "23505",
  NotNullViolation = "23502",
}

interface HasCode {
  code: string;
}

interface HasCause {
  cause: unknown;
}

const hasCode = (err: unknown): err is HasCode => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as HasCode).code === "string"
  );
};

const hasCause = (err: unknown): err is HasCause => {
  return typeof err === "object" && err !== null && "cause" in err;
};

/**
 * Checks if the given error (or its cause) is a PostgreSQL error with a specific code.
 *
 * This function handles cases where the actual database error is nested
 * within the 'cause' property of a higher-level error object.
 *
 * @param error The error object caught in a catch block.
 * @param expectedCode The specific PostgresErrorCode to check for (e.g., PostgresErrorCode.UniqueViolation).
 * @returns True if the error (or its cause) matches the expected PostgreSQL error code.
 */
export function isPostgresErrorWithCode(
  error: unknown,
  expectedCode: PostgresErrorCode
): boolean {
  if (hasCode(error) && error.code === expectedCode) {
    return true;
  }

  if (hasCause(error)) {
    if (hasCode(error.cause) && error.cause.code === expectedCode) {
      return true;
    }
  }

  return false;
}

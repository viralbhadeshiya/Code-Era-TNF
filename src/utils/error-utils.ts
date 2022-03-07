function getErrorFromCode(statusCode: number): string {
    switch (statusCode) {
        case 500: {
            return 'DATABASE_ERROR';
        }
        case 400: {
            return 'BAD_REQUEST';
        }
        case 401: {
            return 'UNAUTHORIZED';
        }
        case 424: {
            return 'FAILED_DEPENDENCY';
        }
        case 404: {
            return 'NOT_FOUND';
        }
        default:
            return 'UNHANDLED_ERROR';
    }
}

export default class HttpException extends Error {
    // Class variables
    public status: string;

    public statusCode: number;

    public error: string;

    public errorCode: string;

    public originalError: any;

    public meta: any;

    constructor(statusCode, message, errorCode, err, meta?) {
        super(message);
        this.statusCode = statusCode;
        this.error = getErrorFromCode(statusCode as number);
        this.errorCode = errorCode;
        this.message = message;
        this.originalError = err;
        this.meta = meta;
    }
}

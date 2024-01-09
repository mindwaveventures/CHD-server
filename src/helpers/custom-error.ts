/**
 * Class for define custom error
 */
class CustomError extends Error {
    type: string;
    statusCode: number;
    errorCode: string;
    /**
     * Create custom error
     * @param {string} message message for custom error
     * @param {string} [errorCode]
     * @param {number} [statusCode] Http status code
     */
    constructor(message: string, errorCode: string, statusCode = 500) {
        super(message);

        this.name = this.constructor.name;
        this.type = 'CustomError';
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

export default CustomError;

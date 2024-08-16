class Logger {
    /**
     * Logs an informational message to the console.
     * @param {string} message - The message to log.
     */
    public info(message: string): void {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
    }

    /**
     * Logs an error message to the console.
     * @param {string} message - The message to log.
     */
    public error(message: string): void {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    }

    /**
     * Logs a warning message to the console.
     * @param {string} message - The message to log.
     */
    public warn(message: string): void {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
    }

    /**
     * Logs a debug message to the console.
     * @param {string} message - The message to log.
     */
    public debug(message: string): void {
        console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
}

export default new Logger();

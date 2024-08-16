import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
dotenv.config();


/**
 * Singleton class for configuring and providing the OAuth2 client for Google API.
 */
export class GoogleConfig {
    private static instance: OAuth2Client;

    private constructor() { }

    /**
     * Gets the singleton instance of OAuth2Client.
     * 
     * @returns {OAuth2Client} - The OAuth2Client instance.
     */
    public static getClient(): OAuth2Client {
        if (!this.instance) {
            this.instance = new OAuth2Client(
                process.env.CLIENT_ID!,
                process.env.CLIENT_SECRET!,
                process.env.REDIRECT_URI!,
            );
        }
        return this.instance;
    }
}

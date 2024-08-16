import { Credentials, OAuth2Client } from 'google-auth-library';
import { GoogleConfig } from '../config/googleConfig';

/**
 * Service responsible for handling OAuth2 authentication.
 */
export class AuthService {
    private readonly client: OAuth2Client;

    constructor() {
        this.client = GoogleConfig.getClient();
    }

    /**
     * Generates the Google OAuth2 authentication URL.
     * 
     * @returns {string} - The URL to redirect the user to for authentication.
     */
    public generateAuthUrl(): string {
        return this.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive'],
            prompt: 'consent',
        });
    }

    /**
     * Authenticates the user using the provided authorization code.
     * 
     * @param {string} code - The authorization code received from Google's OAuth2 process.
     * @returns {Promise<Credentials>} - A promise that resolves to an object containing the authentication tokens.
     */
    public async authenticate(code: string): Promise<Credentials> {
        try {
            const { tokens } = await this.client.getToken(code);
            return tokens;
        } catch (error) {
            console.error('Failed to authenticate with provided code:', error);
            throw new Error('Authentication failed.');
        }
    }

    /**
     * Refreshes the access token using the refresh token.
     * 
     * @returns {Promise<Credentials>} - A promise that resolves to an object containing the new authentication tokens.
     */
    public async refreshAccessToken(): Promise<Credentials> {
        try {
            const { credentials } = await this.client.refreshAccessToken();
            this.client.setCredentials(credentials); // Set the refreshed credentials for future use
            return credentials;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            throw new Error('Token refresh failed.');
        }
    }
}

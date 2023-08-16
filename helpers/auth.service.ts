import axios from "axios";
import { AccessTokenResponseSchema, type SupportedEnvironments } from "./common";

interface AuthService {
  /**
   * Get an access token.
   */
  getAccessToken(): Promise<{
    access_token: string;
    client_base_url: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }>;
}

export class AuthorizationClient {
  public static getAuthService(requestEnvironment: SupportedEnvironments): AuthService {
    switch (requestEnvironment) {
      case "liquidweb-prod-1":
        return new LiquidwebProd1AuthService();
      case "liquidweb-qa-1":
        return new LiquidwebQa1AuthService();
      default:
        throw new Error(`No auth service implementation found for '${requestEnvironment}' environment`);
    }
  }
}

class LiquidwebProd1AuthService implements AuthService {
  #clientId = process.env.V3_CLIENT_ID;
  #clientSecret = process.env.V3_CLIENT_SECRET;

  public async getAccessToken(): Promise<{
    access_token: string;
    client_base_url: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }> {
    if (!this.#clientId || !this.#clientSecret) {
      throw new Error("client id or client secret not set for 'liquidweb-prod-1'");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", this.#clientId);
    params.append("client_secret", this.#clientSecret);
    params.append("scope", "Api");

    const response = await axios.post("https://auth.appnavotar.com/connect/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = AccessTokenResponseSchema.parse(response.data);

    return { ...data, client_base_url: "https://api.apprentall.com" };
  }
}

class LiquidwebQa1AuthService implements AuthService {
  #clientId = process.env.QA_V3_CLIENT_ID;
  #clientSecret = process.env.QA_V3_CLIENT_SECRET;

  public async getAccessToken(): Promise<{
    access_token: string;
    client_base_url: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }> {
    if (!this.#clientId || !this.#clientSecret) {
      throw new Error("client id or client secret not set for 'liquidweb-qa-1'");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", this.#clientId);
    params.append("client_secret", this.#clientSecret);
    params.append("scope", "Api");

    const response = await axios.post("https://testauth.appnavotar.com/connect/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = AccessTokenResponseSchema.parse(response.data);

    return { ...data, client_base_url: "https://testapi.appnavotar.com" };
  }
}

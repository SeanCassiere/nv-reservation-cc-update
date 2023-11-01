import { AccessTokenResponseSchema, makeXFormUrlEncodedBody, type SupportedEnvironments } from "./common";

interface AuthService {
  /**
   * Get an access token.
   */
  getAccessToken: () => Promise<{
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
  readonly auth_url = "https://auth.appnavotar.com/connect/token";
  readonly api_url = "https://api.apprentall.com";

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

    const authDetails = {
      grant_type: "client_credentials",
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
      scope: "Api",
    };

    const body = makeXFormUrlEncodedBody(authDetails);

    const response = await fetch(`${this.auth_url}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }).then((res) => res.json());

    const data = AccessTokenResponseSchema.parse(response);

    return { ...data, client_base_url: this.api_url };
  }
}

class LiquidwebQa1AuthService implements AuthService {
  #clientId = process.env.QA_V3_CLIENT_ID;
  #clientSecret = process.env.QA_V3_CLIENT_SECRET;
  readonly auth_url = "https://testauth.appnavotar.com/connect/token";
  readonly api_url = "https://testapi.appnavotar.com";

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

    const authDetails = {
      grant_type: "client_credentials",
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
      scope: "Api",
    };

    const body = makeXFormUrlEncodedBody(authDetails);

    const response = await fetch(`${this.auth_url}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }).then((res) => res.json());

    const data = AccessTokenResponseSchema.parse(response);

    return { ...data, client_base_url: this.api_url };
  }
}

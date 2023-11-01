import type { SupportedEnvironments } from "./common";

type LogKey = string;
type LogPayload = Record<string, string>;
type LogOptions = { ip: string | undefined; lookup: string | undefined; appEnvironment: SupportedEnvironments };

interface LogService {
  /**
   * Save a log to the database
   */
  save: (key: LogKey, payload: LogPayload, options: LogOptions) => Promise<{ success: boolean; data: any }>;
}

export class LoggingClient {
  public static getLoggingService(): LogService {
    const deployEnv = process.env.DEPLOYMENT_ENV;
    console.log("deploymentEnv", deployEnv);
    if (deployEnv === "production") {
      return new SimpleLoggingService();
    } else {
      return new LocalLoggingService();
    }
  }
}

/**
 * An implementation for calling the simple logging service.
 * @repo https://github.com/SeanCassiere/simple-logging-server
 */
class SimpleLoggingService implements LogService {
  #serviceId = process.env.LOGGER_SERVICE_ID;
  #serviceUri = process.env.LOGGER_SERVICE_URI;

  async save(key: LogKey, payload: LogPayload, options: LogOptions) {
    if (!this.#serviceId || !this.#serviceUri) {
      return { success: false, data: "Missing logger service id or uri" };
    }

    const body = {
      action: key,
      environment: options.appEnvironment,
      ip: options.ip,
      lookupFilterValue: options.lookup,
      data: payload,
    };

    return await fetch(`${this.#serviceUri}/api/v2/log`, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => {
        return { success: true, data: res.json() };
      })
      .catch((err) => {
        return { success: false, data: err };
      });
  }
}

class LocalLoggingService implements LogService {
  public async save(key: LogKey, payload: LogPayload) {
    const dateStr = new Date().toISOString().slice(0, 19).replace("T", " ");

    console.log(dateStr, "LocalLoggingService.save", key, "\n", payload);

    return {
      success: true,
      data: payload,
    };
  }
}

type LogKey = string;
type LogPayload = Record<string, string>;
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type LogOptions = { ip: string | undefined; lookup: string | undefined; appEnvironment: string };

interface LogService {
  /**
   * Save a log to the database
   */
  save: (
    level: LogLevel,
    key: LogKey,
    payload: LogPayload,
    options: LogOptions,
  ) => Promise<{ success: boolean; data: any }>;
}

export class LoggingClient {
  public static getLoggingService(): LogService {
    const deployEnv = process.env.DEPLOYMENT_ENV;
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

  async save(level: LogLevel, key: LogKey, payload: LogPayload, options: LogOptions) {
    if (!this.#serviceId || !this.#serviceUri) {
      console.error("Missing logger service id or uri");
      return { success: false, data: "Missing logger service id or uri" };
    }

    // debug-level logs will not be persisted to this service
    if (level === "debug") {
      const dateStr = new Date().toISOString().slice(0, 19).replace("T", " ");
      console.log(level.toUpperCase(), dateStr, "SimpleLoggingService.save", key, "\n", payload);

      return {
        success: true,
        data: payload,
      };
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
      headers: {
        "content-type": "application/json",
        "x-app-service-id": this.#serviceId,
      },
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
  public async save(level: LogLevel, key: LogKey, payload: LogPayload) {
    const dateStr = new Date().toISOString().slice(0, 19).replace("T", " ");

    console.log(level.toUpperCase(), dateStr, "LocalLoggingService.save", key, "\n", payload);

    return {
      success: true,
      data: payload,
    };
  }
}

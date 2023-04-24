/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse,
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import type {
  ApiConfig, ApiFeedResponse,
} from "./api.types"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem";

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.apisauce.addMonitor(this.monitor)
  }

  monitor = (response: ApiResponse<any>) => {
    __DEV__ && console.log(`${response?.config?.method} ${response?.config?.url}`)
    __DEV__ && console.log("RESPONSE", response)

    if (response?.config?.method === "get" && response?.config?.params !== undefined) {
      __DEV__ && console.log("Params", response?.config?.params)
    } else if (response?.config?.data !== undefined) {
      __DEV__ && console.log("Params", JSON.parse(response?.config?.data))
    }
  }

  async onUpload(deviceName: string, form: FormData): Promise<{ kind: "ok"; } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`https://talisman-api.testbox.com.au/api/devices/${deviceName}/motion-data-upload-process`, form)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return {kind: "ok"}
  }
}

// Singleton instance of the API for convenience
export const api = new Api()

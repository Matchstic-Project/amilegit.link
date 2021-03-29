import { Response } from './types';

export interface NetworkParameter {
    key: string;
    value: string;
}

export default class Network {
    // The base URL for the server-side
    static base = 'https://api.amilegit.link/';

    /**
     * Handles the request to the server
     * @param endpoint Endpoint to call
     * @param pagable Whether the endpoint is expected to return a pagable response
     * @param params Any URL parameters to add to the request
     */
    private async doRequest(endpoint: string, body: {}): Promise<Response> {
      const path = Network.base + endpoint;

      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const contents = await response.json();
        return {
          status: response.status,
          value: contents
        };
      } else {
        return {
          status: response.status,
          value: null
        };
      }
    }

    /**
     * Creates a new entry on the server
     */
    public async create(expansion: string): Promise<Response> {
      const endpoint = 'create';

      const body = {
        expansion
      };

      return this.doRequest(endpoint, body);
    }
}

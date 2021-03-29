import Network from './network';
import { CreatedExpansion } from './types';

/**
 * The API class is the backing model behind connecting to the URL shortener service
 */
export default class API {
    private _network = new Network();

    /**
     * Creates a new entry on the server for the given expansion
     * @param expansion
     */
    public async createEntry(expansion: string): Promise<CreatedExpansion> {
      // Create entry at server-side, then record it into localstorage

      const response = await this._network.create(expansion);
      if (response.status !== 201) { throw (response.status); }

      return response.value as CreatedExpansion;
    }
}

export interface CreatedExpansion {
    /**
     * The URL generated for this expansion
     */
    url: string;

    /**
     * The fully expanded URL this entry points to
     */
    expansion: string;
}

/**
 * Represents a response from the server
 */
export interface Response {
    value: CreatedExpansion | null;
    status: number;
}

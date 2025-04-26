export interface DocumentChunk {
    id: string;
    text: string;
    metadata: {
        tenantId: string;
        [key: string]: any;
    };
}
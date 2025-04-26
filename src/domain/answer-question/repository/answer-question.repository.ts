import { DocumentChunk } from "../entity/document-chunk.entity";

export interface IAnswerQuestionRepository {
    searchRelevantChunks(tenantIds: string | string[], query: string): Promise<DocumentChunk[]>;
};

export interface ISaveDocumentRepository {
    saveToVectorStore(tenantId: string, file: Express.Multer.File): Promise<void>;
}
  
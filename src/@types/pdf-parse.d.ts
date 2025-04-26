declare module 'pdf-parse' {
    interface PDFMetadata {
      [key: string]: any;
    }
  
    interface PDFPage {
      [key: string]: any;
    }
  
    interface PDFParseResult {
      numpages: number;
      numrender: number;
      info: any;
      metadata: PDFMetadata;
      version: string;
      text: string;
      pages?: PDFPage[];
    }
  
    function pdf(buffer: Buffer): Promise<PDFParseResult>;
    export = pdf;
  }
  
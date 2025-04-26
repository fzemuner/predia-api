import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

export async function parseFileToText(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (file.mimetype.startsWith('image/')) {
    const result = await Tesseract.recognize(file.buffer, 'eng');
    return result.data.text;
  }

  return file.buffer.toString('utf-8');
}

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from 'docx';
import FileSaver from 'file-saver';
import { TranslationSegment } from '@/types/ITranslator';

// Format time (seconds) to mm:ss
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format confidence as percentage
const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

// Get confidence level text
const getConfidenceLevel = (confidence: number): string => {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.6) return 'Medium';
  return 'Low';
};

// Export real-time translation results to DOCX
export const exportRealTimeTranslationToDocx = async (
  predictions: Array<{ prediction: string; confidence: number; timestamp: string }>,
  fullTranscript: string,
  language: string
) => {
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'Sign Language Translation Results',
            heading: HeadingLevel.TITLE,
          }),
          
          // Date and language
          new Paragraph({
            children: [
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date().toLocaleDateString()),
              new TextRun({ text: ' | Language: ', bold: true }),
              new TextRun(language.toUpperCase()),
            ],
          }),
          
          // Spacing
          new Paragraph({}),
          
          // Full transcript heading
          new Paragraph({
            text: 'Full Transcript',
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Full transcript content
          new Paragraph({
            text: fullTranscript || 'No transcript available',
          }),
          
          // Spacing
          new Paragraph({}),
          
          // Translation details heading
          new Paragraph({
            text: 'Translation Details',
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Create table for translations
          new Table({
            width: {
              size: 100,
              type: 'pct',
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
            },
            rows: [
              // Header row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    width: {
                      size: 15,
                      type: 'pct',
                    },
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Time', bold: true })]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 55,
                      type: 'pct',
                    },
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Sign Language Translation', bold: true })]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 15,
                      type: 'pct',
                    },
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Confidence', bold: true })]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 15,
                      type: 'pct',
                    },
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Level', bold: true })]
                    })],
                  }),
                ],
              }),
              
              // Data rows
              ...predictions.map((item) => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(item.timestamp)],
                    }),
                    new TableCell({
                      children: [new Paragraph(item.prediction)],
                    }),
                    new TableCell({
                      children: [new Paragraph(`${item.confidence}%`)],
                    }),
                    new TableCell({
                      children: [new Paragraph(getConfidenceLevel(item.confidence / 100))],
                    }),
                  ],
                })
              ),
            ],
          }),
          
          // Spacing
          new Paragraph({}),
          
          // Footer
          new Paragraph({
            text: 'Generated by SLOM Sign Language Translator',
            alignment: 'center',
          }),
        ],
      },
    ],
  });
  
  // Generate and save document
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  FileSaver.saveAs(blob, `sign-language-translation-${new Date().toISOString().split('T')[0]}.docx`);
};

// Export video translation results to DOCX
export const exportVideoTranslationToDocx = async (
  filename: string,
  translations: TranslationSegment[],
  summary: string | undefined,
  duration: number,
  language: string
) => {
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'Video Sign Language Translation Results',
            heading: HeadingLevel.TITLE,
          }),
          
          // Video info
          new Paragraph({
            children: [
              new TextRun({ text: 'Video: ', bold: true }),
              new TextRun(filename),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: 'Duration: ', bold: true }),
              new TextRun(formatTime(duration)),
              new TextRun({ text: ' | Language: ', bold: true }),
              new TextRun(language.toUpperCase()),
              new TextRun({ text: ' | Date: ', bold: true }),
              new TextRun(new Date().toLocaleDateString()),
            ],
          }),
          
          // Spacing
          new Paragraph({}),
          
          // Summary heading
          new Paragraph({
            text: 'Summary',
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Summary content
          new Paragraph({
            text: summary || 'No summary available',
          }),
          
          // Spacing
          new Paragraph({}),
          
          // Translation details heading
          new Paragraph({
            text: 'Translation Timeline',
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Create table for translations
          new Table({
            width: {
              size: 100,
              type: 'pct',
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '#CCCCCC' },
            },
            rows: [
              // Header row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    width: {
                      size: 20,
                      type: 'pct',
                    },
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Time Range', bold: true })]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 60,
                      type: 'pct',
                    },
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Sign Language Translation', bold: true })]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 20,
                      type: 'pct',
                    },
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Confidence', bold: true })]
                    })],
                  }),
                ],
              }),
              
              // Data rows
              ...translations.map((segment) => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(`${formatTime(segment.startTime)} - ${formatTime(segment.endTime)}`)],
                    }),
                    new TableCell({
                      children: [new Paragraph(segment.prediction)],
                    }),
                    new TableCell({
                      children: [new Paragraph(formatConfidence(segment.confidence))],
                    }),
                  ],
                })
              ),
            ],
          }),
          
          // Spacing
          new Paragraph({}),
          
          // Footer
          new Paragraph({
            text: 'Generated by SLOM Sign Language Translator',
            alignment: 'center',
          }),
        ],
      },
    ],
  });
  
  // Generate and save document
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  FileSaver.saveAs(blob, `video-translation-${filename.split('.')[0]}.docx`);
}; 
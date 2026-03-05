import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * PDF Export Engine - Brain Transplant from MiniMe
 * High-Fidelity Rasterization using html2canvas + jsPDF
 *
 * @param elementId - The DOM element ID to capture
 * @param fileName - The output PDF filename (e.g., 'resume.pdf')
 * @param options - Optional configuration
 */
export interface ExportOptions {
  scale?: number;
  backgroundColor?: string;
  orientation?: 'portrait' | 'landscape';
  format?: string;
}

export const exportToPdf = async (
  elementId: string,
  fileName: string,
  options: ExportOptions = {}
): Promise<void> => {
  try {
    const {
      scale = 2,
      backgroundColor = '#ffffff',
      orientation = 'portrait',
      format = 'a4',
    } = options;

    // Get the target element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Capture element as canvas with high fidelity
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png');

    // Initialize PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    // Calculate dimensions to fit content
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error(
      `Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

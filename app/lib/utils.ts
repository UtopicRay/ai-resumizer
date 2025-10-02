/**
 * Converts a PDF file to an image file (PNG).
 * If the file is already a PNG or JPG, it returns the file as is.
 * Throws an error for invalid file types.
 * @param file The input file (PDF, PNG, or JPG).
 * @returns A promise that resolves to an image File object.
 */
export async function convertPdfToImage(file: File): Promise<File> {
    // Check if running in a browser environment
    if (typeof window === 'undefined') {
        // If on the server, return the file as is or handle as needed
        return file;
    }

    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Formato de archivo inválido. Solo se permiten PDF, PNG o JPG.');
    }

    if (file.type.startsWith('image/')) {
        // If it's already an image, just return it.
        return file;
    }

    // It's a PDF, so convert it.
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1); // Using the first page

    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (!context) {
        throw new Error('No se pudo obtener el contexto del canvas.');
    }

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                // Create a new File object from the blob
                const imageFile = new File([blob], 'resume-preview.png', { type: 'image/png' });
                resolve(imageFile);
            } else {
                reject(new Error('No se pudo convertir el canvas a Blob.'));
            }
        }, 'image/png');
    });
}

import { useState, useEffect } from 'react';
import { Upload, Printer, Download, CheckCircle, RefreshCw, Scissors, FileText } from 'lucide-react';

export default function LabelCropper() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedPdfUrl, setCroppedPdfUrl] = useState(null);
  const [croppedFileName, setCroppedFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [platform, setPlatform] = useState('Meesho');

  // Load pdf-lib script dynamically if not present
  useEffect(() => {
    if (!window.PDFLib) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const processAndCropPdf = async (file) => {
    setIsProcessing(true);
    try {
      if (!window.PDFLib) {
        // Fallback wait for pdf-lib script load
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const arrayBuffer = await file.arrayBuffer();
      const { PDFDocument } = window.PDFLib || {};

      if (!PDFDocument) {
        alert("PDF processing library loading... Please try uploading again in a second.");
        setIsProcessing(false);
        return;
      }

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      setPageCount(pages.length);

      // Crop each page for 4x6 thermal label format based on platform
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        if (platform === 'Meesho' || platform === 'ALL') {
          // Meesho shipping labels occupy top 52% of A4 page
          const cropHeight = height * 0.52;
          page.setCropBox(0, height - cropHeight, width, cropHeight);
          page.setMediaBox(0, height - cropHeight, width, cropHeight);
        } else if (platform === 'Flipkart') {
          // Flipkart labels top 50%
          const cropHeight = height * 0.50;
          page.setCropBox(0, height - cropHeight, width, cropHeight);
          page.setMediaBox(0, height - cropHeight, width, cropHeight);
        } else if (platform === 'Amazon') {
          // Amazon labels top 48%
          const cropHeight = height * 0.48;
          page.setCropBox(0, height - cropHeight, width, cropHeight);
          page.setMediaBox(0, height - cropHeight, width, cropHeight);
        }
      });

      const croppedPdfBytes = await pdfDoc.save();
      const blob = new Blob([croppedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCroppedPdfUrl(url);
      setCroppedFileName(`Cropped_4x6_${platform}_${file.name}`);
    } catch (err) {
      console.error("Error cropping PDF:", err);
      alert("Failed to crop PDF. Please ensure it is a valid PDF shipping label document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      processAndCropPdf(file);
    }
  };

  const handleDownloadCropped = () => {
    if (!croppedPdfUrl) return;
    const a = document.createElement('a');
    a.href = croppedPdfUrl;
    a.download = croppedFileName || 'Cropped_Thermal_Labels_4x6.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintCropped = () => {
    if (!croppedPdfUrl) return;
    // Create silent iframe to print ONLY the cropped PDF blob, NOT the web page screen
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = croppedPdfUrl;

    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }, 300);
    };
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Automatic 4x6 Thermal Label Cropper</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Real client-side PDF cropper for Meesho, Flipkart & Amazon shipping labels</div>
        </div>
      </div>

      {/* Platform Selection */}
      <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>SELECT MARKETPLACE PRESET</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['Meesho', 'Flipkart', 'Amazon', 'ALL'].map(p => (
            <button
              key={p}
              onClick={() => {
                setPlatform(p);
                if (selectedFile) processAndCropPdf(selectedFile);
              }}
              style={{
                flex: 1,
                minWidth: '100px',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: platform === p ? 'var(--primary-red)' : '#1c1c1c',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {p} Label Crop (4x6)
            </button>
          ))}
        </div>
      </div>

      {/* Upload Box */}
      <div style={{ background: '#111', border: '2px dashed #333', borderRadius: '14px', padding: '3rem 1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileUpload} 
          id="real-pdf-input" 
          style={{ display: 'none' }} 
        />
        <label htmlFor="real-pdf-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#1f1f1f', padding: '1.25rem', borderRadius: '50%', color: 'var(--primary-red)' }}>
            <Upload size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white', marginBottom: '0.35rem' }}>
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to Upload A4 Shipping Label PDF'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Upload original Meesho, Flipkart, or Amazon PDF label file. It will crop the PDF directly into a 4x6 thermal printer PDF file.
            </p>
          </div>
        </label>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontWeight: '600' }}>Processing & cropping your PDF document...</span>
        </div>
      )}

      {/* Cropped PDF Result & Action Controls */}
      {croppedPdfUrl && !isProcessing && (
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '14px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} /> Real Cropped 4x6 PDF Ready ({pageCount} {pageCount === 1 ? 'Page' : 'Pages'})
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Original A4 PDF cropped to 4x6 thermal label. Click below to download or print ONLY the cropped label PDF.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleDownloadCropped}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#3b82f6',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Download size={18} /> Download Cropped 4x6 PDF
              </button>
              <button
                onClick={handlePrintCropped}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--primary-red)',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Printer size={18} /> Print Cropped PDF
              </button>
            </div>
          </div>

          {/* Embedded PDF Viewer for live cropped preview */}
          <div style={{ width: '100%', height: '520px', border: '1px solid #222', borderRadius: '10px', overflow: 'hidden', background: '#080808' }}>
            <iframe 
              src={croppedPdfUrl} 
              title="Cropped 4x6 PDF Preview" 
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

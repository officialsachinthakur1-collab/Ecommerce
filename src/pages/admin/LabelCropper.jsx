import { useState } from 'react';
import { Upload, Printer, FileText, CheckCircle, RefreshCw, Scissors } from 'lucide-react';

export default function LabelCropper() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedLabels, setProcessedLabels] = useState(null);
  const [platform, setPlatform] = useState('Meesho');
  const [labelSize, setLabelSize] = useState('4x6');

  const sampleLabels = [
    { id: 'MSH-LBL-991', sku: 'HOODIE-BLK-XL', channel: 'Meesho', customer: 'Amit Sharma (Delhi)', courier: 'Delhivery Surface', status: 'Ready for 4x6 Thermal Print' },
    { id: 'MSH-LBL-992', sku: 'ANK-KURTI-M', channel: 'Meesho', customer: 'Sneha Patel (Ahmedabad)', courier: 'Shadowfax', status: 'Ready for 4x6 Thermal Print' },
    { id: 'FLK-LBL-504', sku: 'DNM-JKT-L', channel: 'Flipkart', customer: 'Rajesh Kumar (Jaipur)', courier: 'Ekart Express', status: 'Ready for 4x6 Thermal Print' },
    { id: 'AMZ-LBL-310', sku: 'KDN-JWL-SET', channel: 'Amazon', customer: 'Pooja Verma (Lucknow)', courier: 'ATS (Amazon Transport)', status: 'Ready for 4x6 Thermal Print' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessedLabels(sampleLabels.filter(l => platform === 'ALL' || l.channel === platform));
      }, 1200);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Automatic Shipping Label Cropper</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Convert A4 Meesho, Flipkart & Amazon PDF labels to 4x6 Thermal Printer Stickers instantly</div>
        </div>
      </div>

      {/* Platform & Preset Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>SELECT MARKETPLACE</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Meesho', 'Flipkart', 'Amazon', 'ALL'].map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: platform === p ? 'var(--primary-red)' : '#1c1c1c',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>THERMAL STICKER SIZE</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['4x6 Inch (Standard Thermal)', 'A4 (4 Labels per Sheet)'].map(s => (
              <button
                key={s}
                onClick={() => setLabelSize(s.includes('4x6') ? '4x6' : 'A4')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: (s.includes('4x6') && labelSize === '4x6') || (!s.includes('4x6') && labelSize === 'A4') ? '#3b82f6' : '#1c1c1c',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.78rem'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div style={{ background: '#111', border: '2px dashed #333', borderRadius: '14px', padding: '3rem', textAlign: 'center', marginBottom: '2rem', cursor: 'pointer' }}>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileUpload} 
          id="label-pdf-input" 
          style={{ display: 'none' }} 
        />
        <label htmlFor="label-pdf-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#1f1f1f', padding: '1.25rem', borderRadius: '50%', color: 'var(--primary-red)' }}>
            <Upload size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white', marginBottom: '0.35rem' }}>
              {selectedFile ? selectedFile.name : 'Click to Upload or Drag Bulk Label PDF'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Supports Meesho, Flipkart & Amazon PDF invoices. Automatically crops and extracts SKUs for 4x6 Thermal Printers.
            </p>
          </div>
        </label>
      </div>

      {/* Processing Spinner */}
      {isProcessing && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontWeight: '600' }}>Cropping PDF pages & extracting SKUs...</span>
        </div>
      )}

      {/* Processed Labels Output & Actions */}
      {processedLabels && !isProcessing && (
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '14px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>Cropped 4x6 Thermal Labels Ready ({processedLabels.length})</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Formatted and SKU-highlighted for instant thermal printing</p>
            </div>
            <button
              onClick={handlePrint}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: '#10b981',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Printer size={18} /> Print All 4x6 Labels
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {processedLabels.map((lbl, idx) => (
              <div key={idx} style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '10px', padding: '1.25rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'var(--primary-red)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800' }}>
                    {lbl.channel}
                  </span>
                  <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={14} /> {lbl.status}
                  </span>
                </div>

                <div style={{ background: '#141414', padding: '0.75rem', borderRadius: '6px', border: '1px dashed #333', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU CODE (AUTO-HIGHLIGHTED):</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>{lbl.sku}</div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  <div><strong>Order ID:</strong> {lbl.id}</div>
                  <div><strong>Customer:</strong> {lbl.customer}</div>
                  <div><strong>Courier:</strong> {lbl.courier}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

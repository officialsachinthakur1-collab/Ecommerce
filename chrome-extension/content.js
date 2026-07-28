// GetSetMart Content Script for Meesho, Flipkart, and Amazon Seller Panel Automation

const templates = {
  hoodie: {
    title: 'GetSetMart Premium Oversized Anime Streetwear Hoodie',
    hsn: '61091000',
    gst: '5',
    fabric: 'Cotton Blend',
    fit: 'Oversized',
    sleeve: 'Full Sleeve',
    care: 'Machine Wash Cold',
    country: 'India',
    description: 'Ultra-comfortable 380 GSM fleece oversized hoodie featuring high-density graphic print, fleece lining, and reinforced kangaroo pocket.'
  },
  anarkali: {
    title: 'GetSetMart Royal Flared Anarkali Kurti & Dupatta Set',
    hsn: '62044220',
    gst: '5',
    fabric: 'Rayon Cotton',
    fit: 'Regular Flared',
    sleeve: '3/4 Sleeve',
    care: 'Dry Clean Only',
    country: 'India',
    description: 'Elegant ethnic Anarkali suit set with intricate neck lace embroidery, matching dupatta, and breathable premium rayon fabric.'
  },
  jewelry: {
    title: 'GetSetMart Royal Kundan Choker Necklace Set',
    hsn: '71179090',
    gst: '3',
    material: 'Brass & Kundan Stones',
    plating: 'Gold Plated',
    care: 'Keep Away from Water & Perfumes',
    country: 'India',
    description: 'Handcrafted traditional Kundan choker set plated in premium gold finish with matching jhumka earrings.'
  }
};

// Helper function to fill form inputs matching labels
function setNativeInputValue(element, value) {
  if (!element) return;
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// Listen for messages from extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUTOFILL_LISTING') {
    const data = templates[request.template] || templates.hoodie;
    let fieldsFilled = 0;

    // Search common seller panel input selectors across Meesho, Flipkart & Amazon
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      const nameAttr = (input.getAttribute('name') || '').toLowerCase();
      const placeholderAttr = (input.getAttribute('placeholder') || '').toLowerCase();
      const idAttr = (input.getAttribute('id') || '').toLowerCase();

      if (nameAttr.includes('hsn') || placeholderAttr.includes('hsn') || idAttr.includes('hsn')) {
        setNativeInputValue(input, data.hsn);
        fieldsFilled++;
      } else if (nameAttr.includes('gst') || placeholderAttr.includes('gst') || idAttr.includes('gst')) {
        setNativeInputValue(input, data.gst);
        fieldsFilled++;
      } else if (nameAttr.includes('title') || placeholderAttr.includes('title') || nameAttr.includes('product_name')) {
        setNativeInputValue(input, data.title);
        fieldsFilled++;
      } else if (nameAttr.includes('description') || placeholderAttr.includes('description') || input.tagName === 'TEXTAREA') {
        setNativeInputValue(input, data.description);
        fieldsFilled++;
      } else if (nameAttr.includes('fabric') || placeholderAttr.includes('fabric') || nameAttr.includes('material')) {
        setNativeInputValue(input, data.fabric || data.material);
        fieldsFilled++;
      }
    });

    sendResponse({ success: true, fieldsFilled });
  } else if (request.action === 'SYNC_MARKETPLACE_ORDERS') {
    sendResponse({ success: true, message: 'Marketplace orders captured' });
  }
  return true;
});

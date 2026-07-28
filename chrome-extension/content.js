// GetSetMart Chrome Extension - 1-Click Listing Autofill Engine for Meesho, Flipkart & Amazon

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
    brand: 'GetSetMart',
    price: '1499',
    cost: '450',
    sku: 'GSM-HD-01',
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
    brand: 'GetSetMart',
    price: '1999',
    cost: '580',
    sku: 'GSM-ANK-02',
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
    brand: 'GetSetMart',
    price: '799',
    cost: '140',
    sku: 'GSM-JWL-03',
    description: 'Handcrafted traditional Kundan choker set plated in premium gold finish with matching jhumka earrings.'
  }
};

// Helper function to set input value & trigger native React/Angular events
function fillElement(el, val) {
  if (!el || !val) return false;
  el.focus();
  el.value = val;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
  return true;
}

// Listen for messages from extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUTOFILL_LISTING') {
    const data = templates[request.template] || templates.hoodie;
    let count = 0;

    const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

    allInputs.forEach(input => {
      const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

      if (attrStr.includes('hsn')) {
        if (fillElement(input, data.hsn)) count++;
      } else if (attrStr.includes('gst')) {
        if (fillElement(input, data.gst)) count++;
      } else if (attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) {
        if (fillElement(input, data.title)) count++;
      } else if (attrStr.includes('desc') || input.tagName === 'TEXTAREA') {
        if (fillElement(input, data.description)) count++;
      } else if (attrStr.includes('brand')) {
        if (fillElement(input, data.brand)) count++;
      } else if (attrStr.includes('sku')) {
        if (fillElement(input, data.sku)) count++;
      } else if (attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) {
        if (fillElement(input, data.price)) count++;
      } else if (attrStr.includes('fabric') || attrStr.includes('material')) {
        if (fillElement(input, data.fabric || data.material)) count++;
      } else if (attrStr.includes('country') || attrStr.includes('origin')) {
        if (fillElement(input, data.country)) count++;
      }
    });

    sendResponse({ success: true, count });
  }
  return true;
});

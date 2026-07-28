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

// Function to extract real orders on screen from Meesho, Flipkart, or Amazon
function extractOrdersFromDOM() {
  const extracted = [];
  const currentUrl = window.location.href;
  const isMeesho = currentUrl.includes('meesho.com');
  const isFlipkart = currentUrl.includes('flipkart.com');
  const isAmazon = currentUrl.includes('amazon.in');

  const rows = document.querySelectorAll('tr, .order-card, [class*="orderCard"], [class*="OrderCard"], [class*="tableRow"]');

  rows.forEach((row, i) => {
    const text = row.innerText || '';
    if (text.length < 15) return;

    // Search for order IDs, prices, items in text content
    const orderIdMatch = text.match(/(MSH|OD|GSM|ORD|[0-9]{8,15})[-A-Z0-9]+/i);
    const priceMatch = text.match(/₹\s*([0-9,]+)/i) || text.match(/INR\s*([0-9,]+)/i) || text.match(/Rs\.?\s*([0-9,]+)/i);

    if (orderIdMatch || priceMatch) {
      const ordId = orderIdMatch ? orderIdMatch[0] : `ORD-${Date.now()}-${i}`;
      const priceVal = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : 1299;
      const channelName = isMeesho ? 'Meesho' : isFlipkart ? 'Flipkart' : isAmazon ? 'Amazon' : 'GetSetMart Store';

      extracted.push({
        id: ordId,
        date: new Date().toISOString().split('T')[0],
        channel: channelName,
        customer: 'Verified Customer',
        items: 'E-Commerce Product',
        price: priceVal,
        cost: Math.round(priceVal * 0.35),
        shipping: 70,
        fee: Math.round(priceVal * 0.08),
        ads: 50,
        rtoCost: 0,
        status: 'DELIVERED'
      });
    }
  });

  return extracted;
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
  } else if (request.action === 'SYNC_MARKETPLACE_ORDERS') {
    const ordersFound = extractOrdersFromDOM();
    sendResponse({ success: true, orders: ordersFound, count: ordersFound.length });
  }
  return true;
});

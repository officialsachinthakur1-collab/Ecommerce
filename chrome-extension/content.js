// GetSetMart Chrome Extension - Lisstify Style 1-Click Listing Scraper & Autofill Engine

// Helper function to set input value & trigger native React/Angular events
function fillElement(el, val) {
  if (!el || val === undefined || val === null || val === '') return false;
  el.focus();
  el.value = val;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
  return true;
}

// Function to extract currently filled form data from Meesho, Flipkart, or Amazon screen
function scrapeFilledFormData() {
  const scraped = {
    title: '',
    hsn: '',
    gst: '',
    fabric: '',
    brand: 'GetSetMart',
    price: '',
    cost: '',
    sku: '',
    description: ''
  };

  const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));

  allInputs.forEach(input => {
    const val = (input.value || '').trim();
    if (!val) return;

    const attrStr = `${input.name} ${input.id} ${input.placeholder} ${input.getAttribute('aria-label') || ''}`.toLowerCase();

    if (attrStr.includes('hsn') && !scraped.hsn) {
      scraped.hsn = val;
    } else if (attrStr.includes('gst') && !scraped.gst) {
      scraped.gst = val;
    } else if ((attrStr.includes('title') || attrStr.includes('product name') || attrStr.includes('item_name')) && !scraped.title) {
      scraped.title = val;
    } else if ((attrStr.includes('desc') || input.tagName === 'TEXTAREA') && !scraped.description) {
      scraped.description = val;
    } else if (attrStr.includes('brand') && !scraped.brand) {
      scraped.brand = val;
    } else if (attrStr.includes('sku') && !scraped.sku) {
      scraped.sku = val;
    } else if ((attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) && !scraped.price) {
      scraped.price = val;
    } else if ((attrStr.includes('fabric') || attrStr.includes('material')) && !scraped.fabric) {
      scraped.fabric = val;
    }
  });

  return scraped;
}

// Listen for messages from extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUTOFILL_LISTING') {
    const data = request.templateData || {};
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
        if (fillElement(input, data.brand || 'GetSetMart')) count++;
      } else if (attrStr.includes('sku')) {
        if (fillElement(input, data.sku || `GSM-SKU-${Date.now()}`)) count++;
      } else if (attrStr.includes('price') || attrStr.includes('mrp') || attrStr.includes('sp')) {
        if (fillElement(input, data.price)) count++;
      } else if (attrStr.includes('fabric') || attrStr.includes('material')) {
        if (fillElement(input, data.fabric)) count++;
      } else if (attrStr.includes('country') || attrStr.includes('origin')) {
        if (fillElement(input, 'India')) count++;
      }
    });

    sendResponse({ success: true, count });
  } else if (request.action === 'CAPTURE_FORM_DATA') {
    const formData = scrapeFilledFormData();
    sendResponse({ success: true, formData });
  }
  return true;
});

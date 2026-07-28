document.addEventListener('DOMContentLoaded', () => {
  const siteStatusEl = document.getElementById('site-status');
  const siteBadgeEl = document.getElementById('site-badge');
  const templateSelect = document.getElementById('template-select');
  const autofillBtn = document.getElementById('autofill-btn');
  const cropperBtn = document.getElementById('cropper-btn');
  const syncOrdersBtn = document.getElementById('sync-orders-btn');

  // Detect current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    const currentUrl = tabs[0].url || '';

    if (currentUrl.includes('meesho.com')) {
      siteStatusEl.textContent = 'Meesho Supplier Panel Detected';
      siteBadgeEl.textContent = 'MEESHO LIVE';
      siteBadgeEl.style.color = '#f43397';
    } else if (currentUrl.includes('flipkart.com')) {
      siteStatusEl.textContent = 'Flipkart Seller Hub Detected';
      siteBadgeEl.textContent = 'FLIPKART LIVE';
      siteBadgeEl.style.color = '#2874f0';
    } else if (currentUrl.includes('amazon.in')) {
      siteStatusEl.textContent = 'Amazon Seller Central Detected';
      siteBadgeEl.textContent = 'AMAZON LIVE';
      siteBadgeEl.style.color = '#ff9900';
    } else {
      siteStatusEl.textContent = 'GetSetMart Assistant Ready';
      siteBadgeEl.textContent = 'STANDBY';
    }
  });

  // 1-Click Autofill Listing Form Event
  autofillBtn.addEventListener('click', () => {
    const selectedTemplate = templateSelect.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'AUTOFILL_LISTING',
          template: selectedTemplate
        }, (response) => {
          if (chrome.runtime.lastError) {
            alert("Please open Meesho, Flipkart, or Amazon seller panel product listing page first!");
          } else if (response && response.success) {
            alert("Success! Form autofilled with GetSetMart template.");
          }
        });
      }
    });
  });

  // Open 4x6 Thermal Label Cropper Tool
  cropperBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://getsetmart.com/admin/label-cropper' });
  });

  // Sync Orders Event
  syncOrdersBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'SYNC_MARKETPLACE_ORDERS'
        }, (response) => {
          if (chrome.runtime.lastError) {
            alert("Please open your Marketplace Orders page first to sync!");
          } else {
            alert("Marketplace orders synced cleanly to GetSetMart Admin Panel!");
          }
        });
      }
    });
  });
});

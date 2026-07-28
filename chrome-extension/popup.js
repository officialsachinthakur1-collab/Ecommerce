document.addEventListener('DOMContentLoaded', () => {
  const siteStatusEl = document.getElementById('site-status');
  const siteBadgeEl = document.getElementById('site-badge');
  const templateSelect = document.getElementById('template-select');
  const autofillBtn = document.getElementById('autofill-btn');

  // Detect current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    const activeUrl = tabs[0].url || '';

    if (activeUrl.includes('meesho.com')) {
      siteStatusEl.textContent = 'Meesho Listing Panel Detected';
      siteBadgeEl.textContent = 'MEESHO LIVE';
      siteBadgeEl.style.color = '#f43397';
    } else if (activeUrl.includes('flipkart.com')) {
      siteStatusEl.textContent = 'Flipkart Listing Panel Detected';
      siteBadgeEl.textContent = 'FLIPKART LIVE';
      siteBadgeEl.style.color = '#2874f0';
    } else if (activeUrl.includes('amazon.in')) {
      siteStatusEl.textContent = 'Amazon Listing Panel Detected';
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
            alert("⚠️ Please open Meesho (supplier.meesho.com), Flipkart, or Amazon Product Listing page first!");
          } else if (response && response.success) {
            alert(`✅ Success! Autofilled ${response.count || 'multiple'} listing fields using GetSetMart template.`);
          }
        });
      }
    });
  });
});

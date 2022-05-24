console.log('Background service is running!');

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    
    if (changeInfo.url) {
        const tabManagerModule = await import('./modules/TabManager.js');
        tabManagerModule.TabManager.tabUpdateListener(tabId, changeInfo.url);
    }

});

chrome.tabs.onRemoved.addListener(async (tabId) => {
    console.log(`tab ${tabId} is closed`);
})
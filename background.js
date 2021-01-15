chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  console.log(details);

  if (details.url.includes("problems")) {
    console.log("inside problems");
          console.log(details.tabId);
        chrome.tabs.sendMessage(
          details.tabId,
          {
            type: "check",
          },
          function (response) {
            console.log(chrome.runtime.lastError);
            if (chrome.runtime.lastError && chrome.runtime.lastError.message.includes("Receiving end does not exist")) {
              console.log('here');
              chrome.tabs.executeScript(details.tabId, { file: "./lib/js/jquery.js" }, () => {
                chrome.tabs.executeScript(details.tabId, { file: "content.js" }, () => { console.log("done") });
              })
            }
          }
        );
  }
});

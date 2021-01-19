chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  // console.log(details);

  if (
    details.url.includes('problems') &&
    (details.url.startsWith('http://www.codechef.com') ||
      details.url.startsWith('https://www.codechef.com'))
  ) {
    // console.log('inside problems');
    // console.log(details.tabId);
    chrome.tabs.sendMessage(
        details.tabId,
        {
          type: 'check',
        },
        function(response) {
        // console.log(chrome.runtime.lastError);
          if (response && response.status == 'ok') {
            chrome.tabs.executeScript(
                details.tabId,
                {file: './src/dominsert.js'},
                () => {
                  // console.log('only dominsert');
                },
            );
          } else if (
            chrome.runtime.lastError &&
          chrome.runtime.lastError.message.includes(
              'Receiving end does not exist',
          )
          ) {
          // console.log('here');
            chrome.tabs.executeScript(
                details.tabId,
                {file: './src/lib/js/jquery.js'},
                () => {
                  chrome.tabs.executeScript(
                      details.tabId,
                      {file: './src/content.js'},
                      () => {
                        chrome.tabs.executeScript(
                            details.tabId,
                            {file: './src/dominsert.js'},
                            () => {
                              // console.log('full insert');
                            },
                        );
                      },
                  );
                },
            );
          }
        },
    );
  }
});

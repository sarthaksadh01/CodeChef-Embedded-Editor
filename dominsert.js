if (document.querySelector("#code-editor-inserted") == undefined) {
    document.getElementsByTagName("main")[0].append(inserted);
    waitForEl('#problem-statement > div', insertIframe);
}

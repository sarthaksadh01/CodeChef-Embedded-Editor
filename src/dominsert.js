if (document.querySelector('#code-editor-inserted') == undefined) {
  document.getElementsByTagName('main')[0].append(inserted);
  waitForEl('#problem-statement > div', insertIframe);
  waitForEl(
      '#content-regions > header > div > div.large-12.columns > h1',
      goToEditorButton,
  );
}

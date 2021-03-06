import {
  themeCode,
  languageCode,
  signalTable,
  statusImgs,
  kepMapCodes,
} from './config.js';
let selectedLanguage = languageCode[0];
let selectedTheme = themeCode[0];
let selectedKeyMap = kepMapCodes[0];

// eslint-disable-next-line new-cap
const editor = CodeMirror(document.getElementById('code_editor'), {
  value: '',
  lineNumbers: true,
  mode: selectedLanguage.mode,
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
  theme: selectedTheme,
  tabSize: 2,
  keyMap: 'default',
});
const changeLangUtil = (lang) => {
  selectedLanguage = lang;
};

const changeThemeUtil = (theme) => {
  selectedTheme = theme;
};

const changeKeyMapUtil = (keymap) => {
  selectedKeyMap = keymap;
};

const sendMessage = (data) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
        resolve(response);
      });
    });
  });
};

const getCode = () => {
  sendMessage({
    type: 'getCode',
    language: selectedLanguage.name,
  }).then((response) => {
    const code =
      response.code == null ||
      response.code == undefined ||
      response.code == '' ?
        selectedLanguage.defaultCode :
        response.code;
    editor.getDoc().setValue(code);
  });
};

const saveCode = (
    langChanged = false,
    language = selectedLanguage.name,
) => {
  sendMessage({
    type: 'saveCode',
    language,
    code: editor.getValue(),
  }).then((response) => {
    if (langChanged) getCode();
  });
};

const saveLanguagePref = (language) => {
  saveCode(true, selectedLanguage.name);
  selectedLanguage = languageCode[language];
  sendMessage({
    type: 'setPref',
    change: 'language',
    value: JSON.stringify(selectedLanguage),
  }).then((response) => {
    editor.setOption('mode', selectedLanguage.mode);
  });
};

const saveThemePref = (theme) => {
  selectedTheme = themeCode[theme];
  sendMessage({
    type: 'setPref',
    change: 'theme',
    value: selectedTheme,
  }).then((response) => {
    editor.setOption('theme', selectedTheme);
  });
};

const saveKeyMapPref = (keyMap) => {
  selectedKeyMap = kepMapCodes[keyMap];
  sendMessage({
    type: 'setPref',
    change: 'keyMap',
    value: selectedKeyMap,
  }).then((response) => {
    editor.setOption('keyMap', selectedKeyMap);
  });
};

const resizeIframeRequest = () => {
  sendMessage({
    len: document.body.scrollHeight,
    type: 'resize',
  });
};

const resetStatus = () => {
  document.querySelector('#statusImgs').src = document.querySelector(
      '#statusImgs',
  ).title = document.querySelector(
      '#imgLabel',
  ).innerHTML = document.querySelector(
      '#res_image',
  ).src = document.querySelector('#res_text').innerHTML = '';
  // document.querySelector("#statusBtn").innerHTML = "";
  $('#statusDiv').hide();
};
const setStatus = (resultCode) => {
  document.querySelector('#statusImgs').src = document.querySelector(
      '#res_image',
  ).src = statusImgs[resultCode].url;
  if (statusImgs[resultCode].message.length <= 20) {
    document.querySelector('#statusImgs').title = document.querySelector(
        '#imgLabel',
    ).innerHTML = document.querySelector('#res_text').innerHTML =
      statusImgs[resultCode].message;
  } else {
    if ($('#output').val() == '') {
      $('#output').val(statusImgs[resultCode].message);
      $('#outputDiv').show();
    }
  }
  $('#statusDiv').show();
};

const setStats = (res) => {
  // console.log(res);
  if (res.time) {
    document.querySelector('#time').innerHTML = res.time;
    $('#timeDiv').show();
  } else $('#timeDiv').hide();
  if (res.memory) {
    document.querySelector('#memory').innerHTML =
      parseInt(res.memory) / 1000;
    $('#memoryDiv').show();
  } else $('#memoryDiv').hide();
  if (
    res.signal &&
    res.signal != undefined &&
    res.signal != 15 &&
    res.signal != 0
  ) {
    $('#signalDiv').show();
    if (Number.isInteger(res.signal)) {
      document.querySelector('#signal').innerHTML =
        signalTable[res.signal] || 'NZEC';
    } else document.querySelector('#signal').innerHTML = res.signal;
  } else $('#signalDiv').hide();
  if (res.result_code) {
    setStatus(res.result_code);
  } else {
    resetStatus();
  }
  resizeIframeRequest();
};

const disableButton = () => {
  $('#submit_code').attr('disabled', true);
  $('#run_code').attr('disabled', true);
};

const enableButton = () => {
  $('#submit_code').removeAttr('disabled');
  $('#run_code').removeAttr('disabled');
};

export {
  getCode,
  saveCode,
  saveLanguagePref,
  saveThemePref,
  setStats,
  disableButton,
  enableButton,
  selectedLanguage,
  selectedTheme,
  editor,
  selectedKeyMap,
  changeLangUtil,
  sendMessage,
  changeThemeUtil,
  resizeIframeRequest,
  resetStatus,
  saveKeyMapPref,
  changeKeyMapUtil,
};

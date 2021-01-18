import {
  saveThemePref,
  saveCode,
  saveLanguagePref,
  setStats,
  disableButton,
  enableButton,
  selectedTheme,
  selectedLanguage,
  editor,
  changeLangUtil,
  sendMessage,
  changeThemeUtil,
  resizeIframeRequest,
  resetStatus,
  saveKeyMapPref,
  selectedKeyMap,
  changeKeyMapUtil
} from './common_functions.js';
import {themeCode, languageCode,kepMapCodes} from './config.js';

let isCustomInput = false;
let isLoading = false;

$('#timeDiv').hide();
$('#memoryDiv').hide();
$('#signalDiv').hide();
$('#statusDiv').hide();
$('#run_code_loading').hide();
$('#submit_code_loading').hide();

$('#submit_code').click(function() {
  resetStatus();
  if (isLoading) return;
  disableButton();
  isLoading = true;
  const input = isCustomInput ? $('#input').val() : '';
  $('#submit_code_text').text('Submitting...');
  $('#submit_code_loading').show();
  sendMessage({
    sourceCode: editor.getValue(),
    input,
    language: selectedLanguage.code,
    type: 'submit',
  }).then((response) => {
    isLoading = false;
    enableButton();
    $('#submit_code_text').text('Submit Code');
    $('#submit_code_loading').hide();
    if (response.status == 'error') {
      $('#output').val(response.errors.toString());
      $('#outputDiv').show();
      $('#errorDiv').hide();
    } else {
      console.log(response.status);
      $('#outputDiv').hide();
      $('#errorDiv').show();
      if (response.status.result_code != 'compile') {
        const tableDiv = document.querySelector('#errorDiv');
        tableDiv.innerHTML = response.table;
        const table = $('.status-table');
        table.addClass('table');
        $('.wrong').css('background-color', 'coral');
        $('.correct').css('background-color', 'lightgreen');
      } else {
        // use response.status.error_link and
        // extract the error message from the webpage
      }
      setStats(response.status);
      document.querySelector('#customInput').checked = false;
      $('#inputDiv').hide();
    }
  });
});

$('#run_code').click(function() {
  resetStatus();
  if (isLoading) return;
  disableButton();
  isLoading = true;
  const input = isCustomInput ? $('#input').val() : '';
  $('#run_code_text').text('Running...');
  $('#run_code_loading').show();
  sendMessage({
    sourceCode: editor.getValue(),
    input: input,
    language: selectedLanguage.code,
    type: 'run',
  }).then((response) => {
    isLoading = false;

    enableButton();
    $('#run_code_text').text('Run Code');
    $('#run_code_loading').hide();
    console.log(response);
    $('#outputDiv').show();
    $('#errorDiv').hide();
    if (response.output != '') $('#output').val(response.output);
    else $('#output').val(response.cmpinfo);
    if (response.stderr != '') {
      $('#stderr').val(response.stderr);
      $('#stderrDiv').show();
    } else $('#stderrDiv').hide();
    setStats(response);
  });
});

sendMessage({
  type: 'getPref',
}).then((response) => {
  changeThemeUtil(response.theme ? response.theme : themeCode[0]);
  changeLangUtil(
    response.language ? JSON.parse(response.language) : languageCode[0],
  );
  changeKeyMapUtil(response.keyMap);
  editor.setOption('theme', selectedTheme);
  editor.setOption('mode', selectedLanguage.mode);
  editor.setOption('keyMap',selectedKeyMap)
  const langIndex = languageCode.findIndex((code) => {
    return selectedLanguage.name == code.name;
  });
  const themeIndex = themeCode.findIndex((code) => {
    return selectedTheme == code;
  });
  const keyMapIndex = kepMapCodes.findIndex((code) => {
    return selectedKeyMap == code;
  });
  const code =
    response.code == null ||
    response.code == undefined ||
    response.code == '' ?
      selectedLanguage.defaultCode :
      response.code;
  $(`#language_select option[value=${langIndex}]`).prop('selected', true);
  $(`#theme_select option[value=${themeIndex}]`).prop('selected', true);
  $(`#keymap_select option[value=${keyMapIndex}]`).prop('selected', true);
  editor.getDoc().setValue(code);
});

$('#theme_select').on('change', (e) => {
  // eslint-disable-next-line no-invalid-this
  saveThemePref(e.target.value);
});

$('#language_select').on('change', (e) => {
  // eslint-disable-next-line no-invalid-this
  saveLanguagePref(e.target.value);
});
$('#keymap_select').on('change', (e) => {
  // eslint-disable-next-line no-invalid-this
  saveKeyMapPref(e.target.value);
});
editor.on('change', (editor) => {
  saveCode();
});

const customInput = document.querySelector('#customInput');
customInput.onchange = () => {
  console.log();
  if (customInput.checked) {
    isCustomInput = true;
    $('#inputDiv').show();
  } else {
    isCustomInput = false;
    $('#inputDiv').hide();
  }
  resizeIframeRequest();
};

// editor.on('keyup', function(cm, event) {
//   if (
//     /* Enables keyboard navigation in autocomplete list*/
//     !cm.state.completionActive &&
//     event.keyCode > 64 &&
//     event.keyCode < 91
//   ) {
//     // only when a letter key is pressed
//     CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
//   }
// });

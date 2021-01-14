var languageCode = [
    {
        code: 63,
        name: "C++",
        mode: "text/x-c++src"
    },
    {
        code: 116,
        name: "Python",
        mode: "python"
    },
    {
        code: 56,
        name: "Javascript",
        mode: "javascript"
    },
    {
        code: 10,
        name: "Java",
        mode: "text/x-java"
    }
]

var themeCode = ['xq-light', 'dracula']
var isCustomInput = false;
var isLoading = false;
var selectedLanguage = languageCode[0];
var selectedTheme = themeCode[0];

const saveLanguagePref = (language) => {
    selectedLanguage = languageCode[language];
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "setPref",
            change: "language",
            value: JSON.stringify(selectedLanguage)
        }, function (response) {

        });
    });
    editor.setOption("mode", selectedLanguage.mode);
}
const saveThemePref = (theme) => {
    selectedTheme = themeCode[theme];
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "setPref",
            change: "theme",
            value: selectedTheme
        }, function (response) {

        });
    });
    editor.setOption("theme", selectedTheme);
}

var editor = CodeMirror(document.getElementById("code_editor"), {
    value: "",
    lineNumbers: true,
    mode: selectedLanguage.mode,
    autoCloseBrackets: true,
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: selectedTheme,
    tabSize: 2
});

$("#submit_code").click(function () {
    var input = isCustomInput ? $("#input").val() : "";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            sourceCode: editor.getValue(),
            input,
            language: selectedLanguage.code,
            type: "submit"
        }, function (response) {
            console.log(response.output);
            $("#outputDiv").hide();
            $("#errorDiv").show();
            document.querySelector("#errorDiv").innerHTML = response.output;
            let table = $(".status-table");
            table.addClass("table");
            $(".wrong").css("background-color", "coral");
            $(".correct").css("background-color", "lightgreen");
        });
    });
})

$("#run_code").click(function () {
    var input = isCustomInput ? $("#input").val() : "";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            sourceCode: editor.getValue(),
            input: input,
            language: selectedLanguage.code,
            type: "run"
        }, function (response) {
            console.log(response.output);
            $("#outputDiv").show();
            $("#errorDiv").hide();
            $("#output").val(response.output)
        });
    });
})

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
        type: "getPref"
    }, function (response) {
       
        selectedTheme = response.theme ? response.theme : themeCode[0];
        selectedLanguage = response.language ? JSON.parse(response.language) : languageCode[0];
        editor.setOption("theme", selectedTheme);
        editor.setOption("mode", selectedLanguage.mode);
        let langIndex = languageCode.findIndex((code)=>{
            return selectedLanguage.mode == code.mode
        });
        let themeIndex = themeCode.findIndex((code)=>{
            return selectedTheme == code;
        });
        $(`#language_select option[value=${langIndex}]`).prop('selected', true);
        $(`#theme_select option[value=${themeIndex}]`).prop('selected', true);

    });
});

$('#theme_select').on('change', function () {
    saveThemePref(this.value);
});

$('#language_select').on('change', function () {
    saveLanguagePref(this.value);
});

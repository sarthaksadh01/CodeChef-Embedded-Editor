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

const getCode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "getCode",
            language: selectedLanguage.name,
        }, function (response) {
            editor.getDoc().setValue(response.code);
        });
    });
}


const saveCode = (langChanged = false,language = selectedLanguage.name) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "saveCode",
            language,
            code: editor.getValue(),
        }, function (response) {
            if (langChanged)
                getCode();

        });
    });

}


const saveLanguagePref = (language) => {
    saveCode(true,selectedLanguage.name);
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
    $("#submit_code").text("Submitting...");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            sourceCode: editor.getValue(),
            input,
            language: selectedLanguage.code,
            type: "submit"
        }, function (response) {
            console.log(response.output);
            $("#submit_code").text("Submit Code");
            $("#outputDiv").hide();
            $("#errorDiv").show();
            let tableDiv=document.querySelector("#errorDiv")
            tableDiv.innerHTML = response.table;
            let table = $(".status-table");
            table.addClass("table");
            $(".wrong").css("background-color", "coral");
            $(".correct").css("background-color", "lightgreen");
        });
    });
})



$("#run_code").click(function () {
    var input = isCustomInput ? $("#input").val() : "";
    $("#run_code").text("Running...");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            sourceCode: editor.getValue(),
            input: input,
            language: selectedLanguage.code,
            type: "run"
        }, function (response) {
            $("#run_code").text("Run Code");
            console.log(response.output);
            // showResponse(response.status);
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
        let langIndex = languageCode.findIndex((code) => {
            return selectedLanguage.mode == code.mode
        });
        let themeIndex = themeCode.findIndex((code) => {
            return selectedTheme == code;
        });
        $(`#language_select option[value=${langIndex}]`).prop('selected', true);
        $(`#theme_select option[value=${themeIndex}]`).prop('selected', true);
        editor.getDoc().setValue(response.code);

    });
});

$('#theme_select').on('change', function () {
    saveThemePref(this.value);
});

$('#language_select').on('change', function () {
    saveLanguagePref(this.value);
});

editor.on('change', (editor) => {
    saveCode();
  });

let customInput=document.querySelector("#customInput")
customInput.onchange = () => {
  console.log();
  if (customInput.checked) {
    isCustomInput = true;
    $("#inputDiv").show();
  }
  else {
    isCustomInput = false;
    $("#inputDiv").hide();
  }
};

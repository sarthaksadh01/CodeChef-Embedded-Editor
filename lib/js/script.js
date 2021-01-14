const apiCall = (data, url) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            registerError: false,
            dataType: 'JSON',
            url,
            type: 'POST',
            headers: {
                "X-CSRF-TOKEN": window.csrfToken
            },
            data,
            success: function (e) {
                alert(JSON.stringify(e))
                console.log(e);
                resolve(e);
            },
            error: function (e) {
                alert(JSON.stringify(e));
                reject(e);
            }
        }, false, false);
    })
}

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
        mode: "text/x-c++src"
    }
]

var themeCode = ['xq-light', 'dracula']

// data: {
//     sourceCode,
//     language,
//     problemCode,
//     contestCode,
//     input
// },

const saveCode = (problemCode, code, language) => {
    localStorage.setItem(`${problemCode}_${language}`, code);
}

const getCode = (problemCode, language) => {
    let code = localStorage.getItem(`${problemCode}_${language}`)
    return code ? code : "";
}

const saveLanguagePref = (language) => {
    localStorage.setItem('language', languageCode[language]);
    selectedLanguage = languageCode[language];
    editor.setOption("mode", selectedLanguage.mode);
}
const getLanguagePref = () => {
    let pref = localStorage.getItem('language');
    return pref ? pref : languageCode[0];
}

const saveThemePref = (theme) => {
    localStorage.setItem('theme', theme);
    selectedTheme = theme;
    editor.setOption("theme", themeCode[selectedTheme]);
}
const getThemePref = () => {
    let pref = localStorage.getItem('theme');
    return pref ? pref : 1;
}

const hideAll=()=>{

}

var isCustomInput = false;
var isLoading = false;
var selectedLanguage = getLanguagePref();
var selectedTheme = getThemePref();
var problemCode = ""
var contestCode = "";
var code = getCode(problemCode, selectedLanguage);

var editor = CodeMirror(document.getElementById("code_editor"), {
    value: "",
    lineNumbers: true,
    mode: selectedLanguage.mode,
    autoCloseBrackets: true,
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: themeCode[selectedTheme],
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

$('#theme_select').on('change', function () {
    saveThemePref(this.value);
});

$('#language_select').on('change', function () {
    saveLanguagePref(this.value);
});

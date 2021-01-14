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
            $("#output").val(response.output)
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


function show_submission_status(e, r, s, t, o, n, a) {
  upid_gl = e;
  $.ajax({
    url: "/get_submission_status/" + e + "/",
    dataType: "json",
    headers: { "x-csrf-token": a },
    success: function (e) {
      if (e.result_code != "wait") {
        clearInterval(intervalId);
        var r = e.result_code;
        var s = e.signal;
        var a = e.error_link;
        var i = e.time;
        var c = e.score;
        var l = e.is_funny_mode;
        if (l) {
          switch (r) {
            case "partial_accepted":
              $("#display_result").html(
                '<center> <img src="https://s3.amazonaws.com/codechef_shared/download/emojis/sad.png"/> <br/>(' +
                  c +
                  ") <br /> <strong>Get a life!</strong> <br /> <strong>Execution Time: " +
                  i +
                  "</strong> </center>"
              );
              break;
            case "accepted":
              $("#display_result").html(
                '<center> <img src="https://s3.amazonaws.com/codechef_shared/download/emojis/sad.png"/> <br /> <strong>Get a life!</strong> <br /> <strong>Execution Time: ' +
                  i +
                  "</strong> </center>"
              );
              break;
            case "wrong":
              $("#display_result").html(
                '<center> <img src="https://s3.amazonaws.com/codechef_shared/download/emojis/haha.png"/> <br /> <strong>Are you kidding bro! Ain\'t understand what you just did.</strong> </center>'
              );
              break;
            case "time":
              $("#display_result").html(
                '<center> <img src="https://s3.amazonaws.com/codechef_shared/download/emojis/angry.png"/> <br /> <strong>Come on! I won\'t run for that long.</strong> </center>'
              );
              break;
            case "runtime":
              $("#display_result").html(
                '<center> <span title="runtime error(' +
                  s +
                  ')"><img src="https://s3.amazonaws.com/codechef_shared/download/emojis/wow.png"/></span> <br /> <strong>Use GPS so that you don\'t get lost again(' +
                  s +
                  ")</strong> </center>"
              );
              break;
            case "compile":
              $("#display_result").html(
                '<center> <img src="https://s3.amazonaws.com/codechef_shared/download/emojis/confused.png"/> <br /> <strong>Pluto ? That\'s not a planet anymore.</strong> </center>'
              );
              $("#compilation_error").html(
                '<b>Click <a href="' +
                  a +
                  '" target="_blank">here</a> to view your compilation error.</b>'
              );
              break;
            case "score":
              $("#display_result").html(
                '<center> <img src="/misc/cross-icon.gif"/> <br /> <strong>Insufficient Score</strong> </center>'
              );
              break;
            case "error":
              $("#display_result").html(
                "<center> <strong>:( internal error occurred in the system</strong> </center>"
              );
              break;
          }
        } else {
          switch (r) {
            case "partial_accepted":
              $("#display_result").html(
                '<center> <img src="/sites/all/modules/codechef_tags/images/partially-solved.png"/> <br/>(' +
                  c +
                  ") <br /> <strong>Partially Correct Answer</strong> <br /> <strong>Execution Time: " +
                  i +
                  "</strong> </center>"
              );
              break;
            case "accepted":
              $("#display_result").html(
                '<center> <img src="/misc/tick-icon.gif"/> <br /> <strong>Correct Answer</strong> <br /> <strong>Execution Time: ' +
                  i +
                  "</strong> </center>"
              );
              break;
            case "wrong":
              $("#display_result").html(
                '<center> <img src="/misc/cross-icon.gif"/> <br /> <strong>Wrong Answer</strong> </center>'
              );
              break;
            case "time":
              $("#display_result").html(
                '<center> <img src="/misc/clock_error.png"/> <br /> <strong>Time limit exceeded</strong> </center>'
              );
              break;
            case "runtime":
              $("#display_result").html(
                '<center> <span title="runtime error(' +
                  s +
                  ')"><img src="/misc/runtime-error.png"/></span> <br /> <strong>Runtime Error(' +
                  s +
                  ")</strong> </center>"
              );
              break;
            case "compile":
              $("#display_result").html(
                '<center> <img src="/misc/alert-icon.gif"/> <br /> <strong>Compile Error</strong> </center>'
              );
              $("#compilation_error").html(
                '<b>Click <a href="' +
                  a +
                  '" target="_blank">here</a> to view your compilation error.</b>'
              );
              break;
            case "score":
              $("#display_result").html(
                '<center> <img src="/misc/cross-icon.gif"/> <br /> <strong>Insufficient Score</strong> </center>'
              );
              break;
            case "error":
              $("#display_result").html(
                "<center> <strong>:( internal error occurred in the system</strong> </center>"
              );
              break;
          }
        }
        $("#waiting_div").css("display", "none");
        $("#old_submissions_div").css("display", "block");
        if (e.show_status_table == "yes") {
          $.ajax({
            url: "/error_status_table/" + e.upid + "/",
            success: function (e) {
              $("#status_table").html(e);
            },
          });
        }
        if (r == "accepted") {
          if (n == 1) {
            $("#submission-status-todo")
              .html("Problem " + t + " was removed from your Todo List")
              .css("color", "green")
              .show();
            var m = parseInt($(".notification-counter").text(), 10);
            $(".notification-counter").text(m - 1);
          }
        } else {
          $("#FAQ_div").css("display", "block");
          if ((o == 0 || o == 2) && n == 0) {
            $("#submission-status-todo").css("display", "block");
            todo_widget_init();
          }
        }
      }
    },
    error: function (e) {
      if (e.status == 403) {
        values = $.parseJSON(e.responseText);
        if (values.status == "apierror") {
          window.location.reload();
        }
      }
    },
  });
}

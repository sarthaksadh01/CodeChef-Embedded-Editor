var languageCode = [
  {
    code: 11,
    name: "C",
    mode: "text/x-c++src",
  },
  {
    code: 44,
    name: "C++ 14",
    mode: "text/x-c++src",
  },
  {
    code: 63,
    name: "C++ 17",
    mode: "text/x-c++src",
  },
  {
    code: 116,
    name: "Python 3",
    mode: "python",
  },
  {
    code: 4,
    name: "Python 2",
    mode: "python",
  },
  {
    code: 10,
    name: "Java",
    mode: "text/x-java",
  },
];

signal_table = {
  1: "SIGHUP",
  2: "SIGINT",
  3: "SIGQUIT",
  4: "SIGILL",
  5: "SIGTRAP",
  6: "SIGABRT",
  6: "SIGIOT",
  7: "SIGBUS",
  8: "SIGFPE",
  9: "SIGKILL",
  10: "SIGUSR1",
  11: "SIGSEGV",
  12: "SIGUSR2",
  13: "SIGPIPE",
  14: "SIGALRM",
  15: "SIGTERM",
  16: "SIGSTKFLT",
  17: "SIGCHLD",
  17: "SIGCLD",
  18: "SIGCONT",
  19: "SIGSTOP",
  20: "SIGTSTP",
  21: "SIGTTIN",
  22: "SIGTTOU",
  23: "SIGURG",
  24: "SIGXCPU",
  25: "SIGXFSZ",
  26: "SIGVTALRM",
  27: "SIGPROF",
  28: "SIGWINCH",
  29: "SIGPOLL",
  29: "SIGIO",
  30: "SIGPWR",
  31: "SIGSYS",
  32: "SIGRTMIN-2",
  33: "SIGRTMIN-1",
  34: "SIGRTMIN",
  35: "SIGRTMIN+1",
  36: "SIGRTMIN+2",
  37: "SIGRTMIN+3",
  38: "SIGRTMIN+4",
  39: "SIGRTMIN+5",
  40: "SIGRTMIN+6",
  41: "SIGRTMIN+7",
  42: "SIGRTMIN+8",
  43: "SIGRTMIN+9",
  44: "SIGRTMIN+10",
  45: "SIGRTMIN+11",
  46: "SIGRTMIN+12",
  47: "SIGRTMIN+13",
  48: "SIGRTMIN+14",
  49: "SIGRTMIN+15",
  50: "SIGRTMAX-14",
  51: "SIGRTMAX-13",
  52: "SIGRTMAX-12",
  53: "SIGRTMAX-11",
  54: "SIGRTMAX-10",
  55: "SIGRTMAX-9",
  56: "SIGRTMAX-8",
  57: "SIGRTMAX-7",
  58: "SIGRTMAX-6",
  59: "SIGRTMAX-5",
  60: "SIGRTMAX-4",
  61: "SIGRTMAX-3",
  62: "SIGRTMAX-2",
  63: "SIGRTMAX-1",
  64: "SIGRTMAX",
};

let statusImgs = {
  compile: {
    url: "https://www.codechef.com/misc/alert-icon.gif",
    message: "Compilation Error",
  },
  wrong: {
    url: "https://www.codechef.com/misc/cross-icon.gif",
    message: "Wrong Answer",
  },
  time: {
    url: "https://www.codechef.com/misc/clock_error.png",
    message: "Time Limit Exceeded",
  },
  partial_accepted: {
    url:
      "https://www.codechef.com/sites/all/modules/codechef_tags/images/partially-solved.png",
    message: "Partially Accepted",
  },
  accepted: {
    url: "https://www.codechef.com/misc/tick-icon.gif",
    message: "All Correct",
  },
  runtime: {
    url: "https://www.codechef.com/misc/runtime-error.png",
    message: "Runtime Error",
  },
};

var themeCode = ["xq-light", "dracula"];
var isCustomInput = false;
var isLoading = false;
var selectedLanguage = languageCode[0];
var selectedTheme = themeCode[0];

const getCode = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: "getCode",
        language: selectedLanguage.name,
      },
      function (response) {
        editor.getDoc().setValue(response.code);
      }
    );
  });
};

const saveCode = (langChanged = false, language = selectedLanguage.name) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: "saveCode",
        language,
        code: editor.getValue(),
      },
      function (response) {
        if (langChanged) getCode();
      }
    );
  });
};

const saveLanguagePref = (language) => {
  saveCode(true, selectedLanguage.name);
  selectedLanguage = languageCode[language];
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: "setPref",
        change: "language",
        value: JSON.stringify(selectedLanguage),
      },
      function (response) { }
    );
  });
  editor.setOption("mode", selectedLanguage.mode);
};

const saveThemePref = (theme) => {
  selectedTheme = themeCode[theme];
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: "setPref",
        change: "theme",
        value: selectedTheme,
      },
      function (response) { }
    );
  });
  editor.setOption("theme", selectedTheme);
};

var editor = CodeMirror(document.getElementById("code_editor"), {
  value: "",
  lineNumbers: true,
  mode: selectedLanguage.mode,
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
  theme: selectedTheme,
  tabSize: 2,
});

const setStats = (res) => {
  if (res.time) {
    document.querySelector("#time").innerHTML = res.time;
    $("#timeDiv").show();
  } else $("#timeDiv").hide();
  if (res.memory) {
    document.querySelector("#memory").innerHTML = parseInt(res.memory) / 1000;
    $("#memoryDiv").show();
  } else $("#memoryDiv").hide();
  if (
    res.signal &&
    res.signal != undefined &&
    res.signal != 15 &&
    res.signal != 0
  ) {
    $("#signalDiv").show();
    if (Number.isInteger(res.signal))
      document.querySelector("#signal").innerHTML = signal_table[res.signal];
    else document.querySelector("#signal").innerHTML = res.signal;
  } else $("#signalDiv").hide();
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        len: document.body.scrollHeight,
        type: "resize",
      },
      function (response) {
        console.log(response.status);
      }
    );
  });
}

$("#timeDiv").hide();
$("#memoryDiv").hide();
$("#signalDiv").hide();

$("#submit_code").click(function () {
  document.querySelector("#statusImgs").src = "";
  document.querySelector("#statusImgs").title = "";
  document.querySelector("#imgLabel").innerHTML = "";
  if (isLoading) return;
  isLoading = true;
  var input = isCustomInput ? $("#input").val() : "";
  $("#submit_code").text("Submitting...");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        sourceCode: editor.getValue(),
        input,
        language: selectedLanguage.code,
        type: "submit",
      },
      function (response) {
        isLoading = false;
        $("#submit_code").text("Submit Code");
        if (response.status == "error") {
          $("#output").val(response.errors.toString());
          $("#outputDiv").show();
          $("#errorDiv").hide();
        } else {
          console.log(response.status);
          $("#outputDiv").hide();
          $("#errorDiv").show();
          document.querySelector("#statusImgs").src =
            statusImgs[response.status.result_code].url;
          document.querySelector("#statusImgs").title =
            statusImgs[response.status.result_code].message;
          document.querySelector("#imgLabel").innerHTML =
            statusImgs[response.status.result_code].message;
          if (response.status.result_code != "compile") {
            let tableDiv = document.querySelector("#errorDiv");
            tableDiv.innerHTML = response.table;
            let table = $(".status-table");
            table.addClass("table");
            $(".wrong").css("background-color", "coral");
            $(".correct").css("background-color", "lightgreen");
          } else {
            // use response.status.error_link and extract the error message from the webpage
          }
          setStats(response.status);
        }
      }
    );
  });
});

$("#run_code").click(function () {
  document.querySelector("#statusImgs").src = "";
  document.querySelector("#statusImgs").title = "";
  document.querySelector("#imgLabel").innerHTML = "";
  if (isLoading) return;
  isLoading = true;
  var input = isCustomInput ? $("#input").val() : "";
  $("#run_code").text("Running...");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        sourceCode: editor.getValue(),
        input: input,
        language: selectedLanguage.code,
        type: "run",
      },
      function (response) {
        isLoading = false;
        $("#run_code").text("Run Code");
        console.log(response);
        $("#outputDiv").show();
        $("#errorDiv").hide();
        if (response.output != "") $("#output").val(response.output);
        else $("#output").val(response.cmpinfo);
        if (response.stderr != "") {
          $("#stderr").val(response.stderr);
          $("#stderrDiv").show();
        }
        else
          $("#stderrDiv").hide();
        setStats(response);
      }
    );
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    {
      type: "getPref",
    },
    function (response) {
      selectedTheme = response.theme ? response.theme : themeCode[0];
      selectedLanguage = response.language
        ? JSON.parse(response.language)
        : languageCode[0];
      editor.setOption("theme", selectedTheme);
      editor.setOption("mode", selectedLanguage.mode);
      let langIndex = languageCode.findIndex((code) => {
        return selectedLanguage.mode == code.mode;
      });
      let themeIndex = themeCode.findIndex((code) => {
        return selectedTheme == code;
      });
      $(`#language_select option[value=${langIndex}]`).prop("selected", true);
      $(`#theme_select option[value=${themeIndex}]`).prop("selected", true);
      editor.getDoc().setValue(response.code);
    }
  );
});

$("#theme_select").on("change", function () {
  saveThemePref(this.value);
});

$("#language_select").on("change", function () {
  saveLanguagePref(this.value);
});

editor.on("change", (editor) => {
  saveCode();
});

let customInput = document.querySelector("#customInput");
customInput.onchange = () => {
  console.log();
  if (customInput.checked) {
    isCustomInput = true;
    $("#inputDiv").show();
  } else {
    isCustomInput = false;
    $("#inputDiv").hide();
  }
};

editor.on("keyup", function (cm, event) {
  if (!cm.state.completionActive &&   /*Enables keyboard navigation in autocomplete list*/
    event.keyCode > 64 && event.keyCode < 91) {// only when a letter key is pressed
    CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
  }
});
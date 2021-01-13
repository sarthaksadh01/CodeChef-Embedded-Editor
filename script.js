// var html = `
// <div class="main mt-5">
//     <div class="container">
//       <div class="card ">
//         <div  class="card-header">
//           <div class="row">
//             <div class="col-2">
//               <div class="form-floating">
//                 <select class="form-select" id="language_select" >
//                   <option value="0">C++</option>
//                   <option value="1">Python</option>
//                   <option value="2">Javascript</option>
//                   <option value="3">Java</option>
//                 </select>
//                 <label for="floatingSelect">Select Language</label>
//               </div>
//             </div>
//             <div class="col-2">
//               <div class="form-floating">
//                 <select class="form-select" id="theme_select">
//                   <option value="0">Light</option>
//                   <option value="1">Dark</option>
//                 </select>
//                 <label for="floatingSelect">Select Theme</label>
//               </div>
//             </div>
//           </div>

//         </div>
        
//         <div class="card-body p-0">
//           <div id="sadh">

//           </div>
//         </div>
//         <div class="card-footer float-end">
//           <!-- <div class="btn-group" role="group" aria-label="Basic example"> -->
//           <div style="float: left;">
//             <div class="form-check">
//               <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
//               <label class="form-check-label" for="flexCheckChecked">
//                 Custom Input
//               </label>
//             </div>
//             <!-- <button type="button" class="btn btn-outline-primary rounded-pill">Use Example Test Cases</button> -->
//           </div>
//           <div style="float: right;">
//             <button id="lol" type="button blue" class=" ml-3 mr-3 btn btn-dark rounded-pill">Run Code</button>
//             <button type="button blue" class="btn btn-primary rounded-pill">Submit Code</button>
//           </div>

//           <!-- </div> -->
//         </div>
//       </div>
//     </div>
//   </div>
// `;

// $("body").append(html);

// const apiCall = (data, url) => {
//   return new Promise((resolve, reject) => {
//       $.ajax({
//           registerError: false,
//           dataType: 'JSON',
//           url,
//           type: 'POST',
//           headers: {
//               "X-CSRF-TOKEN": window.csrfToken
//           },
//           data,
//           success: function (e) {
//               console.log(e);
//               resolve(e);
//           },
//           error: function (e) {
//               reject(e);
//           }
//       }, false, false);
//   })

// }

// var languageCode = [
//   {
//       code:63,
//       name:"C++",
//       mode:"text/x-c++src"
//   },
//   {
//       code:116,
//       name:"Python",
//       mode:"python"
//   },
//   {
//       code:56,
//       name:"Javascript",
//       mode:"Javascript"
//   },
//   {
//       code:10,
//       name:"Java",
//       mode:"text/x-c++src"
//   }
// ]

// var themeCode = ['xq-light','dracula']

// // data: {
// //     sourceCode,
// //     language,
// //     problemCode,
// //     contestCode,
// //     input
// // },

// const saveCode = (problemCode, code, language) => {
//   localStorage.setItem(`${problemCode}_${language}`, code);
// }

// const getCode = (problemCode, language) => {
//   let code = localStorage.getItem(`${problemCode}_${language}`)
//   return code?code:"";
// }

// const saveLanguagePref = (language) => {
//   localStorage.setItem('language', languageCode[language]);
//   selectedLanguage = languageCode[language];
//   editor.setOption("mode",selectedLanguage.mode);
// }
// const getLanguagePref = () => { 
//   let pref = localStorage.getItem('language');
//   return pref?pref:languageCode[0];
// }

// const saveThemePref = (theme) => {
//   localStorage.setItem('theme', theme);
//   selectedTheme = theme;
//   editor.setOption("theme", themeCode[selectedTheme]);
// }
// const getThemePref = () => {
//   let pref = localStorage.getItem('theme');
//   return pref?pref:1;
// }


// var isCustomInput = false;
// var input = "";
// var isLoading = false;
// var selectedLanguage = getLanguagePref();
// var selectedTheme = getThemePref();
// var problemCode = ""
// var contestCode = "";
// var code = getCode(problemCode,selectedLanguage);

// var editor = CodeMirror(document.getElementById("sadh"), {
//   value: "",
//   lineNumbers: true,
//   mode: selectedLanguage.mode,
//   autoCloseBrackets: true,
//   matchBrackets: true,
//   showCursorWhenSelecting: true,
//   theme: themeCode[selectedTheme],
//   tabSize: 2
// });



// $('#theme_select').on('change', function() {
//   saveThemePref(this.value);
// });

// $('#language_select').on('change', function() {
//   saveLanguagePref(this.value);
// });


var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('ide.html');

    // Some styles for a fancy sidebar
    iframe.style.cssText = 'display:block;' +
                           'width:100%;height:100%;';
    document.body.appendChild(iframe);
}
document.body.appendChild(document.createElement('script').text = 'var sarthakSadh = 100' );
// alert(window.csrfToken)
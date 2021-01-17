var script = `$('body').attr("csrf",window.csrfToken);`;
var elt = document.createElement('script');
elt.innerHTML = script;
document.body.appendChild(elt);
var token = $('body').attr('csrf');
console.log(token);
$('body').removeAttr('csrf');

var documentPath;
var problemCode;
var contestCode;

const postRequest = (url, data) => {
    return new Promise((resolve, reject) => {
        $.ajax(
            {
                registerError: false,
                dataType: 'JSON',
                url,
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                data,
                success: function (e) {
                    console.log(e);
                    resolve(e);
                },
                error: function (e) {
                    reject(e);
                },
            },
            false,
            false,
        );
    });
};
const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        $.ajax(
            {
                registerError: false,
                dataType: 'JSON',
                url,
                type: 'GET',
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                success: function (e) {
                    console.log(e);
                    resolve(e);
                },
                error: function (e) {
                    reject(e);
                },
            },
            false,
            false,
        );
    });
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const getCodeRunStatus = async (timestamp, sendResponse, count = 0) => {
    const url = `https://www.codechef.com/api/ide/run/${problemCode}?timestamp=${timestamp}`;
    console.log(url);
    let res = await getRequest(url);
    while (!res.status.toLowerCase().includes('ok') && count < 20) {
        await sleep(2000);
        res = await getRequest(url);
        count += 1;
    }
    sendResponse(res);
}
const getCodeSubmitStatus = async (solId, sendResponse) => {
    const url = `https://www.codechef.com/api/ide/submit?solution_id=${solId}`;
    let res = await getRequest(url);
    while (res.result_code.toLowerCase().includes('wait')) {
        await sleep(2000);
        res = await getRequest(url);
    }
    let status = res;
    res = await new Promise((resolve, reject) => {
        $.ajax(
            {
                url: `https://www.codechef.com/error_status_table/${solId}`,
                type: 'GET',
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                success: function (e) {
                    console.log(e);
                    resolve(e);
                },
                error: function (e) {
                    reject(e);
                },
            },
            false,
            false,
        );
    });

    sendResponse({
        status: status,
        table: res,
    });
}

var iframe;
let inserted = document.createElement('p');
inserted.id = 'code-editor-inserted';
inserted.hidden = true;

const insertIframe = () => {
    documentPath = document.URL.replace(/\/+$/, '').split('/');
    problemCode = documentPath[documentPath.length - 1];
    iframe = document.createElement('iframe');
    iframe.scrolling = 'no';
    iframe.src = chrome.runtime.getURL('./src/ide.html');
    iframe.style.cssText = 'display:block;' + 'width:100%;border:0;';

    let x = document.querySelector('#problem-comments > div > div');
    console.log(document.getElementById('problem-comments'));
    x.prepend(iframe);
    document.querySelector('#problem-statement > div').hidden = true;
    if (documentPath.length == 5) contestCode = 'PRACTICE';
    else {
        let buttonText = $('.button.blue.right')[0].text;
        if (buttonText.toLowerCase().includes('practice')) contestCode = 'PRACTICE';
        else contestCode = documentPath[documentPath.length - 3];
        console.log(contestCode);
        console.log(buttonText);
    }
    resizeIframe(iframe, 1000);
};
const waitForEl = function (selector, callback) {
    let x = document.querySelector(selector);
    if (x) {
        callback();
    } else {
        setTimeout(() => {
            waitForEl(selector, callback);
        }, 500);
    }
};

const resizeIframe = (iframe, len) => {
    iframe.height = len + 'px';
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const type = request.type;
    delete request.type;
    if (type == 'run') {
        let url = '/api/ide/run/';
        url += problemCode;
        postRequest(url, request)
            .then((res) => {
                getCodeRunStatus(res.timestamp, sendResponse);
            })
            .catch((err) => {
                console.log(err);
                sendResponse({ output: JSON.stringify(err) });
            });
    } else if (type == 'check') {
        sendResponse({ status: 'ok' });
    } else if (type == 'submit') {
        delete request.input;
        console.log('submit');
        request.problemCode = problemCode;
        request.contestCode = contestCode;
        let url = '/api/ide/submit';
        postRequest(url, request).then((res) => {
            if (res.status == 'OK') getCodeSubmitStatus(res.upid, sendResponse);
            else if (res.status == 'error') {
                sendResponse(res);
            }
        });
        console.log(request);
    } else if (type == 'resize') {
        console.log(request);
        resizeIframe(iframe, request.len);
        sendResponse({ status: 'OK' });
    } else if (type == 'getPref') {
        let lang = localStorage.getItem('language');
        let langName = lang ? JSON.parse(lang).name : '';
        sendResponse({
            theme: localStorage.getItem('theme'),
            language: lang,
            code: lang ? localStorage.getItem(`${problemCode}_${langName}`) : '',
        });
    } else if (type == 'setPref') {
        localStorage.setItem(request.change, request.value);
        sendResponse(true);
    } else if (type == 'saveCode') {
        localStorage.setItem(`${problemCode}_${request.language}`, request.code);
        sendResponse(true);
    } else if (type == 'getCode') {
        sendResponse({
            code: localStorage.getItem(`${problemCode}_${request.language}`),
        });
    }
    return true;
});
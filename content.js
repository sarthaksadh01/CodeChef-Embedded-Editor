var script = `$('body').attr("csrf",window.csrfToken);`;
var elt = document.createElement("script");
elt.innerHTML = script
document.body.appendChild(elt);
var token = $("body").attr("csrf");
console.log(token);

const postRequest = (url, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            registerError: false,
            dataType: 'JSON',
            url,
            type: 'POST',
            headers: {
                "X-CSRF-TOKEN": token
            },
            data,
            success: function (e) {
                console.log(e);
                resolve(e);
            },
            error: function (e) {
                reject(e);
            }
        }, false, false);
    })

}
const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            registerError: false,
            dataType: 'JSON',
            url,
            type: 'GET',
            headers: {
                "X-CSRF-TOKEN": token
            },
            success: function (e) {
                console.log(e);
                resolve(e);
            },
            error: function (e) {
                reject(e);
            }
        }, false, false);
    })

}
async function getCodeRunStatus(timestamp, sendResponse,count = 0) {
    const url = `https://www.codechef.com/api/ide/run/all?timestamp=${timestamp}`;
    const res = await getRequest(url)
    if (!res.status.toLowerCase().includes("ok") && count <20) {
        setTimeout(function () { getCodeRunStatus(timestamp, sendResponse,count+1) }, 2000);
    }
    else sendResponse({
        output: res.output
    })

}

var iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('ide.html');
iframe.style.cssText = 'display:block;' +
    'width:100%;height:1000px;border:0;';
// console.log(document);
// sometimes document ain't loaded correctly, hence, a timeout
setTimeout(() => {
    let x = document.querySelector("#problem-comments > div > div")
    console.log(document.getElementById("problem-comments"));
    x.prepend(iframe);
}, 1000);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        postRequest("/api/ide/run/all", request).then((res) => {
            getCodeRunStatus(res.timestamp, sendResponse);
        }).catch((err) => {
            console.log(err);
            sendResponse({ output: JSON.stringify(err) });

        })
        return true;
})


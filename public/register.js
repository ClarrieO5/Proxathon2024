"use strict";
const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");

function search(input, template) {
    try {
        return new URL(input).toString();
    } catch (err) {
    }
    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString();
    } catch (err) {
    }
    return template.replace("%s", encodeURIComponent(input));
}

async function registerSW(stockSW) {
    await navigator.serviceWorker.register(stockSW);
    let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        await registerSW("/uv/sw.js");
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    const url = search(address.value, "https://google.com/search?q=%s");

    const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
    location.href = encodedUrl;
});
<form id="uv-form" class="flex-center">
      <input id="uv-address" type="text" placeholder="Search the web freely" />
    </form>
    <div class="desc left-margin">
      <p id="uv-error"></p>
      <pre id="uv-error-code"></pre>
    </div>

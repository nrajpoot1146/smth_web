function format(str, ...args) {
    return str.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
}

const deviceId = "smth_web";

var Com = function () {
    const setPathFormat = "/datastream/set/?{0}={1}"; //{0} : PIN, {1} : value
    const getPathFormat = "/datastream/get/{0}/"; //{0} PIN

    this.set = async function (pin, value, callback = null) {
        var setPath = format(setPathFormat, pin, value);
        fetch(setPath, { cache: "no-store", keepalive: true })
            .then(r => r.json())
            .then(d => { if (callback != null) callback(d) });
    }

    // get data from server
    this.get = async function (pin, callback = null) {
        var getPath = format(getPathFormat, pin);
        fetch(getPath, { cache: "no-store", keepalive: true })
            .then(r => r.json())
            .then(d => {
                if (callback != null) {
                    callback(d);
                }
            }
            );
    }
}

const com = new Com();

// com.get("V0", d => { console.log(d); });
// com.get("V1", d => { console.log(d); });
// com.get("V3", d => { console.log(d); });

function aqiColor(aqi) {
    if (aqi <= 50) return "#22c55e";
    if (aqi <= 100) return "#84cc16";
    if (aqi <= 200) return "#facc15";
    if (aqi <= 300) return "#f97316";
    return "#ef4444";
}

function updateGauge(id, valueId, value, max, unit, color = null) {
    const gauge = document.getElementById(id);
    const percent = Math.min((value / max) * 100, 100);
    const prev = parseFloat(getComputedStyle(gauge).getPropertyValue("--value")) || 0;

    const start = performance.now();
    const duration = 500;

    function animate(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = p * (2 - p);
        const current = prev + (percent - prev) * eased;

        gauge.style.setProperty("--value", current);
        if (p < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    if (color) gauge.style.setProperty("--color", color);
    document.getElementById(valueId).innerText = value + unit;

    gauge.classList.add("updated");
    setTimeout(() => gauge.classList.remove("updated"), 200);
}

// ---------- Toggle Button ----------
let v0State = false;
let targetDevice_id = "smth_esp";
async function toggleV0() {
    const btn = document.getElementById("v0ToggleBtn");
    const status = document.getElementById("setStatus");

    v0State = !v0State;
    const value = v0State ? 1 : 0;

    try {
        await fetch(`/datastream/${targetDevice_id}/onButtonPressed/?pin=V2&value=${Number(v0State)}`, { cache: "no-store", keepalive: true });

        btn.innerText = v0State ? "V0 ON" : "V0 OFF";
        btn.style.background = v0State ? "#22c55e" : "#ef4444";
        status.innerText = `V0 turned ${v0State ? "ON" : "OFF"}`;
        status.style.color = v0State ? "#22c55e" : "#ef4444";

    } catch {
        status.innerText = "Failed to update V0";
        status.style.color = "#facc15";
        v0State = !v0State;
    }
}

// ---------- Polling ----------
function fetchData(pin) {
    fetch('/datastream/get/' + pin + '/', { cache: "no-store", keepalive: true })
        .then(r => r.json())
        .then(d => {
            //console.log(d);
            if (d.stream_key === "V0" && d.isUpdated === 1) {
                updateGauge("tempGauge", "tempValue", d.value, 50, "°C");
            }
            else if (d.stream_key === "V1" && d.isUpdated === 1) {
                updateGauge("humGauge", "humValue", d.value, 100, "%");
            }
            else if (d.stream_key === "V3" && d.isUpdated === 1) {
                updateGauge("aqiGauge", "aqiValue", d.value, 800, "", aqiColor(d.value));
            }
            setTimeout(fetchData, 10, pin);
        })
        .catch(() => setTimeout(fetchData, 10, pin));
}

fetchData("V0");
fetchData("V1");
fetchData("V3");

(async function () {
    const btn = document.getElementById("v0ToggleBtn");
    const status = document.getElementById("setStatus");
    // Code inside this function runs immediately
    const response = await fetch('/datastream/get/V2/', { cache: "no-store", keepalive: true });
    const data = await response.json();
    if (parseInt(data.value) == 1) {
        btn.innerText = "V0 ON";
        btn.style.background = "#22c55e";
        status.innerText = "V0 turned ON";
        status.style.color = "#22c55e";
        v0State = true;
    } else {
        btn.innerText = "V0 OFF";
        btn.style.background = "#ef4444";
        status.innerText = "V0 turned OFF";
        status.style.color = "#ef4444";
        v0State = false;
    }
})();

var prefix = "ws://";
if(window.location.protocol === 'https:')
{
    prefix = "wss://";
}

// const wsUrl = `${prefix}${window.location.hostname}:${window.location.port}/ws/device/${deviceId}/`;

// let socket = new WebSocket(wsUrl);

// socket.onopen = () => {
//     // setInterval(function(){socket.send("ping");}, 1000);
//     console.log("WebSocket connected");
//     document.getElementById("status").innerText = "Connected";
// };

// socket.onmessage = (event) => {
//     console.log("Message received:", event.data);

//     const data = JSON.parse(event.data);
//     if (d.stream_key === "V0") {
//         updateGauge("tempGauge", "tempValue", d.value, 50, "°C");
//     }
//     else if (d.stream_key === "V1") {
//         updateGauge("humGauge", "humValue", d.value, 100, "%");
//     }
//     else if (d.stream_key === "V3") {
//         updateGauge("aqiGauge", "aqiValue", d.value, 800, "", aqiColor(d.value));
//     }
//     // Equivalent to BLYNK_WRITE(Vx)
//     if (data.pin === "V1" && data.value === 1) {
//         console.log("Button pressed event received");
//     }
// };

// socket.onclose = () => {
//     console.log("WebSocket disconnected");
//     document.getElementById("status").innerText = "Disconnected";
// };

// socket.onerror = (error) => {
//     console.error("WebSocket error:", error);
// };
/* TFLStatus
 * A static web page that uses the TFL API to display the status of the London Underground lines.
 * GitHub: https://www.github.com/0x4248/TFLStatus
 * Licence: GNU General Public Licence v3.0
 * By: 0x4248
 */

let usedCache = false;

function fetchStatus(){
    if (cacheExpired('statusData') == false) {
        usedCache = true;
        return fetchCache('statusData');
    }

    return fetch('https://api.tfl.gov.uk/line/mode/tube,overground,dlr,national-rail,elizabeth-line/status')
        .then(response => response.json())
        .then(response => {
            registerCache('statusData', JSON.stringify(response), true);
            return response;
        });
}

fetchStatus()
    .then(data => addData(data))
    .catch(error => console.error('Error fetching data:', error));


function SortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.querySelector('table');
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[1];
            y = rows[i + 1].getElementsByTagName('td')[1];
            if (x.innerHTML < y.innerHTML) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function ShowCacheWarning() {
    if (usedCache) {
        document.getElementById('status').innerHTML = 'This status was cached ' + Math.floor((new Date().getTime() - parseInt(localStorage.getItem('statusData_timestamp'))) / 60000) + ' minutes and ' + Math.floor((new Date().getTime() - parseInt(localStorage.getItem('statusData_timestamp'))) / 1000) % 60 + ' seconds ago <button onclick="clearCache(\'statusData\'); location.reload();">Clear Cache</button>';
    }
}

function addData(data){
    data.forEach(line => {
        const row = document.createElement('tr');
        const name = document.createElement('td');
        name.textContent = line.name;
        const status = document.createElement('td');
        if (line.lineStatuses.length > 1) {
            line.lineStatuses.forEach(statuses => {
                status.textContent += statuses.statusSeverityDescription + ' ';
            });
        } else {
            const statusText = document.createElement('a');
            statusText.textContent = line.lineStatuses[0].statusSeverityDescription;
            statusText.href = '#';
            statusText.onclick = function() {
                if (line.lineStatuses[0].reason == undefined) {
                    alert('No reason or good service on line');
                } else {
                    let reasons = '';
                    line.lineStatuses.forEach(statuses => {
                        reasons += statuses.reason + '\n';
                    });
                    alert(reasons);
                }
            };
            status.appendChild(statusText);
        }
        row.appendChild(name);
        row.classList.add(line.id);
        row.appendChild(status);
        document.getElementById('lines').appendChild(row);
    });
    SortTable();
    ShowCacheWarning();
}

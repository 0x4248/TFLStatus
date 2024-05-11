/* TFLStatus
 * A static web page that uses the TFL API to display the status of the London Underground lines.
 * GitHub: https://www.github.com/0x4248/TFLStatus
 * Licence: GNU General Public Licence v3.0
 * By: 0x4248
 */

function registerCache(id, content, overwrite=false) {
    let didOverwrite = false;
    if (overwrite == false) {
        if (localStorage.getItem(id + '_content') !== null || localStorage.getItem(id + '_timestamp') !== null) {
            console.error('Cache already exists for ' + id);
            return;
        }
    } else {
        if (localStorage.getItem(id + '_content') !== null) {
            localStorage.removeItem(id + '_content');
            didOverwrite = true;
        }
        if (localStorage.getItem(id + '_timestamp') !== null) {
            localStorage.removeItem(id + '_timestamp');
            didOverwrite = true;
        }
    }
    if (didOverwrite) {
        console.warn('Cache was overwritten for ' + id);
    }
    localStorage.setItem(id + '_content', content);
    localStorage.setItem(id + '_timestamp', new Date().getTime());
}

function fetchCache(id, customExpirationTime=5*60*1000) {
    const cachedData = localStorage.getItem(id + '_content');
    const cachedTime = localStorage.getItem(id + '_timestamp');
    if (cachedData && cachedTime) {
        const currentTime = new Date().getTime();
        const expirationTime = parseInt(cachedTime) + customExpirationTime;
        if (currentTime < expirationTime) {
            return Promise.resolve(JSON.parse(cachedData));
        }
    }
    console.error('Cache not found or expired for ' + id);
    return null;
}

function clearCache(id) {
    localStorage.removeItem(id + '_content');
    localStorage.removeItem(id + '_timestamp');
}

function cacheExpired(id, customExpirationTime=5*60*1000) {
    const cachedData = localStorage.getItem(id + '_content');
    const cachedTime = localStorage.getItem(id + '_timestamp');
    if (cachedData && cachedTime) {
        const currentTime = new Date().getTime();
        const expirationTime = parseInt(cachedTime) + customExpirationTime;
        if (currentTime < expirationTime) {
            return false;
        }
    }
    return true;
}

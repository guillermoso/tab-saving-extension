let saveTabs_btn = document.getElementById('btn-saveTabs');
saveTabs_btn.onclick = getActiveTabs;


/**
 * Prepares an array of active links and sends it to saveActiveTabs
 */
function getActiveTabs() {
    chrome.tabs.query({
        currentWindow: true
    }, (tabs) => {
        let tabsURLs = [];

        tabs.forEach(tab => {
            tabsURLs.push(tab.url);
        });

        saveActiveTabs(tabsURLs);
    });
}

/**
 * Saves an array of links to Local storage
 * @param {array} tabsURLs
 */
function saveActiveTabs(tabsURLs) {
    console.log(tabsURLs)
    const storage = chrome.storage.sync;
    //TODO: use local storage API to save tabs
    //https://developer.chrome.com/apps/storage

    storage.get(['sessions'], function (sessions) {
        console.log(sessions);

        if (Object.entries(sessions).length === 0 && sessions.constructor === Object) {

            sessions.sessions.push(getSessionData(tabsURLs));

            storage.remove('sessions', () => {
                storage.set(sessions, () => {
                    console.log('saved');
                });
            });
            // tabs object exists on localStorage


        } else {
            // tabs object didn't exist on localStorage
            let newSessionsArray = [];
            newSessionsArray.push(getSessionData());

            let sessionsObj = {
                sessions: newSessionsArray
            }
            storage.set(sessionsObj, () => {
                console.log('saved');
            });
        }
    });

}

/**
 * Return the current session object
 * @param {array} tabs
 * Current active tabs  
 */
function getSessionData(tabs) {
    return {
        timeStamp: getMoment(),
        tabs: tabs,
        name: ''
    }
}

/**
 * @returns this moments date. (yyyy-mm-dd hh:mm:ss)
 */
function getMoment() {
    let moment = new Date();

    const dd = moment.getDate();
    const mm = moment.getMonth() + 1;
    const yyyy = moment.getFullYear();

    const hh = moment.getHours();
    const min = moment.getMinutes();
    const ss = moment.getSeconds();

    moment = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`

    return moment;
}
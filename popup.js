let saveTabs_btn = document.getElementById('btn-saveTabs')
saveTabs_btn.onclick = getActiveTabs

let clearLS_btn = document.getElementById('btn-clearLS')
clearLS_btn.onclick = clearLS

/**
 * Prepares an array of active links and sends it to saveActiveTabs
 */
function getActiveTabs() {
    chrome.tabs.query({
        currentWindow: true
    }, (tabs) => {
        let tabsURLs = []

        tabs.forEach(tab => {
            tabsURLs.push(tab.url)
        })

        saveActiveTabs(tabsURLs)
    })
}

/**
 * Saves an array of links to Local storage
 * @param {array} tabsURLs
 */
function saveActiveTabs(tabsURLs) {
    const storage = chrome.storage.sync
    //TODO: use local storage API to save tabs
    //https://developer.chrome.com/apps/storage

    storage.get(['sessions'], (sessionsLS) => {
        console.log(sessionsLS)
        
        if (Object.entries(sessionsLS).length === 0 && sessionsLS.constructor === Object) {
            const newSessionsObj = {
                sessions: []
            }
            newSessionsObj.sessions.push(getSessionData(tabsURLs))
            try {
                storage.set(newSessionsObj, () => {
                    console.log('saved')
                })
            } catch (error) {
                console.log(error.message)
            }

        } else {
            
        }
    })

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
    let moment = new Date()

    const dd = moment.getDate()
    const mm = moment.getMonth() + 1
    const yyyy = moment.getFullYear()

    const hh = moment.getHours()
    const min = moment.getMinutes()
    const ss = moment.getSeconds()

    moment = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`

    return moment
}

function clearLS() {
    chrome.storage.sync.clear(() => {
        console.log("cleared")
    })
}
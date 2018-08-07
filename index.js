module.exports = function TimeStamps(dispatch){
    const blocked = new Set()

    dispatch.hook('S_ADD_BLOCKED_USER', 2, block)
    dispatch.hook('S_USER_BLOCK_LIST', 2, (event) => {
        event.blockList.forEach(block)
    })
    dispatch.hook('C_REMOVE_BLOCKED_USER', 1, (event) => {
        blocked.delete(event.name)
    })
    dispatch.hook('S_LOGIN', 10, (event) => {
        blocked.clear()
    })
    function block(user){
        blocked.add(user.name)
    }
    function processChatEvent(event){
        if(event.channel === 26) return
        if(blocked.has(event.authorName)) return false
        let now = new Date();
        // let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // let month = monthNames[now.getMonth()];
        // let day = now.getDate().toString();
        // let year = now.getFullYear().toString().substr(2);
        let time =  now.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        let timeStr = time;
        event.authorName = `</a>${timeStr}][<a href='asfunction:chatNameAction,${event.authorName}@0@0'>${event.authorName}</a>`
        return true
    }

    function processWhisperEvent(event){
        if(event.channel === 26) return
        if(blocked.has(event.authorName)) return false
        let now = new Date();
        // let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // let month = monthNames[now.getMonth()];
        // let day = now.getDate().toString();
        // let year = now.getFullYear().toString().substr(2);
        let time =  now.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        let timeStr = time;
        event.message = '['+timeStr+'] : '+ event.message;
        return true
    }

    dispatch.hook('S_CHAT', 2, processChatEvent);
    dispatch.hook('S_WHISPER', 2, processWhisperEvent);
    dispatch.hook('S_PRIVATE_CHAT', 1, processChatEvent);
}

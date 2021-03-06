// const AWN = require('awesome-notifications');


const createNotification = (type, message, l, dur = 2000) =>{
    const options = {
        position: "top-right",
        durations: {global:dur},
        enabled: true,
        labels:{
            info: l,
            tip: l,
            success: l,
            warning: l,
            alert: l
        }
    };

    var awn = new AWN(options);

    switch (type) {
        case 'tip':
            awn.tip(message);
            break;
        case 'info':
            awn.info(message);
            break;
        case 'success':
            awn.success(message); // awn.success(message, {}); to override use this
            break;
        case 'warning':
            awn.warning(message);
            break;
        case 'alert':
            awn.alert(message);
            break;
    }
}
const testNotifcation = () => {
    var notifier = new AWN();
    notifier.tip('Message here');

}

module.exports = {
    createNotification
}
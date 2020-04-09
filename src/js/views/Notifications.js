import AWN from "awesome-notifications";

export const createNotification = (type, message, l) =>{
    const options = {
        position: "top-right",
        durations: {global:2000},
        enabled: true,
        labels:{
            info: l,
            tip: l,
            success: l,
            warning: l,
            alert: l
        }
    };

    const awn = new AWN(options);

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
};
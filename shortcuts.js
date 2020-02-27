module.exports = {
    time_now() {
        let d = new Date();
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    }
};
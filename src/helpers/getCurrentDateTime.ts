export const getCurrentDateTime = () => {
    const currentTime = Date.now()
    const dateTimeFormat1 = new Intl.DateTimeFormat("en-GB", {
        timeZone: 'Europe/Madrid', weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    return dateTimeFormat1.format(currentTime)
}
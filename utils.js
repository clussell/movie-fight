const debounce = (func, delay = 1000) => {
    let timeoutId;
    // wrapper guards how often func can be invoked
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};
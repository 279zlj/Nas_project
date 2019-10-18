var change = function(size) {
    if (size === 0) return '0 KB';
    else {
        var k = 1024, // or 1024
            sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(size) / Math.log(k));
        // console.log(size)
        return (size / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i - 1];
    }
}

export {
    change
}
const randomString = (length: number, chars: string): string => {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz0123456789';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}

const capitalizeLetters = (str: string): string => {
    if (!str) {
        return "";
    }

    const arr = str.split(" ");

    //loop through each element of the array and capitalize the first letter.
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    //Join all the elements of the array back into a string 
    //using a blankspace as a separator 
    return arr.join(" ");
};

export {
    randomString,
    capitalizeLetters
}

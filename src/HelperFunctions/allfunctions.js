
export function replaceit(str, find, replace) {
    if (str) {
        let parts = str.split(find);
        console.log(parts);
        const result = [];
        for (let i = 0; i < parts.length; i++) {
            result.push(parts[i]);
            result.push(replace);
        }
        result.pop(replace);
        result = result + '';
        return (result);
    }

}


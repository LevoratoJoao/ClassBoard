export const getArgs = (argNames, params) => {
    return argNames.map((name) => params[name]);
}
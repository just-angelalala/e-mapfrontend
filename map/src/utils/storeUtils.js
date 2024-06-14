/**
 * Appends the module name and endpoint to the Axios instance's base URL.
 * 
 * @param {string} moduleName - The name of the module.
 * @param {string} endpoint - The specific endpoint within that module.
 * @return {string} The full URL for the API call.
 */
export function getFullApiUrl(moduleName, endpoint) {
    return `/${moduleName}/${endpoint}`;
}
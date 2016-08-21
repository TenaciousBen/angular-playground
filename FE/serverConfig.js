exports.frontendConfig = {
    protocol: "http",
    domain: "localhost.com",
    port: 8000,
    baseUrl: () => exports.frontendConfig.protocol + "://" + exports.frontendConfig.domain + ":" + exports.frontendConfig.port
};

exports.backendConfig = {
    protocol: "http",
    domain: "localhost",
    port: 12345,
    baseUrl: () => exports.backendConfig.protocol + "://" + exports.backendConfig.domain + ":" + exports.backendConfig.port
};

//this will be shared across node and ng, so module won't exist on ng
if (typeof module !== "undefined") {
    module.exports = {
        frontendConfig: exports.frontendConfig,
        backendConfig: exports.backendConfig
    };
}
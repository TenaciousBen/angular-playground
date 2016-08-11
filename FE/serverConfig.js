var frontendConfig = {
    protocol: "http",
    domain: "localhost",
    port: 8000,
    baseUrl: () => frontendConfig.protocol + "://" + frontendConfig.domain + ":" + frontendConfig.port
};

var backendConfig = {
    protocol: "http",
    domain: "localhost",
    port: 12345,
    baseUrl: () => backendConfig.protocol + "://" + backendConfig.domain + ":" + backendConfig.port
};

//this will be shared across node and ng, so module won't exist on ng
if (typeof module !== "undefined") {
    module.exports = {
        frontendConfig: frontendConfig,
        backendConfig: backendConfig
    };
}
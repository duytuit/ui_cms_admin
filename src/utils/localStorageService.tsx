const LocalStorageService = (function() {

    function _setToken(access_token:string) {
        localStorage.setItem('access_token', access_token);
    }

    function _getAccessToken() {
        return localStorage.getItem('access_token');
    }

    function _getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    function _clearToken() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    return {
        setToken: _setToken,
        getAccessToken: _getAccessToken,
        getRefreshToken: _getRefreshToken,
        clearToken: _clearToken
    }
})();

export default LocalStorageService;


// Save in .env
var APP_KEY = 's/Z9spBf7lAKu86H0B5UlWX1biYf9KEa7NBcr4IiHnU=';

// decrypt
var decrypt = function (encrypted, key) {

    encrypted = atob(encrypted);
    encrypted = JSON.parse(encrypted);

    const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
    const value = encrypted.value;

    key = CryptoJS.enc.Base64.parse(key);

    // Decrypt the value, providing the IV. 
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        iv: iv
    });
    var result = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return result;

}

//encrypt
encrypt = function (data, key) {

    let iv = CryptoJS.lib.WordArray.random(16);
    key = CryptoJS.enc.Base64.parse(key);
    let options = {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };
    let encrypted = CryptoJS.AES.encrypt(data, key, options);
    encrypted = encrypted.toString();
    iv = CryptoJS.enc.Base64.stringify(iv);
    let result = {
        iv: iv,
        value: encrypted,
        mac: CryptoJS.HmacSHA256(iv + encrypted, key).toString()
    }
    result = JSON.stringify(result);
    result = CryptoJS.enc.Utf8.parse(result);
    return CryptoJS.enc.Base64.stringify(result);
};

//decrypt example :
axios.get("http://127.0.0.1:8000/api/projects/bitcoin")
    .then(function (response) {
        var encrypted = response.data.project;
        var data = decrypt(encrypted, APP_KEY);
        console.log(data);
    })
//encrypt example:
var wallet_address = "addressdfg21hgf12hg";
var _token = encrypt(wallet_address, APP_KEY);

console.log("_token:", _token);
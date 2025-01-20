#include"password_handler.h"
std::string hash_password(const std::string& password) {
    // 盐的长度
    unsigned char salt[crypto_pwhash_SALTBYTES];
    randombytes_buf(salt, sizeof salt);

    // 输出哈希的存储空间
    unsigned char hashed_password[crypto_pwhash_STRBYTES];

    // 使用 Argon2 哈希密码
    if (crypto_pwhash_str((char*)hashed_password, password.c_str(), password.size(),
                          crypto_pwhash_OPSLIMIT_INTERACTIVE,
                          crypto_pwhash_MEMLIMIT_INTERACTIVE) != 0) {
        throw std::runtime_error("Hashing failed");
    }

    return std::string((char*)hashed_password);
}

bool verify_password(const std::string& password, const std::string& stored_hash) {
    return crypto_pwhash_str_verify(stored_hash.c_str(), password.c_str(), password.size()) == 0;
}
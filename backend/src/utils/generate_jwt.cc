#include"generate_jwt.h"
std::string generate_jwt(std::string username)
{
std::string secret = "young";
    
    // 创建 JWT
    auto token = jwt::create()
                    .set_issuer("young")
                    .set_payload_claim("user", jwt::claim(username))
                    .set_expires_at(std::chrono::system_clock::now() + std::chrono::hours(1))
                    .sign(jwt::algorithm::hs256{secret});
                    return token;
}
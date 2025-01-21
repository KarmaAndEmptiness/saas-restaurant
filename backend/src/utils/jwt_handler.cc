#include "jwt_handler.h"
std::string generate_jwt(std::string &userId, std::string &username)
{
  std::string secret = "young";

  // 创建 JWT
  auto token = jwt::create()
                   .set_issuer("young")
                   .set_payload_claim("userId", jwt::claim(userId))
                   .set_payload_claim("username", jwt::claim(username))
                   .set_expires_at(std::chrono::system_clock::now() + std::chrono::hours(1))
                   .sign(jwt::algorithm::hs256{secret});

  return token;
}

// 解码 JWT
nlohmann::json decode_jwt(std::string &token)
{

  std::string secret = "young"; // 解码时需要使用相同的 secret
  // 解析 Payload 为 JSON
  auto decoded = jwt::decode(token);

  // 验证签名
  auto verifier = jwt::verify()
                      .allow_algorithm(jwt::algorithm::hs256{secret}) // 允许 HS256 算法
                      .with_issuer("young");

  // 验证 JWT
  verifier.verify(decoded);

  nlohmann::json payload;
  payload["userId"] = decoded.get_payload_claim("userId").as_string();
  payload["username"] = decoded.get_payload_claim("username").as_string();
  return payload; // 返回解码后的用户名
}

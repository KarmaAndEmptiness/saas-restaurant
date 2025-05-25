#include <drogon/drogon.h>
#include "filters/CorsFilter.h"
int main()
{
	// Load config file
	drogon::app().loadConfigFile("../config.json");

	// Run HTTP framework,the method will block in the internal event loop
	drogon::app()
			// 跨域处理
			.registerSyncAdvice([](const drogon::HttpRequestPtr &req) -> drogon::HttpResponsePtr
													{
			if(req->method() == drogon::HttpMethod::Options)
			{
				auto resp = drogon::HttpResponse::newHttpResponse();
				{
					resp->addHeader("Access-Control-Allow-Origin", "http://homeless.run.place:5173");
				}
				{
					const auto& val = req->getHeader("Access-Control-Request-Method");
					if(!val.empty())
						resp->addHeader("Access-Control-Allow-Methods", val);
				}
				resp->addHeader("Access-Control-Allow-Credentials", "true");
				{
					const auto& val = req->getHeader("Access-Control-Request-Headers");
					if(!val.empty())
						resp->addHeader("Access-Control-Allow-Headers", val);
				}
				return std::move(resp);
			}
			return {}; })
			.registerPostHandlingAdvice([](const drogon::HttpRequestPtr &req, const drogon::HttpResponsePtr &resp) -> void
																	{
			{
				const auto& val = req->getHeader("Origin");
				if(!val.empty())
					resp->addHeader("Access-Control-Allow-Origin", val);
			}
			{
				const auto& val = req->getHeader("Access-Control-Request-Method");
				if(!val.empty())
					resp->addHeader("Access-Control-Allow-Methods", val);
			}
			resp->addHeader("Access-Control-Allow-Credentials", "true");
			{
				const auto& val = req->getHeader("Access-Control-Request-Headers");
				if(!val.empty())
					resp->addHeader("Access-Control-Allow-Headers", val);
			} })
			.run();
	return 0;
}

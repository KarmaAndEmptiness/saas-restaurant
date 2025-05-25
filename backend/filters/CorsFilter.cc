/**
 *
 *  CorsFilter.cc
 *
 */

#include "CorsFilter.h"

using namespace drogon;

void CorsFilter::doFilter(const HttpRequestPtr &req,
                          FilterCallback &&fcb,
                          FilterChainCallback &&fccb)
{
    auto resp = HttpResponse::newHttpResponse();

    // Add CORS headers
    resp->addHeader("Access-Control-Allow-Origin", "http://homeless.run.place:5173"); // Your frontend URL
    resp->addHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    resp->addHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    resp->addHeader("Access-Control-Allow-Credentials", "true");
    resp->addHeader("Access-Control-Max-Age", "86400"); // Cache preflight for 24 hours

    // Handle OPTIONS preflight request
    if (req->getMethod() == HttpMethod::Options)
    {
        resp->setStatusCode(k200OK);
        fcb(resp); // Return response immediately for OPTIONS
        return;
    }

    // Continue to the next handler for other methods
    fccb();
}

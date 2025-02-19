#ifndef MIDDLEWARE_MIDDLEWARE_H_
#define MIDDLEWARE_MIDDLEWARE_H_

#include "httplib.h"
#include <functional>

namespace middleware
{
    using NextHandler = std::function<void()>;
    using MiddlewareHandler = std::function<void(const httplib::Request &, httplib::Response &, NextHandler)>;

    class Middleware
    {
    public:
        virtual ~Middleware() = default;
        virtual void Handle(const httplib::Request &req, httplib::Response &res, NextHandler next) = 0;
    };

} // namespace middleware

#endif // MIDDLEWARE_MIDDLEWARE_H_
#include "server/http_server.h"
#include <iostream>

int main()
{
    try
    {
        // 检查配置文件是否存在且格式正确
        // 例如：
        // if (!std::ifstream("config.json")) {
        //     std::cerr << "配置文件不存在" << std::endl;
        //     return 1;
        // }
        // server::HttpServer server("config.json");
        server::HttpServer server;
        server.Start(8080);

        std::cout << "Press ENTER to exit." << std::endl;
        std::string line;
        std::getline(std::cin, line);

        server.Stop();
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
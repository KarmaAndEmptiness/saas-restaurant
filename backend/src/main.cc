#include "server/http_server.h"
#include <iostream>

int main()
{
    try
    {
        server::HttpServer server;

        server.Start(3000);

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
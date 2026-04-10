#include <exception>
#include <iostream>

#include "server.h"

int main()
{
    try
    {
        return hellotime::drogon_backend::runServer(
            hellotime::drogon_backend::AppConfig::fromEnv());
    }
    catch (const std::exception &exception)
    {
        std::cerr << exception.what() << '\n';
        return 1;
    }
}

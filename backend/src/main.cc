#include"server.h"
#include<iostream>
int main()
{
    httplib::Server svr;
    MySQLConnector conn("unix:///var/run/mysqld/mysqld.sock","root","","restaurant");
   setRoutes(svr,conn); 

std::cout<<"Listening on http://0.0.0.0:8085"<<std::endl;
    svr.listen("0.0.0.0", 8085);
    return 0;
}
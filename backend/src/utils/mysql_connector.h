#ifndef MYSQL_CONNECTOR_H
#define MYSQL_CONNECTOR_H
#include<mysql_driver.h>
#include<mysql_connection.h>
#include<cppconn/driver.h>
#include<cppconn/exception.h>
#include<cppconn/resultset.h>
#include<cppconn/statement.h>
#include<cppconn/prepared_statement.h>
#include<cppconn/resultset_metadata.h>
#include<cppconn/driver.h>
#include<cppconn/exception.h>
#include<cppconn/resultset.h>
#include<cppconn/statement.h>
#include<cppconn/prepared_statement.h>
#include<cppconn/resultset_metadata.h>
#include<string>
#include<vector>
class MySQLConnector {
public:
    MySQLConnector()=default;
    MySQLConnector(std::string host,std::string user,std::string password,std::string db);
    ~MySQLConnector();
    void connect(std::string host,std::string user,std::string password,std::string db);
    void execute(std::string sql,std::vector<std::string> params={});
    std::vector<std::vector<std::string>> query(std::string sql,std::vector<std::string> params={}); 
private:
    sql::Driver* driver_;
    sql::Connection* conn_;
};
#endif
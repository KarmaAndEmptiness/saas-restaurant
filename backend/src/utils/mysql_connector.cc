#include"mysql_connector.h"

MySQLConnector::MySQLConnector(std::string host,std::string user,std::string password,std::string db)
{
    connect(host,user,password,db);
}

MySQLConnector::~MySQLConnector()
{
    if(conn_)
        delete conn_;
}

void MySQLConnector::connect(std::string host,std::string user,std::string password,std::string db)
{
    try
    {
        driver_ = get_driver_instance();
        conn_ = driver_->connect(host,user,password);
        conn_->setSchema(db);
    }
    catch(sql::SQLException &e)
    {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__;
        std::cout << ": " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
    }
    return;
}

void MySQLConnector::execute(std::string sql,std::vector<std::string> params)
{
    try
    {
    sql::PreparedStatement *pstmt = conn_->prepareStatement(sql);
    for(size_t i=0;i<params.size();i++)
    {
        pstmt->setString(i+1,params[i]);
    }
    pstmt->execute();
    delete pstmt;
    }
    catch(sql::SQLException &e)
    {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__;
        std::cout << ": " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
    }
    return;
}

std::vector<std::vector<std::string>> MySQLConnector::query(std::string sql,std::vector<std::string> params)
{
    std::vector<std::vector<std::string>> result;
    try
    {
    sql::PreparedStatement *pstmt = conn_->prepareStatement(sql);
    for(size_t i=0;i<params.size();i++)
    {
        pstmt->setString(i+1,params[i]);
    }
    sql::ResultSet *res = pstmt->executeQuery();
    while(res->next())
    {
        std::vector<std::string> row;
        for(size_t i=1;i<=res->getMetaData()->getColumnCount();i++)
        {
            row.push_back(res->getString(i));
        }
        result.push_back(row);
    }
    delete pstmt;
    delete res;
    }
    catch(sql::SQLException &e)
    {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__;
        std::cout << ": " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
    }
    return result;
}
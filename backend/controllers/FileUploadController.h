#pragma once

#include <drogon/HttpController.h>

using namespace drogon;

class FileUploadController : public drogon::HttpController<FileUploadController>
{
public:
  METHOD_LIST_BEGIN
  // use METHOD_ADD to add your custom processing function here;
  // METHOD_ADD(FileUploadController::get, "/{2}/{1}", Get); // path is /FileUploadController/{arg2}/{arg1}
  // METHOD_ADD(FileUploadController::your_method_name, "/{1}/{2}/list", Get); // path is /FileUploadController/{arg1}/{arg2}/list
  ADD_METHOD_TO(FileUploadController::upload, "/api/file/upload", Post, "AuthFilter"); // 上传
  METHOD_LIST_END
  // your declaration of processing function maybe like this:
  // void get(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback, int p1, std::string p2);
  void upload(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) const;
};

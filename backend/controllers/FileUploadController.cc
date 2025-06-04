#include "FileUploadController.h"

// Add definition of your processing function here

void FileUploadController::upload(const HttpRequestPtr &req, std::function<void(const HttpResponsePtr &)> &&callback) const
{

    MultiPartParser fileUpload;
    Json::Value response;
    if (fileUpload.parse(req) != 0 || fileUpload.getFiles().size() != 1)
    {

        response["code"] = k403Forbidden;
        response["message"] = "Must only be one file";
        auto resp = HttpResponse::newHttpJsonResponse(response);
        callback(resp);
        return;
    }
    auto &file = fileUpload.getFiles()[0];
    auto md5 = file.getMd5();
    response["code"] = k200OK;
    response["message"] = "ok";
    response["data"]["fileUrl"] = "/uploads/" + md5 + "_" + file.getFileName();
    auto resp = HttpResponse::newHttpJsonResponse(response);
    file.saveAs(md5 + "_" + file.getFileName());
    "directory";
    callback(resp);
}

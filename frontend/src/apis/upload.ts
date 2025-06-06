import http from '@/utils/request'
interface UploadParam { 
  file: File;
  type?: string; // 可选参数，指定上传类型
}
export const uploadFile = (data: UploadParam) => {
  return http.post('/api/file/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
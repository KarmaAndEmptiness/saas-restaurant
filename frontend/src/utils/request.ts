// src/utils/request.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError
} from 'axios'

// 定义业务响应数据格式（根据后端接口调整）
export interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

// 扩展请求配置类型
interface RequestConfig extends AxiosRequestConfig {
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟时间(ms)
  headers?: Record<string, string> // 请求头
}

// 请求队列管理
const pendingRequests = new Map<string, AbortController>()

class Request {
  private instance: AxiosInstance
  //@ts-ignore
  private retryCount: number
  private retryDelay: number

  constructor(config: RequestConfig = {}) {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量获取
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      ...config
    })

    this.retryCount = config.retry || 3
    this.retryDelay = config.retryDelay || 1000

    this.initInterceptors()
  }

  // 初始化拦截器
  private initInterceptors() {
    // 请求拦截
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加取消控制器
        const controller = new AbortController()
        config.signal = controller.signal

        // 生成请求唯一标识
        const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`

        // // 取消重复请求
        // if (pendingRequests.has(requestKey)) {
        //   pendingRequests.get(requestKey)?.abort()
        // }
        pendingRequests.set(requestKey, controller)

        // 添加认证 token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        // 移除 pending 请求
        const requestKey = this.getRequestKey(response.config)
        pendingRequests.delete(requestKey)

        // 业务状态码处理
        const { code, message } = response.data
        console.log(response.data)
        if (+code !== 200) {
          return Promise.reject(new Error(message || '业务错误'))
        }

        return response.data.data
      },
      async (error: AxiosError) => {
        // 移除 pending 请求
        const config = error.config as RequestConfig
        const requestKey = this.getRequestKey(config)
        pendingRequests.delete(requestKey)

        // 处理取消请求
        if (axios.isCancel(error)) {
          return Promise.reject(new Error('请求已取消'))
        }

        // 重试逻辑
        if (config.retry && config.retry > 0) {
          config.retry--
          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
          return this.instance(config)
        }

        // 错误处理
        return this.handleError(error)
      }
    )
  }

  // 错误处理方法
  private handleError(error: AxiosError) {
    if (error.response) {
      // HTTP 状态码错误处理
      const status = error.response.status
      switch (status) {
        case 401:
          // 处理认证失败
          break
        case 403:
          // 处理权限不足
          break
        case 404:
          // 处理资源不存在
          break
        case 500:
          // 处理服务器错误
          break
        default:
          break
      }
    } else if (error.request) {
      // 请求未收到响应
      console.error('请求超时或网络异常')
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message)
    }

    return Promise.reject(error)
  }

  // 生成请求唯一标识
  private getRequestKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`
  }

  // 公共请求方法
  public request<T = any>(config: RequestConfig): Promise<T> {
    return this.instance(config)
  }

  public get<T = any>(url: string, params?: object, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  public post<T = any>(url: string, data?: object, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: object, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, params?: object, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, { params, ...config })
  }

  // 取消所有请求
  public cancelAllRequests() {
    pendingRequests.forEach(controller => controller.abort())
    pendingRequests.clear()
  }
}

// 创建请求实例
const http = new Request({
  retry: 3,
  retryDelay: 1000
})

export default http
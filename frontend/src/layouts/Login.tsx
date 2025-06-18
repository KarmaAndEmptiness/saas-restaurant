import { useState } from "react";
import logo from "../../public/favicon.png";
import { tenantAdminLogin, tenantLogin } from "@/apis/login";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginType, setLoginType] = useState<"admin" | "tenant">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tenantToken, setTenantToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (loginType === "admin") {
        const data = await tenantAdminLogin({ username, password });
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("tenant_id", data.tenant_id);
          navigate("/home");
        } else {
          setError("无效的响应");
        }
      } else {
        const data = await tenantLogin({ username, password, tenantToken });
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("tenant_id", data.tenant_id);
          navigate("/home");
        } else {
          setError("无效的响应");
        }
      }
    } catch (err: any) {
      setError(err.message || "登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={logo} alt="Logo" className="h-20 w-auto mx-auto" />
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            智慧餐饮管理系统
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* 登录类型切换 */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setLoginType("admin")}
              className={`px-4 py-2 rounded-md ${
                loginType === "admin"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              租户管理员登录
            </button>
            <button
              onClick={() => setLoginType("tenant")}
              className={`px-4 py-2 rounded-md ${
                loginType === "tenant"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              租户登录
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginType === "tenant" && (
              <div>
                <label
                  htmlFor="tenantToken"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  租户Token：
                </label>
                <div className="mt-2">
                  <input
                    id="tenantToken"
                    name="tenantToken"
                    type="text"
                    required
                    value={tenantToken}
                    onChange={(e) => setTenantToken(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            )}

            {/* 用户名输入框 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                用户名：
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {/* 密码输入框 */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  密码：
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    忘记密码?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {isLoading ? "登录中..." : "登录"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

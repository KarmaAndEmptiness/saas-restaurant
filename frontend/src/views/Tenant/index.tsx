// 添加表格数据
const people = [
  {
    name: '张三',
    title: '餐厅老板',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃',
    lastSeen: '3分钟前',
  },
  {
    name: '李四',
    title: '分店经理',
    email: 'lisi@example.com',
    role: '用户',
    status: '离线',
    lastSeen: '2小时前',
  },
  // ...更多数据
]
function Tenant() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              {/* TODO: a search for users  */}
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                添加用户
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        姓名
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        职位
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        状态
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        角色
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        最后在线
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">编辑</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {people.map((person) => (
                      <tr key={person.email}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                                <span className="text-lg font-medium leading-none text-white">{person.name[0]}</span>
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{person.name}</div>
                              <div className="text-gray-500">{person.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${person.status === '活跃' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {person.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.lastSeen}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            编辑
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Tenant
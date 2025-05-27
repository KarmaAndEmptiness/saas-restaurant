import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../../public/favicon.png'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

const basename = import.meta.env.VITE_API_BASE
const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: logo,
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function Home() {
  const [navs, setNavs] = useState([
    { name: '用户管理', path: '', current: true },
    { name: '日志管理', path: '/home/log', current: false },
    { name: '预警管理', path: '', current: false },
  ])
  const [userNavs, setUserNavs] = useState([
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
  ])
  const handleNavClick = (e, item) => {
    const tmp = navs.map(item => ({
      ...item, current: false
    }));
    const target = tmp.map(nav => {
      if (nav.name === item.name)
        nav.current = true
      return nav
    })
    console.log(target)
    setNavs(target)
  }
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0">
                  <img
                    alt="智慧餐饮管理系统"
                    src={logo}
                    className="size-12"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navs.map((item) => (
                      <NavLink
                        to={item.path}
                        key={item.name}
                        onClick={e => handleNavClick(e, item)}
                        className={classNames(
                          item.current ? 'border-b border-indigo-600 rounded-none ' : 'hover:border-b hover:border-indigo-600 hover:rounded-none',
                          'rounded-md px-3 py-2 text-sm font-medium text-black',
                        )}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full  p-1 text-gray-400 hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full  text-sm focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img alt="" src={user.imageUrl} className="size-8 rounded-full" />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md  py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      {userNavs.map((item) => (
                        <MenuItem key={item.name}>
                          <a
                            href={item.path}
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                          >
                            {item.name}
                          </a>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md  p-2 text-gray-400 hover:bg-gray-700 hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navs.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={basename + item.path}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? ' text-black' : 'text-gray-300 hover:bg-gray-700 hover:text-black',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base/5 font-medium text-black">{user.name}</div>
                  <div className="text-sm font-medium text-gray-400">{user.email}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto shrink-0 rounded-full  p-1 text-gray-400 hover:text-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavs.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.path}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-black"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <header className="shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-1xl font-bold tracking-tight text-gray-900">用户管理</h1>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default Home
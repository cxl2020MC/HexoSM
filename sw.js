//importScripts('https://jsd.cxl2020mc.top/npm/clientworker@latest')

const config = [
    {
        rule: '^https\:\/\/((cdn|fastly|gcore|test1|quantil)\.jsdelivr\.net\/npm|jsd\.cxl2020mc\.top\/npm|unpkg\.com)',
        replace: [
            'https://jsd.cxl2020mc.top/npm',
            'https://vercel.jsd.cxl2020mc.top/npm',
            'https://jsdcxl2020mc.domain.qystu.cc/npm',
            'https://unpkg.cnortles.top',
            'https://cdn.cnortles.top/npm',
            'https://project.cnortles.top/proxy/jsdelivr/npm',
            'https://jsdelivr.pai233.top/npm',
            'https://cdn.jsdelivr.net/npm',
            'https://cdn3.tianli0.top/npm',
            'https://jsd.cky.codes/npm',
            'https://unpkg.com',
            '_'
        ],
        statuscode: 200
    }
]

//安装进程
// 在sw中可以使用this或是self表示自身
self.addEventListener('install', async () => {
    // 跳过等待
    await self.skipWaiting();
    console.log('[SW] 注册成功!');
});

self.addEventListener('activate', async () => {
    console.log('[SW] 激活成功!')
    // 立即管理页面
    await self.clients.claim();
    console.log('[SW] 安装成功!立即管理请求!')
});


// 捕获请求
self.addEventListener('fetch', async (event) => {
    try {
        event.respondWith(handleRequest(event.request));
    } catch (e) { };
});

// 返回响应
async function progress(res) {
    return new Response(await res.arrayBuffer(), {
        status: res.status,
        headers: res.headers
    })
}

// 处理请求
function handleRequest(req) {
    // 请求url的数组
    const urls = []
    const urlStr = req.url
    console.debug(`[SW] 处理请求 ${urlStr}`)
    let urlObj = new URL(urlStr)

    // 匹配请求
    for (const one_config in config) {
        // 正则匹配url
        if (urlStr.search(one_config.rule) != -1) {
            // 替换url
            const url = replace(urlStr, one_config.rule)
            // 把替换成的url加入进数组
            urls.push(url)
        }
    }

    // 如果上方遍历匹配到则直接统一发送请求(不会往下执行了)
    if (urls.length) return fetchAny(urls)

    // 抛出异常是为了让sw不拦截请求
    throw new Error('不是要匹配的请求')

    // 为了获取 cdn 类型
    // 例如获取gh (https://cdn.jsdelivr.net/gh)
    const path = urlObj.pathname.split('/')[1]

    // 匹配 cdn
    for (const type in cdn) {
        if (type === path) {
            for (const key in cdn[type]) {
                const url = cdn[type][key] + urlObj.pathname.replace('/' + path, '')
                urls.push(url)
            }
        }
    }
    
    // 如果上方 cdn 遍历 匹配到 cdn 则直接统一发送请求(不会往下执行了)
    if (urls.length) return fetchAny(urls)

    // 将用户访问的当前网站与所有源站合并
    let origins = [...new Set([location.origin, ...origin])]

    // 遍历判断当前请求是否是源站主机
    const is = origins.find((i) => new URL(urlStr).hostname === new URL(i).hostname)

    // 如果是源站，则竞速获取(不会往下执行了)
    if (is) {
        origins = origins.map((i) => i + urlObj.pathname + urlObj.search)
        return fetchAny(origins)
    }
    // 抛出异常是为了让sw不拦截请求
    throw new Error('不是源站')
}

// Promise.any 的 polyfill
// 如果因为浏览器太过老旧，不支持最新的 Promise.allSettled API，
// 我们可以使用 polyfill 技术，简单地自己用 Promise.all, 
// 自行实现 Promise.allSettled.
// https://maimai.cn/article/detail?fid=1746477129&efid=-D_X-EidD9QbFy972FBXAw
// 注释 by cxl2020mc（其实其他地方也有好多）
function createPromiseAny() {
    Promise.any = function (promises) {
        return new Promise((resolve, reject) => {
            promises = Array.isArray(promises) ? promises : []
            let len = promises.length
            let errs = []
            if (len === 0) return reject(new AggregateError('All promises were rejected'))
            promises.forEach((p) => {
                if (!p instanceof Promise) return reject(p)
                p.then(
                    (res) => resolve(res),
                    (err) => {
                        len--
                        errs.push(err)
                        if (len === 0) reject(new AggregateError(errs))
                    }
                )
            })
        })
    }
}

// 发送所有请求
function fetchAny(urls) {
    // 中断一个或多个请求
    const controller = new AbortController()
    const signal = controller.signal

    // 遍历将所有的请求地址转换为promise
    const PromiseAll = urls.map((url) => {
        // Promise的构造函数接收两个参数：resolve和reject（可以省略）。
        // 其中resolve是用来标记代码执行成功的，用法为resolve(args)，
        // 传进去的参数我们后面再说。相反，reject就是用来标记代码执行错误，用法为reject(args)。
        return new Promise((resolve, reject) => {
            fetch(url, { signal })
                // 返回响应
                .then(progress)
                // 检查请求是否成功
                .then((res) => {
                    const r = res.clone()
                    if (r.status !== 200) reject(null)
                    controller.abort() // 中断
                    resolve(r)
                })
                .catch(() => reject(null))
        })
    })

    // 判断浏览器是否支持 Promise.any
    // 如果不支持就执行上面的方法
    if (!Promise.any) createPromiseAny()

    // 谁先返回"成功状态"则返回谁的内容，如果都返回"失败状态"则返回null
    return Promise.any(PromiseAll)
        .then((res) => res)
        .catch(() => null)
}

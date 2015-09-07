# weixin_sogou 

爬取微信公众号文章

服务地址: [WeiRSS](http://weirss.me/)

**UPDATE**: 目前因为搜狗微信接口调整,服务处于不稳定状态...

## 依赖
1. Python 3.4+
2. BeautifulSoup
3. requests
4. selenium
5. phantomjs

## 使用说明
在[搜狗微信搜索平台](http://weixin.sogou.com)搜公众号名称，在url里获得公众号的openid

`get_account_info()` 获取账号信息，可传入openid、url、cookies

`parse_list()`获取文章列表，可传入openid、link

`parse_essay()`获取文章内容，传入文章链接

`update_cookies()`更新cookies，触发反爬虫时使用

## 示例
```python
open_id = 'oIWsFt3nvJ2jaaxm9UOB_LUos02k'
cookies = update_cookies()
print(get_account_info(open_id,cookies=cookies))
#{'description': '一个基于内容分享的社区——「交流故事·沟通想法」', 'logo'...
print(parse_list(open_id))
#[{'link': 'http://mp.weixin.qq.com/s?__biz=MjM5NjM4OTAyMA==&mid=206650

```


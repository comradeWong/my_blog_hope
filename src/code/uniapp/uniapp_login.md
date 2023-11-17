---

title: uniapp开发微信小程序登录
description: uniapp开发微信小程序登录
icon: newspaper
isOriginal: false
date: 2022/05/12 20:12:32
category:
 - 移动端
tag:
 - uniapp
sticky: false
article: true
timeline: true
cover: https://fastly.jsdelivr.net/gh/comradeWong/ImageStorageService@master/img/17002078543461700207853784.png

---

> 最近公司使用uniapp开发微信小程序，在此记录一下调用小程序登录的方法，以及一些封装。

# 实现步骤

## 进入小程序

进入项目时，会进入uniapp的应用生命周期，在@/App.vue中的OnLaunch方法添加代码如下。

```javascript
	onLaunch: async function() {
		const login_res = await login()
		await wxLogin(login_res)
	}
```

### 调用ui.login()接口

```javascript
// 调用ui.login()方法，获取用户的code
export const login = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: res => {
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		});
	})
}
```

返回值格式

```json
{
	code: "031iOKFa14UxVA0fwnFa1yP9r81iOKFu"
	errMsg: "login:ok"
}
```

### 调用后端的登录接口，发送code

调用后端的登录接口，发送code，如果有toekn，携带token，返回最新的token和授权结果。

```javascript
export const wxLogin = (loginRes) => {
	return new Promise((resolve, reject)=> {
		const {
			errMsg,
			code
		} = loginRes
		if (errMsg.indexOf('ok') !== -1) {
			validLogin({
				code,
				sf: '1'
			}).then(res => {
				const {
					code,
					data,
					token
				} = res
				if (code === API_RETURN_CODE.USER_UNLOGIN.code) {
					// 用户未登录 存储状态并且储存返回的微信openId
					uni.setStorageSync(STORAGE_KEYS.USER_LOGIN_CODE, code)
					uni.setStorageSync(STORAGE_KEYS.WX_OPEN_ID, data)
				} else if (code === API_RETURN_CODE.USER_LOGINED.code) {
					// 用户已登录，未进行授权
					uni.setStorageSync(STORAGE_KEYS.USER_LOGIN_CODE, code)
					token && setToken(token)
					const userInfo = {
						phoneNumber: data.phone,
						sf: data.sf
					}
					uni.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
				} else if(code === API_RETURN_CODE.USER_AUTHOR.code) {
					// 用户已登录，已授权
					uni.setStorageSync(STORAGE_KEYS.USER_LOGIN_CODE, code)
					token && setToken(token)
					const userInfo = {
						phoneNumber: data.phone,
						sf: data.sf
					}
					uni.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
				} 
				resolve()
			}).catch((err)=> {
				console.log(err);
				reject()
			})
		} else if (errMsg.indexOf('fail') !== -1) {
			uni.showToast({
				title: 'wx.login出错，请退出重新进入',
				duration: 2000
			})
			reject()
		}
	})
}

```


## 进入需要验证登录状态和授权状态的页面时

如果未登录，则进入登录页面；如果已登录，未授权，则弹出授权框；如果已登录，已授权，则返回状态，进入页面。在需要验证登录状态和授权状态的页面调用如下方法：

```javascript
checkUserAuth()
.then(res => {
	if (res.status !== '') {
		this.authStatusText = res.status;
	}
})
.catch(err => {
	console.log(err);
});

```

(PS：我需要页面显示时进行状态判断，故该方法我在onShow函数中调用，具体在哪里调用，需要根据需求分析)

### 检测用户的登录状态和授权状态

```javascript
// 检测用户的登录状态
export const checkUserAuth = () => {
	return new Promise((resolve, reject) => {
		// 用户登录的code
		const userLoginCode = uni.getStorageSync(STORAGE_KEYS.USER_LOGIN_CODE)
		const returnRes = {
			code: 0,
			status: '',
			message: ''
		}
		if (!userLoginCode) {
			returnRes.code = userLoginCode
			returnRes.message = '未获取到登录状态码'
			reject(returnRes)
		} else if (userLoginCode === API_RETURN_CODE.USER_ERROR.code) {
			returnRes.code = userLoginCode
			returnRes.message = '异常'
			reject(returnRes)
		} else if (userLoginCode === API_RETURN_CODE.USER_AUTHOR.code) {
			// 用户已登录，已授权
			returnRes.code = userLoginCode
			returnRes.status = '已登录，已授权'
			resolve(returnRes)
		} else if (userLoginCode === API_RETURN_CODE.USER_LOGINED.code) {
			// 用户已登录，未授权
			uni.showModal({
				title: '提示',
				content: '您的账号尚未授权，是否进行授权？',
				success: function(res) {
					if (res.confirm) {
						getUserProfile().then(async infoRes => {
							const saveAuthRes = await saveAuthInfo(infoRes)
							returnRes.code = userLoginCode
							returnRes.status = '已登录，已授权'
							resolve(returnRes)
						}).catch(err => {
							console.log(err);
						})
					} else if (res.cancel) {
						returnRes.code = userLoginCode
						returnRes.status = '已登录，未授权'
						resolve(returnRes)
					}
				}
			});
		} else if (userLoginCode === API_RETURN_CODE.USER_UNLOGIN.code) {
			// 如果未登录，跳转到登录页面
			uni.showModal({
				title: '提示',
				content: '您尚未登录，是否登录？',
				success: function(res) {
					returnRes.code = userLoginCode
					returnRes.status = '未登录'
					if (res.confirm) {
						uni.navigateTo({
							url: 'pages/login/index',
						})
					} else if (res.cancel) {}
					resolve(returnRes)
				}
			});
		}
	})
}

```

（PS: 方法中的code为一些自己定义的常量，文末附有文件，可自行查看）

## 获取用户信息授权

在上一步中，如果已登录，未授权，则弹出授权框。此时需要调用uni.getUserProfile()接口，然后将获取到的用户信息发送到后端，并保存授权信息。

### 调用uni.getUserProfile()

```javascript
// 获取用户信息。每次请求都会弹出授权窗口，用户同意后返回 userInfo。
export const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			desc: '用户登录',
			success: (info_res) => {
				resolve(info_res)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

```

### 保存授权信息

```javascript
// 6.保存授权信息
export const saveAuthInfo = (info) => {
	return new Promise((resolve, reject)=> {
		const {
			nickName,
			gender,
			city,
			province,
			country,
			avatarUrl
		} = info.userInfo
		
		const data = {
			nickName: nickName,
			avatarUrl: avatarUrl,
			gender: gender,
			address: `${city === '' ? '0' : city} ${province === '' ? '0' : province} ${country === '' ? '0' : country}`
		}
		saveWXAuthInfo(data).then(res => {
			uni.setStorageSync(STORAGE_KEYS.USER_LOGIN_CODE, res.code)
			resolve()
		}).catch(err => {
			reject(err)
		})
	})
}

```



## 用户一键登录（获取手机号）

如果验证登录状态，结果为未登录，则跳转到登录页。

### 登录页代码

```html
<!-- #ifdef MP-WEIXIN -->
<button class="login-btn" type="primary" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信一键登录</button>
<!-- #endif -->
```

```javascript
// methods 中新增方法
getPhoneNumber(res) {
	getPhoneNumber(res)
		.then(() => {
			sendPhoneLogin(res.detail).then(() => {
				uni.navigateBack()
			}).catch(()=> {
				
			})
		})
		.catch(err => {
			console.log(err);
		});
}

```

### 获取用户手机号，并发送给后端

```javascript
// 获取手机号
// 处理 getPhoneNubmber 操作，如果获取失败返回reject
export const getPhoneNumber = (res) => {
	return new Promise((resolve, reject) => {
		console.log(res);
		const {
			detail
		} = res;
		// 1用户已授权 0：用户已拒绝
		if (detail.errMsg.indexOf('ok') !== -1) {
			resolve(res)
		} else if (detail.errMsg.indexOf('fail') !== -1) {
			reject(detail.errMsg)
		}
	})
}


// 15.获取手机号之后，将相关信息传往后端
export const sendPhoneLogin = (info) => {
	return new Promise((resolve, reject) => {
		const data = {
			sf: '1',
			encryptedData: info.encryptedData,
			iv: info.iv,
			openId: uni.getStorageSync(STORAGE_KEYS.WX_OPEN_ID)
		}
		phoneLogin(data).then((res) => {
			const {
				code,
				data,
				token
			} = res
			if(code === API_RETURN_CODE.USER_ERROR.code) {
				reject(code)
			}
			const userInfo = {
				phoneNumber: data.phone,
				sf: data.sf
			}
			uni.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
			uni.setStorageSync(STORAGE_KEYS.USER_LOGIN_CODE, code)
			setToken(token)
			resolve(res)
		}).catch(() => {
			reject()
		})
	})
}

```



## 相关接口

```javascript
import request from '@/utils/request.javascript'

export const validLogin = (params) => {
	return request.get('/wx/validLogin', params)
}


export const saveWXAuthInfo = (data) => {
	return request.post('/wx/saveUserProfile', data, {
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		}
	})
}

export const phoneLogin = (data) => {
	return request.post('/wx/phoneLogin', data, {
		// dataType: '',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		}
	})
}

```



# 相关代码文件

- [__setToken封装__](https://file-1252351428.cos.ap-beijing.myqcloud.com/token.js)

- [__MiniRequest封装__](https://file-1252351428.cos.ap-beijing.myqcloud.com/MinRequest.js)

- [__request封装__](https://file-1252351428.cos.ap-beijing.myqcloud.com/request.js)

- [__wx相关方法封装__](https://file-1252351428.cos.ap-beijing.myqcloud.com/wx.js)

- [__constant常量封装__](https://file-1252351428.cos.ap-beijing.myqcloud.com/constant.js)


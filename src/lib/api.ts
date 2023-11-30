import axios, { CancelToken } from 'axios';
import { convertJsonData, toObjectKeyValue } from '@/utils/helper';
import Router from 'next/router';
import { isEmptyObject } from '@/utils/validate';
import https from 'https';


axios.defaults.withCredentials = false;

type thisProps = {
	requestPath: string,
	payload: object,
}

const appPayLoad = {
	appid: process.env.APP_ID,
	appVersion: process.env.APP_VERSION
};

const handleError = (error) => {
	if (error && error.response) {
		const { data } = error.response;
		if (data && data.payload && data.payload.forceLogout) {
			localStorage.clear()
			Router.push({
				pathname: '/sign-in',
				query: {
					redirect: Router.asPath && Router.asPath,
				}
			});
		}
		return data;
	}

};

class Api {
	static get = (requestPath: string, payload?: {}) => {
		return Api._fetch('get', requestPath, payload);
	};

	static post = (requestPath: string, payload?: {}) => {
		return Api._fetch('post', requestPath, payload);
	};

	static put = (requestPath: string, payload?: {}) => {
		return Api._fetch('put', requestPath, payload);
	};

	static delete = (requestPath: string, payload?: {}) => {
		return Api._fetch('delete', requestPath, payload);
	};

	static postimage = (requestPath: string, payload?: {}) => {
		const token = localStorage.getItem('token')
		const transformHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + token,
		};

		return Api._fetch('post', requestPath, payload, transformHeaders);
	};

	static putimage = (requestPath: string, payload?: {}) => {
		const token = localStorage.getItem('token')
		const transformHeaders = {
			'Accept': 'application/json',
			'Content-Type': 'multipart/form-data',
			'Authorization': 'Bearer ' + token,
		};

		return Api._fetch('put', requestPath, payload, transformHeaders);
	};

	static _fetch = (method, requestPath, payload = {}, transformHeaders?: {}) => {
		payload = { ...payload, ...appPayLoad };
		let token = '';
		const dataKey = (method === 'get') ? 'params' : 'data';
		const url = encodeURI(process.env.API_END_POINT + requestPath);
		if (typeof window !== 'undefined') {
			token = localStorage.getItem('token')
		}
		const headers = isEmptyObject(transformHeaders) ? {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
		} : transformHeaders;

		const request = axios.request({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
			url: url,
			method: method,
			headers: headers,
			[dataKey]: payload,
			timeout: 20000,
			responseType: 'json',
		}).then(res => convertJsonData(res.data))
			.catch(error => {
				// console.log("url ", url);
				// if (error.response) {
				// 	console.log("data ", error.response.data,);
				// 	console.log("status ", error.response.status,);
				// 	console.log("headers ", error.response.headers,);
				// }
				// if (error.request) {
				// 	// console.log("request ", error.request,);
				// 	// console.log("_response ", error.request._response,);
				// }
				// console.log('Error', error.message);
				// // console.log(error.config);



				// handle error forceLogout
				if (error.response && error.response.data) {
					const { payload } = error.response.data;
					if (payload && payload.forceLogout) {
						localStorage.clear();
						Router.push({
							pathname: '/sign-in',
							// query: {
							// 	redirect: Router.asPath && Router.asPath,
							// }
						});
					}
				}

				if (error.response) {
					if (error.response.data) {
						const result = error.response.data;
						if (!result.success) {
							// transform response to formik setError format
							if (result.payload && result.payload.listError) {
								result.payload.listError = toObjectKeyValue(Object.values(result.payload.listError), 'field', 'msg');
							}
							return result;
						}
					}
				}

				return {
					error: true,
					message: 'Please Check Your Connection',
					payload: {}
				};
			});
		return request;
	};
}

export { Api };
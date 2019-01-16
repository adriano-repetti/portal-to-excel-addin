/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./function-file/function-file.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	const MbedCloudSDK = __webpack_require__(1);

	let connect;
	let sheetIndex = "1";

	(function () {
	    Office.onReady().then(function () {
	        $(document).ready(function () {

	            if (!Office.context.requirements.isSetSupported('ExcelApi', 1.7)) {
	                console.log('Sorry, the Portal add-in uses Excel.js APIs that are not available in your version of Office.');
	            }

	            $('#subscribe').click(createSubscription);
	        });
	    });

	    function createSubscription() {
	        if (!connect) {
	            connect = new MbedCloudSDK.ConnectApi({
	                apiKey: $("#api-key").val(),
	                host: $("#host").val()
	            });

	            $("#api-key").attr("disabled", true);
	            $("#host").attr("disabled", true);
	        }

	        $("#subscribe").attr("disabled", true);

	        Excel.run(function (context) {
	            const deviceId = $("#device-id").val();
	            const resourceURI = $("#resource-uri").val();

	            const currentWorksheet = context.workbook.worksheets.add(getWorksheetName(sheetIndex++, deviceId, resourceURI));

	            return connect.getResourceValue(deviceId, resourceURI).then(function (data) {
	                $("#subscribe").removeAttr("disabled");

	                return logValue(context, currentWorksheet, sheetIndex - 1, deviceId, resourceURI, JSON.stringify(data)).then(function () {
	                    return context.sync().then(function () {
	                        return subscribe(sheetIndex - 1, deviceId, resourceURI);
	                    });
	                });
	            }).catch(function (error) {
	                console.error("Error (getResourceValue): ", error);
	            });
	        }).catch(function (error) {
	            $("#subscribe").removeAttr("disabled");
	            console.error("Error: ", error);
	            if (error instanceof OfficeExtension.Error) {
	                console.error("Debug info: " + JSON.stringify(error.debugInfo));
	            }
	        });
	    }

	    function subscribe(sheetIndex, deviceId, resourceURI) {
	        return connect.addResourceSubscription(deviceId, resourceURI, function (changedData) {
	            return Excel.run(function (context) {
	                context.workbook.worksheets.load();
	                return context.sync().then(function () {
	                    const worksheetName = getWorksheetName(sheetIndex, deviceId, resourceURI);
	                    const currentWorksheet = context.workbook.worksheets.items.find(x => x.name === worksheetName);
	                    return logValue(context, currentWorksheet, sheetIndex, deviceId, resourceURI, changedData);
	                });
	            });
	        });
	    }

	    function logValue(context, currentWorksheet, sheetIndex, deviceId, resourceURI, value) {
	        currentWorksheet.tables.load();

	        const name = "ResourceTable_" + sheetIndex;
	        return context.sync().then(function () {
	            let resourceTable = currentWorksheet.tables.items.find(x => x.name === name);
	            if (!resourceTable) {
	                resourceTable = currentWorksheet.tables.add("A1:C1", true);
	                resourceTable.name = name;
	                resourceTable.getHeaderRowRange().values = [["Device", "Resource", "Value"]];
	            }

	            resourceTable.rows.add(null, [[deviceId, resourceURI, value]]);

	            resourceTable.getRange().format.autofitColumns();
	            resourceTable.getRange().format.autofitRows();
	        });
	    }

	    function getWorksheetName(sheetIndex, deviceId, resourceURI) {
	        return sheetIndex + resourceURI.replace(/\//g, "-");
	    }
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;!function(e){if(true)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.MbedCloudSDK=e()}}(function(){return function(){function e(t,r,n){function i(a,s){if(!r[a]){if(!t[a]){var u="function"==typeof require&&require;if(!s&&u)return require(a,!0);if(o)return o(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var p=r[a]={exports:{}};t[a][0].call(p.exports,function(e){return i(t[a][1][e]||e)},p,p.exports,e,t,r,n)}return r[a].exports}for(var o="function"==typeof require&&require,a=0;a<n.length;a++)i(n[a]);return i}return e}()({1:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.getBillingReport=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'month' missing.")));var n={},i={};void 0!==e&&(i.month=e);var a={},s=[],u=["application/json"];return this.request({url:"/v3/billing-report",method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getBillingReportActiveDevices=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'month' missing.")));var n={},i={};void 0!==e&&(i.month=e);var a={},s=[],u=["application/json"];return this.request({url:"/v3/billing-report-active-devices",method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getBillingReportFirmwareUpdates=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'month' missing.")));var n={},i={};void 0!==e&&(i.month=e);var a={},s=[],u=["application/json"];return this.request({url:"/v3/billing-report-firmware-updates",method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getServicePackageQuota=function(e,t){var r={},n={},i={},o=[],a=["application/json"];return this.request({url:"/v3/service-packages-quota",method:"GET",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.getServicePackageQuotaHistory=function(e,t,r,n){var i={},o={};void 0!==e&&(o.limit=e),void 0!==t&&(o.after=t);var a={},s=[],u=["application/json"];return this.request({url:"/v3/service-packages-quota-history",method:"GET",headers:i,query:o,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:n},r)},t.prototype.getServicePackages=function(e,t){var r={},n={},i={},o=[],a=["application/json"];return this.request({url:"/v3/service-packages",method:"GET",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t}(i.ApiBase);r.DefaultApi=a},{"../common/apiBase":38,"../common/sdkError":45}],2:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.deletePreSharedKey=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'endpointName' missing.")));var n={},i={},a={},s=[],u=[];return this.request({url:"/v2/device-shared-keys/{endpoint_name}".replace("{endpoint_name}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getPreSharedKey=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'endpointName' missing.")));var n={},i={},a={},s=[],u=[];return this.request({url:"/v2/device-shared-keys/{endpoint_name}".replace("{endpoint_name}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.listPreSharedKeys=function(e,t,r,n){var i={},o={};void 0!==e&&(o.limit=e),void 0!==t&&(o.after=t);var a={},s=["application/json"],u=["application/json"];return this.request({url:"/v2/device-shared-keys",method:"GET",headers:i,query:o,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:n},r)},t.prototype.uploadPreSharedKey=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v2/device-shared-keys",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t}(i.ApiBase);r.PreSharedKeysApi=a},{"../common/apiBase":38,"../common/sdkError":45}],3:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.createDeveloperCertificate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'authorization' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={};void 0!==e&&(i.Authorization=e);var a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/developer-certificates",method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.getDeveloperCertificate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'developerCertificateId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'authorization' missing.")));var i={};void 0!==t&&(i.Authorization=t);var a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/developer-certificates/{developerCertificateId}".replace("{developerCertificateId}",String(e)),method:"GET",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t}(i.ApiBase);r.DeveloperCertificateApi=a;var s=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.getAllServerCredentials=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'authorization' missing.")));var n={};void 0!==e&&(n.Authorization=e);var i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/server-credentials",method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getBootstrapServerCredentials=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'authorization' missing.")));var n={};void 0!==e&&(n.Authorization=e);var i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/server-credentials/bootstrap",method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getL2M2MServerCredentials=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'authorization' missing.")));var n={};void 0!==e&&(n.Authorization=e);var i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/server-credentials/lwm2m",method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t}(i.ApiBase);r.ServerCredentialsApi=s},{"../common/apiBase":38,"../common/sdkError":45}],4:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.deviceCreate=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'device' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/devices/",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.deviceDestroy=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'id' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/devices/{id}/".replace("{id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deviceEventList=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.order=t),void 0!==r&&(u.after=r),void 0!==n&&(u.filter=n),void 0!==i&&(u.include=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/device-events/",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.deviceEventRetrieve=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'deviceEventId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/device-events/{device_event_id}/".replace("{device_event_id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deviceList=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.order=t),void 0!==r&&(u.after=r),void 0!==n&&(u.filter=n),void 0!==i&&(u.include=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/devices/",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.deviceLogList=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.order=t),void 0!==r&&(u.after=r),void 0!==n&&(u.filter=n),void 0!==i&&(u.include=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/devicelog/",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.deviceLogRetrieve=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'deviceEventId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/devicelog/{device_event_id}/".replace("{device_event_id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deviceQueryCreate=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'device' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/device-queries/",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.deviceQueryDestroy=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'queryId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/device-queries/{query_id}/".replace("{query_id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deviceQueryList=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.order=t),void 0!==r&&(u.after=r),void 0!==n&&(u.filter=n),void 0!==i&&(u.include=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/device-queries/",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.deviceQueryRetrieve=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'queryId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/device-queries/{query_id}/".replace("{query_id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deviceQueryUpdate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'queryId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/device-queries/{query_id}/".replace("{query_id}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.deviceRetrieve=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'id' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/devices/{id}/".replace("{id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deviceUpdate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'id' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'device' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/devices/{id}/".replace("{id}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t}(i.ApiBase);r.DefaultApi=a},{"../common/apiBase":38,"../common/sdkError":45}],5:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.createBulkDeviceEnrollment=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'enrollmentIdentities' missing.")));var n={},i={},a=!1,s={};void 0!==e&&(s.enrollment_identities=e),a=!0;var u=["multipart/form-data"],c=["application/json"];return this.request({url:"/v3/device-enrollments-bulk-uploads",method:"POST",headers:n,query:i,formParams:s,useFormData:a,contentTypes:u,acceptTypes:c,requestOptions:r},t)},t.prototype.createDeviceEnrollment=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'enrollmentIdentity' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/device-enrollments",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.deleteDeviceEnrollment=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'id' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/device-enrollments/{id}".replace("{id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getBulkDeviceEnrollment=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'id' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/device-enrollments-bulk-uploads/{id}".replace("{id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getDeviceEnrollment=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'id' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/device-enrollments/{id}".replace("{id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getDeviceEnrollments=function(e,t,r,n,i,o){var a={},s={};void 0!==e&&(s.limit=e),void 0!==t&&(s.after=t),void 0!==r&&(s.order=r),void 0!==n&&(s.include=n);var u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/device-enrollments",method:"GET",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:o},i)},t}(i.ApiBase);r.PublicAPIApi=a},{"../common/apiBase":38,"../common/sdkError":45}],6:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.addApiKeyToGroups=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'apiKey' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/api-keys/{apiKey}/groups".replace("{apiKey}",String(e)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.addCertificate=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/trusted-certificates",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.addSubjectsToGroup=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'groupID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}".replace("{groupID}",String(e)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.addUserToGroups=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'userId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/users/{user-id}/groups".replace("{user-id}",String(e)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.createGroup=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/policy-groups",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.createUser=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={};void 0!==t&&(a.action=t);var s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/users",method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:e},r)},t.prototype.deleteGroup=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'groupID' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}".replace("{groupID}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deleteUser=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'userId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/users/{user-id}".replace("{user-id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getAllUsers=function(e,t,r,n,i,o,a,s,u,c){var p={},d={};void 0!==e&&(d.limit=e),void 0!==t&&(d.after=t),void 0!==r&&(d.order=r),void 0!==n&&(d.include=n),void 0!==i&&(d.email__eq=i),void 0!==o&&(d.status__eq=o),void 0!==a&&(d.status__in=a),void 0!==s&&(d.status__nin=s);var l={},f=[],m=["application/json"];return this.request({url:"/v3/users",method:"GET",headers:p,query:d,formParams:l,useFormData:!1,contentTypes:f,acceptTypes:m,requestOptions:c},u)},t.prototype.getGroupsOfApikey=function(e,t,r,n,i,a,s){if(null===e||void 0===e)return void(a&&a(new o.SDKError("Required parameter 'apiKey' missing.")));var u={},c={};void 0!==t&&(c.limit=t),void 0!==r&&(c.after=r),void 0!==n&&(c.order=n),void 0!==i&&(c.include=i);var p={},d=[],l=["application/json"];return this.request({url:"/v3/api-keys/{apiKey}/groups".replace("{apiKey}",String(e)),method:"GET",headers:u,query:c,formParams:p,useFormData:!1,contentTypes:d,acceptTypes:l,requestOptions:s},a)},t.prototype.getGroupsOfUser=function(e,t,r,n,i,a,s){if(null===e||void 0===e)return void(a&&a(new o.SDKError("Required parameter 'userId' missing.")));var u={},c={};void 0!==t&&(c.limit=t),void 0!==r&&(c.after=r),void 0!==n&&(c.order=n),void 0!==i&&(c.include=i);var p={},d=[],l=["application/json"];return this.request({url:"/v3/users/{user-id}/groups".replace("{user-id}",String(e)),method:"GET",headers:u,query:c,formParams:p,useFormData:!1,contentTypes:d,acceptTypes:l,requestOptions:s},a)},t.prototype.getUser=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'userId' missing.")));var i={},a={};void 0!==t&&(a.properties=t);var s={},u=[],c=["application/json"];return this.request({url:"/v3/users/{user-id}".replace("{user-id}",String(e)),method:"GET",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.getUsersOfGroup=function(e,t,r,n,i,a,s,u,c,p){if(null===e||void 0===e)return void(c&&c(new o.SDKError("Required parameter 'groupID' missing.")));var d={},l={};void 0!==t&&(l.limit=t),void 0!==r&&(l.after=r),void 0!==n&&(l.order=n),void 0!==i&&(l.include=i),void 0!==a&&(l.status__eq=a),void 0!==s&&(l.status__in=s),void 0!==u&&(l.status__nin=u);var f={},m=[],v=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}/users".replace("{groupID}",String(e)),method:"GET",headers:d,query:l,formParams:f,useFormData:!1,contentTypes:m,acceptTypes:v,requestOptions:p},c)},t.prototype.removeApiKeyFromGroups=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'apiKey' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/api-keys/{apiKey}/groups".replace("{apiKey}",String(e)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.removeUserFromGroups=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'userId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/users/{user-id}/groups".replace("{user-id}",String(e)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.removeUsersFromGroup=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'groupID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}/users".replace("{groupID}",String(e)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.updateGroupName=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'groupID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}".replace("{groupID}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.updateMyAccount=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/accounts/me",method:"PUT",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.updateUser=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'userId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/users/{user-id}".replace("{user-id}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t}(i.ApiBase);r.AccountAdminApi=a;var s=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.addAccountApiKeyToGroups=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'apiKey' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}/groups".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"POST",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.addAccountCertificate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/trusted-certificates".replace("{accountID}",String(e)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.addAccountUserToGroups=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'userId' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users/{user-id}/groups".replace("{accountID}",String(e)).replace("{user-id}",String(t)),method:"POST",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.addSubjectsToAccountGroup=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'groupID' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"POST",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.checkAccountApiKey=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'apiKey' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.createAccount=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={};void 0!==t&&(a.action=t);var s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/accounts",method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:e},r)},t.prototype.createAccountApiKey=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys".replace("{accountID}",String(e)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.createAccountGroup=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups".replace("{accountID}",String(e)),method:"POST",headers:i,query:a,formParams:s,
	useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.createAccountUser=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={};void 0!==r&&(s.action=r);var u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users".replace("{accountID}",String(e)),method:"POST",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:t},n)},t.prototype.deleteAccountApiKey=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'apiKey' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.deleteAccountCertificate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'certId' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/trusted-certificates/{cert-id}".replace("{accountID}",String(e)).replace("{cert-id}",String(t)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.deleteAccountGroup=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'groupID' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.deleteAccountUser=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'userId' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users/{user-id}".replace("{accountID}",String(e)).replace("{user-id}",String(t)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.getAccountApiKey=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'apiKey' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"GET",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.getAccountCertificate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'certId' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/trusted-certificates/{cert-id}".replace("{accountID}",String(e)).replace("{cert-id}",String(t)),method:"GET",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.getAccountGroupSummary=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'groupID' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"GET",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.getAccountInfo=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));var a={},s={};void 0!==t&&(s.include=t),void 0!==r&&(s.properties=r);var u={},c=[],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}".replace("{accountID}",String(e)),method:"GET",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i},n)},t.prototype.getAccountUser=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'userId' missing.")));var a={},s={};void 0!==r&&(s.properties=r);var u={},c=[],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users/{user-id}".replace("{accountID}",String(e)).replace("{user-id}",String(t)),method:"GET",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i},n)},t.prototype.getAllAccountApiKeys=function(e,t,r,n,i,a,s,u,c){if(null===e||void 0===e)return void(u&&u(new o.SDKError("Required parameter 'accountID' missing.")));var p={},d={};void 0!==t&&(d.limit=t),void 0!==r&&(d.after=r),void 0!==n&&(d.order=n),void 0!==i&&(d.include=i),void 0!==a&&(d.key__eq=a),void 0!==s&&(d.owner__eq=s);var l={},f=[],m=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys".replace("{accountID}",String(e)),method:"GET",headers:p,query:d,formParams:l,useFormData:!1,contentTypes:f,acceptTypes:m,requestOptions:c},u)},t.prototype.getAllAccountCertificates=function(e,t,r,n,i,a,s,u,c,p,d,l,f,m,v,y){if(null===e||void 0===e)return void(v&&v(new o.SDKError("Required parameter 'accountID' missing.")));var h={},_={};void 0!==t&&(_.limit=t),void 0!==r&&(_.after=r),void 0!==n&&(_.order=n),void 0!==i&&(_.include=i),void 0!==a&&(_.name__eq=a),void 0!==s&&(_.service__eq=s),void 0!==u&&(_.expire__eq=u),void 0!==c&&(_.device_execution_mode__eq=c),void 0!==p&&(_.device_execution_mode__neq=p),void 0!==d&&(_.owner__eq=d),void 0!==l&&(_.enrollment_mode__eq=l),void 0!==f&&(_.issuer__like=f),void 0!==m&&(_.subject__like=m);var g={},q=[],E=["application/json"];return this.request({url:"/v3/accounts/{accountID}/trusted-certificates".replace("{accountID}",String(e)),method:"GET",headers:h,query:_,formParams:g,useFormData:!1,contentTypes:q,acceptTypes:E,requestOptions:y},v)},t.prototype.getAllAccountGroups=function(e,t,r,n,i,a,s,u){if(null===e||void 0===e)return void(s&&s(new o.SDKError("Required parameter 'accountID' missing.")));var c={},p={};void 0!==t&&(p.limit=t),void 0!==r&&(p.after=r),void 0!==n&&(p.order=n),void 0!==i&&(p.include=i),void 0!==a&&(p.name__eq=a);var d={},l=[],f=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups".replace("{accountID}",String(e)),method:"GET",headers:c,query:p,formParams:d,useFormData:!1,contentTypes:l,acceptTypes:f,requestOptions:u},s)},t.prototype.getAllAccountUsers=function(e,t,r,n,i,a,s,u,c,p,d){if(null===e||void 0===e)return void(p&&p(new o.SDKError("Required parameter 'accountID' missing.")));var l={},f={};void 0!==t&&(f.limit=t),void 0!==r&&(f.after=r),void 0!==n&&(f.order=n),void 0!==i&&(f.include=i),void 0!==a&&(f.email__eq=a),void 0!==s&&(f.status__eq=s),void 0!==u&&(f.status__in=u),void 0!==c&&(f.status__nin=c);var m={},v=[],y=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users".replace("{accountID}",String(e)),method:"GET",headers:l,query:f,formParams:m,useFormData:!1,contentTypes:v,acceptTypes:y,requestOptions:d},p)},t.prototype.getAllAccounts=function(e,t,r,n,i,o,a,s,u,c,p,d,l,f,m){var v={},y={};void 0!==e&&(y.status__eq=e),void 0!==t&&(y.status__in=t),void 0!==r&&(y.status__nin=r),void 0!==n&&(y.tier__eq=n),void 0!==i&&(y.parent__eq=i),void 0!==o&&(y.end_market__eq=o),void 0!==a&&(y.country__like=a),void 0!==s&&(y.limit=s),void 0!==u&&(y.after=u),void 0!==c&&(y.order=c),void 0!==p&&(y.include=p),void 0!==d&&(y.format=d),void 0!==l&&(y.properties=l);var h={},_=[],g=["application/json"];return this.request({url:"/v3/accounts",method:"GET",headers:v,query:y,formParams:h,useFormData:!1,contentTypes:_,acceptTypes:g,requestOptions:m},f)},t.prototype.getApiKeysOfAccountGroup=function(e,t,r,n,i,a,s,u){if(null===e||void 0===e)return void(s&&s(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(s&&s(new o.SDKError("Required parameter 'groupID' missing.")));var c={},p={};void 0!==r&&(p.limit=r),void 0!==n&&(p.after=n),void 0!==i&&(p.order=i),void 0!==a&&(p.include=a);var d={},l=[],f=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}/api-keys".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"GET",headers:c,query:p,formParams:d,useFormData:!1,contentTypes:l,acceptTypes:f,requestOptions:u},s)},t.prototype.getGroupsOfAccountApikey=function(e,t,r,n,i,a,s,u){if(null===e||void 0===e)return void(s&&s(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(s&&s(new o.SDKError("Required parameter 'apiKey' missing.")));var c={},p={};void 0!==r&&(p.limit=r),void 0!==n&&(p.after=n),void 0!==i&&(p.order=i),void 0!==a&&(p.include=a);var d={},l=[],f=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}/groups".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"GET",headers:c,query:p,formParams:d,useFormData:!1,contentTypes:l,acceptTypes:f,requestOptions:u},s)},t.prototype.getGroupsOfAccountUser=function(e,t,r,n,i,a,s,u){if(null===e||void 0===e)return void(s&&s(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(s&&s(new o.SDKError("Required parameter 'userId' missing.")));var c={},p={};void 0!==r&&(p.limit=r),void 0!==n&&(p.after=n),void 0!==i&&(p.order=i),void 0!==a&&(p.include=a);var d={},l=[],f=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users/{user-id}/groups".replace("{accountID}",String(e)).replace("{user-id}",String(t)),method:"GET",headers:c,query:p,formParams:d,useFormData:!1,contentTypes:l,acceptTypes:f,requestOptions:u},s)},t.prototype.getUsersOfAccountGroup=function(e,t,r,n,i,a,s,u,c,p,d){if(null===e||void 0===e)return void(p&&p(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(p&&p(new o.SDKError("Required parameter 'groupID' missing.")));var l={},f={};void 0!==r&&(f.limit=r),void 0!==n&&(f.after=n),void 0!==i&&(f.order=i),void 0!==a&&(f.include=a),void 0!==s&&(f.status__eq=s),void 0!==u&&(f.status__in=u),void 0!==c&&(f.status__nin=c);var m={},v=[],y=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}/users".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"GET",headers:l,query:f,formParams:m,useFormData:!1,contentTypes:v,acceptTypes:y,requestOptions:d},p)},t.prototype.removeAccountApiKeyFromGroups=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'apiKey' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}/groups".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"DELETE",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.removeAccountUserFromGroups=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'userId' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users/{user-id}/groups".replace("{accountID}",String(e)).replace("{user-id}",String(t)),method:"DELETE",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.removeApiKeysFromAccountGroup=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'groupID' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}/api-keys".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"DELETE",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.removeUsersFromAccountGroup=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'groupID' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}/users".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"DELETE",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.resetAccountApiKeySecret=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'apiKey' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}/reset-secret".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.updateAccount=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}".replace("{accountID}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.updateAccountApiKey=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'apiKey' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=[],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/api-keys/{apiKey}".replace("{accountID}",String(e)).replace("{apiKey}",String(t)),method:"PUT",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.updateAccountCertificate=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'certId' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/trusted-certificates/{cert-id}".replace("{accountID}",String(e)).replace("{cert-id}",String(t)),method:"PUT",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.updateAccountGroupName=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'groupID' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/policy-groups/{groupID}".replace("{accountID}",String(e)).replace("{groupID}",String(t)),method:"PUT",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.updateAccountUser=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'userId' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={},u={},c=["application/json"],p=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users/{user-id}".replace("{accountID}",String(e)).replace("{user-id}",String(t)),method:"PUT",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t.prototype.validateAccountUserEmail=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'accountID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'userId' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/accounts/{accountID}/users/{user-id}/validate-email".replace("{accountID}",String(e)).replace("{user-id}",String(t)),method:"POST",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t}(i.ApiBase);r.AggregatorAccountAdminApi=s;var u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.addMyApiKeyToGroups=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/api-keys/me/groups",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.createApiKey=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/api-keys",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.deleteApiKey=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'apiKey' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/api-keys/{apiKey}".replace("{apiKey}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deleteCertificate=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'certId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/trusted-certificates/{cert-id}".replace("{cert-id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getAllApiKeys=function(e,t,r,n,i,o,a,s){var u={},c={};void 0!==e&&(c.limit=e),void 0!==t&&(c.after=t),void 0!==r&&(c.order=r),void 0!==n&&(c.include=n),void 0!==i&&(c.key__eq=i),void 0!==o&&(c.owner__eq=o);var p={},d=[],l=["application/json"];return this.request({url:"/v3/api-keys",method:"GET",headers:u,query:c,formParams:p,useFormData:!1,contentTypes:d,acceptTypes:l,requestOptions:s},a)},t.prototype.getAllCertificates=function(e,t,r,n,i,o,a,s,u,c,p,d,l,f,m){var v={},y={};void 0!==e&&(y.limit=e),void 0!==t&&(y.after=t),void 0!==r&&(y.order=r),void 0!==n&&(y.include=n),void 0!==i&&(y.name__eq=i),void 0!==o&&(y.service__eq=o),void 0!==a&&(y.expire__eq=a),void 0!==s&&(y.device_execution_mode__eq=s),void 0!==u&&(y.device_execution_mode__neq=u),void 0!==c&&(y.owner__eq=c),void 0!==p&&(y.enrollment_mode__eq=p),void 0!==d&&(y.issuer__like=d),void 0!==l&&(y.subject__like=l);var h={},_=[],g=["application/json"];return this.request({url:"/v3/trusted-certificates",method:"GET",headers:v,query:y,formParams:h,useFormData:!1,contentTypes:_,acceptTypes:g,requestOptions:m},f)},t.prototype.getAllGroups=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.after=t),void 0!==r&&(u.order=r),void 0!==n&&(u.include=n),void 0!==i&&(u.name__eq=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/policy-groups",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.getApiKey=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'apiKey' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/api-keys/{apiKey}".replace("{apiKey}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getApiKeysOfGroup=function(e,t,r,n,i,a,s){if(null===e||void 0===e)return void(a&&a(new o.SDKError("Required parameter 'groupID' missing.")));var u={},c={};void 0!==t&&(c.limit=t),void 0!==r&&(c.after=r),void 0!==n&&(c.order=n),void 0!==i&&(c.include=i);var p={},d=[],l=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}/api-keys".replace("{groupID}",String(e)),method:"GET",headers:u,query:c,formParams:p,useFormData:!1,contentTypes:d,acceptTypes:l,requestOptions:s},a)},t.prototype.getCertificate=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'certId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/trusted-certificates/{cert-id}".replace("{cert-id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getGroupSummary=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'groupID' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}".replace("{groupID}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getGroupsOfMyApiKey=function(e,t,r,n,i,o){var a={},s={};void 0!==e&&(s.limit=e),void 0!==t&&(s.after=t),void 0!==r&&(s.order=r),void 0!==n&&(s.include=n);var u={},c=[],p=["application/json"];return this.request({url:"/v3/api-keys/me/groups",method:"GET",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:o},i)},t.prototype.getMyAccountInfo=function(e,t,r,n){var i={},o={};void 0!==e&&(o.include=e),void 0!==t&&(o.properties=t);var a={},s=[],u=["application/json"];return this.request({url:"/v3/accounts/me",method:"GET",headers:i,query:o,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:n},r)},t.prototype.getMyApiKey=function(e,t){var r={},n={},i={},o=[],a=["application/json"];return this.request({url:"/v3/api-keys/me",method:"GET",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.removeApiKeysFromGroup=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'groupID' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/policy-groups/{groupID}/api-keys".replace("{groupID}",String(e)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.removeMyApiKeyFromGroups=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=["application/json"],u=["application/json"];return this.request({url:"/v3/api-keys/me/groups",method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.updateApiKey=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'apiKey' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/api-keys/{apiKey}".replace("{apiKey}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.updateCertificate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'certId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'body' missing.")));var i={},a={},s={},u=["application/json"],c=["application/json"];return this.request({url:"/v3/trusted-certificates/{cert-id}".replace("{cert-id}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t.prototype.updateMyApiKey=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'body' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/api-keys/me",method:"PUT",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t}(i.ApiBase);r.DeveloperApi=u},{"../common/apiBase":38,"../common/sdkError":45}],7:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.createAsyncRequest=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'asyncId' missing.")));if(null===r||void 0===r)return void(n&&n(new o.SDKError("Required parameter 'body' missing.")));var a={},s={};void 0!==t&&(s["async-id"]=t);var u={},c=["application/json"],p=["application/json"];return this.request({url:"/v2/device-requests/{device-id}".replace("{device-id}",String(e)),method:"POST",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i,body:r},n)},t}(i.ApiBase);r.DeviceRequestsApi=a;var s=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.getConnectedEndpoints=function(e,t,r){var n={},i={};void 0!==e&&(i.type=e);var o={},a=[],s=["application/json"];return this.request({url:"/v2/endpoints",method:"GET",headers:n,query:i,formParams:o,useFormData:!1,contentTypes:a,acceptTypes:s,requestOptions:r},t)},t.prototype.getEndpointResources=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'deviceId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v2/endpoints/{device-id}".replace("{device-id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t}(i.ApiBase);r.EndpointsApi=s;var u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.deleteLongPollChannel=function(e,t){var r={},n={},i={},o=[],a=[];return this.request({url:"/v2/notification/pull",method:"DELETE",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.deregisterWebhook=function(e,t){var r={},n={},i={},o=[],a=[];return this.request({url:"/v2/notification/callback",method:"DELETE",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.getWebhook=function(e,t){var r={},n={},i={},o=[],a=["application/json"];return this.request({url:"/v2/notification/callback",method:"GET",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.longPollNotifications=function(e,t){var r={},n={},i={},o=[],a=["application/json"];return this.request({url:"/v2/notification/pull",method:"GET",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.registerWebhook=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'webhook' missing.")));var n={},i={},a={},s=["application/json"],u=[];return this.request({url:"/v2/notification/callback",method:"PUT",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t}(i.ApiBase);r.NotificationsApi=u;var c=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.deleteResourcePath=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'resourcePath' missing.")));var a={},s={};void 0!==r&&(s.noResp=r);var u={},c=[],p=[];return this.request({url:"/v2/endpoints/{device-id}/{resourcePath}".replace("{device-id}",String(e)).replace("{resourcePath}",String(t)),method:"DELETE",headers:a,query:s,formParams:u,useFormData:!1,contentTypes:c,acceptTypes:p,requestOptions:i},n)},t.prototype.executeOrCreateResource=function(e,t,r,n,i,a){if(null===e||void 0===e)return void(i&&i(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(i&&i(new o.SDKError("Required parameter 'resourcePath' missing.")));var s={},u={};void 0!==n&&(u.noResp=n);var c={},p=["text/plain","application/xml","application/octet-stream","application/exi","application/json","application/link-format","application/senml+json","application/nanoservice-tlv","application/vnd.oma.lwm2m+text","application/vnd.oma.lwm2m+opaq","application/vnd.oma.lwm2m+tlv","application/vnd.oma.lwm2m+json"],d=[];return this.request({url:"/v2/endpoints/{device-id}/{resourcePath}".replace("{device-id}",String(e)).replace("{resourcePath}",String(t)),method:"POST",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a,body:r},i)},t.prototype.getResourceValue=function(e,t,r,n,i,a){if(null===e||void 0===e)return void(i&&i(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(i&&i(new o.SDKError("Required parameter 'resourcePath' missing.")));var s={},u={};void 0!==r&&(u.cacheOnly=r),void 0!==n&&(u.noResp=n);var c={},p=[],d=[];return this.request({url:"/v2/endpoints/{device-id}/{resourcePath}".replace("{device-id}",String(e)).replace("{resourcePath}",String(t)),method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},i)},t.prototype.updateResourceValue=function(e,t,r,n,i,a){
	if(null===e||void 0===e)return void(i&&i(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(i&&i(new o.SDKError("Required parameter 'resourcePath' missing.")));if(null===r||void 0===r)return void(i&&i(new o.SDKError("Required parameter 'resourceValue' missing.")));var s={},u={};void 0!==n&&(u.noResp=n);var c={},p=["text/plain","application/xml","application/octet-stream","application/exi","application/json","application/link-format","application/senml+json","application/nanoservice-tlv","application/vnd.oma.lwm2m+text","application/vnd.oma.lwm2m+opaq","application/vnd.oma.lwm2m+tlv","application/vnd.oma.lwm2m+json"],d=[];return this.request({url:"/v2/endpoints/{device-id}/{resourcePath}".replace("{device-id}",String(e)).replace("{resourcePath}",String(t)),method:"PUT",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a,body:r},i)},t}(i.ApiBase);r.ResourcesApi=c;var p=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.addResourceSubscription=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'resourcePath' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v2/subscriptions/{device-id}/{resourcePath}".replace("{device-id}",String(e)).replace("{resourcePath}",String(t)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.checkResourceSubscription=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'resourcePath' missing.")));var i={},a={},s={},u=[],c=[];return this.request({url:"/v2/subscriptions/{device-id}/{resourcePath}".replace("{device-id}",String(e)).replace("{resourcePath}",String(t)),method:"GET",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.deleteEndpointSubscriptions=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'deviceId' missing.")));var n={},i={},a={},s=[],u=[];return this.request({url:"/v2/subscriptions/{device-id}".replace("{device-id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.deletePreSubscriptions=function(e,t){var r={},n={},i={},o=[],a=[];return this.request({url:"/v2/subscriptions",method:"DELETE",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.deleteResourceSubscription=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'deviceId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'resourcePath' missing.")));var i={},a={},s={},u=[],c=[];return this.request({url:"/v2/subscriptions/{device-id}/{resourcePath}".replace("{device-id}",String(e)).replace("{resourcePath}",String(t)),method:"DELETE",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.getEndpointSubscriptions=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'deviceId' missing.")));var n={},i={},a={},s=[],u=["text/uri-list"];return this.request({url:"/v2/subscriptions/{device-id}".replace("{device-id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.getPreSubscriptions=function(e,t){var r={},n={},i={},o=[],a=["application/json"];return this.request({url:"/v2/subscriptions",method:"GET",headers:r,query:n,formParams:i,useFormData:!1,contentTypes:o,acceptTypes:a,requestOptions:t},e)},t.prototype.updatePreSubscriptions=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'presubsription' missing.")));var n={},i={},a={},s=["application/json"],u=["text/plain"];return this.request({url:"/v2/subscriptions",method:"PUT",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t}(i.ApiBase);r.SubscriptionsApi=p},{"../common/apiBase":38,"../common/sdkError":45}],8:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.v3MetricsGet=function(e,t,r,n,i,a,s,u,c,p){if(null===e||void 0===e)return void(c&&c(new o.SDKError("Required parameter 'include' missing.")));if(null===t||void 0===t)return void(c&&c(new o.SDKError("Required parameter 'interval' missing.")));var d={},l={};void 0!==e&&(l.include=e),void 0!==r&&(l.start=r),void 0!==n&&(l.end=n),void 0!==i&&(l.period=i),void 0!==t&&(l.interval=t),void 0!==a&&(l.limit=a),void 0!==s&&(l.after=s),void 0!==u&&(l.order=u);var f={},m=[],v=["application/json"];return this.request({url:"/v3/metrics",method:"GET",headers:d,query:l,formParams:f,useFormData:!1,contentTypes:m,acceptTypes:v,requestOptions:p},c)},t}(i.ApiBase);r.AccountApi=a;var s=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.v3MetricsGet=function(e,t,r,n,i,a,s,u,c,p){if(null===e||void 0===e)return void(c&&c(new o.SDKError("Required parameter 'include' missing.")));if(null===t||void 0===t)return void(c&&c(new o.SDKError("Required parameter 'interval' missing.")));var d={},l={};void 0!==e&&(l.include=e),void 0!==r&&(l.start=r),void 0!==n&&(l.end=n),void 0!==i&&(l.period=i),void 0!==t&&(l.interval=t),void 0!==a&&(l.limit=a),void 0!==s&&(l.after=s),void 0!==u&&(l.order=u);var f={},m=[],v=["application/json"];return this.request({url:"/v3/metrics",method:"GET",headers:d,query:l,formParams:f,useFormData:!1,contentTypes:m,acceptTypes:v,requestOptions:p},c)},t}(i.ApiBase);r.StatisticsApi=s},{"../common/apiBase":38,"../common/sdkError":45}],9:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/apiBase"),o=e("../common/sdkError"),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return n(t,e),t.prototype.firmwareImageCreate=function(e,t,r,n,i){if(null===e||void 0===e)return void(n&&n(new o.SDKError("Required parameter 'datafile' missing.")));if(null===t||void 0===t)return void(n&&n(new o.SDKError("Required parameter 'name' missing.")));var a={},s={},u=!1,c={};void 0!==e&&(c.datafile=e),u=!0,void 0!==r&&(c.description=r),void 0!==t&&(c.name=t);var p=["multipart/form-data"],d=["application/json"];return this.request({url:"/v3/firmware-images/",method:"POST",headers:a,query:s,formParams:c,useFormData:u,contentTypes:p,acceptTypes:d,requestOptions:i},n)},t.prototype.firmwareImageDestroy=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'imageId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/firmware-images/{image_id}/".replace("{image_id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.firmwareImageList=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.order=t),void 0!==r&&(u.after=r),void 0!==n&&(u.filter=n),void 0!==i&&(u.include=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/firmware-images/",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.firmwareImageRetrieve=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'imageId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/firmware-images/{image_id}/".replace("{image_id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.firmwareManifestCreate=function(e,t,r,n,i,a){if(null===e||void 0===e)return void(i&&i(new o.SDKError("Required parameter 'datafile' missing.")));if(null===t||void 0===t)return void(i&&i(new o.SDKError("Required parameter 'name' missing.")));var s={},u={},c=!1,p={};void 0!==e&&(p.datafile=e),c=!0,void 0!==r&&(p.description=r),void 0!==n&&(p.key_table=n),c=!0,void 0!==t&&(p.name=t);var d=["multipart/form-data"],l=["application/json"];return this.request({url:"/v3/firmware-manifests/",method:"POST",headers:s,query:u,formParams:p,useFormData:c,contentTypes:d,acceptTypes:l,requestOptions:a},i)},t.prototype.firmwareManifestDestroy=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'manifestId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/firmware-manifests/{manifest_id}/".replace("{manifest_id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.firmwareManifestList=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.order=t),void 0!==r&&(u.after=r),void 0!==n&&(u.filter=n),void 0!==i&&(u.include=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/firmware-manifests/",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.firmwareManifestRetrieve=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'manifestId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/firmware-manifests/{manifest_id}/".replace("{manifest_id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.updateCampaignCreate=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'campaign' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/update-campaigns/",method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r,body:e},t)},t.prototype.updateCampaignDestroy=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'campaignId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/update-campaigns/{campaign_id}/".replace("{campaign_id}",String(e)),method:"DELETE",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.updateCampaignList=function(e,t,r,n,i,o,a){var s={},u={};void 0!==e&&(u.limit=e),void 0!==t&&(u.order=t),void 0!==r&&(u.after=r),void 0!==n&&(u.filter=n),void 0!==i&&(u.include=i);var c={},p=[],d=["application/json"];return this.request({url:"/v3/update-campaigns/",method:"GET",headers:s,query:u,formParams:c,useFormData:!1,contentTypes:p,acceptTypes:d,requestOptions:a},o)},t.prototype.updateCampaignMetadataList=function(e,t,r,n,i,a,s){if(null===e||void 0===e)return void(a&&a(new o.SDKError("Required parameter 'campaignId' missing.")));var u={},c={};void 0!==t&&(c.limit=t),void 0!==r&&(c.order=r),void 0!==n&&(c.after=n),void 0!==i&&(c.include=i);var p={},d=[],l=["application/json"];return this.request({url:"/v3/update-campaigns/{campaign_id}/campaign-device-metadata/".replace("{campaign_id}",String(e)),method:"GET",headers:u,query:c,formParams:p,useFormData:!1,contentTypes:d,acceptTypes:l,requestOptions:s},a)},t.prototype.updateCampaignMetadataRetrieve=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'campaignId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'campaignDeviceMetadataId' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/update-campaigns/{campaign_id}/campaign-device-metadata/{campaign_device_metadata_id}/".replace("{campaign_id}",String(e)).replace("{campaign_device_metadata_id}",String(t)),method:"GET",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n},r)},t.prototype.updateCampaignMetadataStop=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'campaignId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/update-campaigns/{campaign_id}/stop".replace("{campaign_id}",String(e)),method:"POST",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.updateCampaignRetrieve=function(e,t,r){if(null===e||void 0===e)return void(t&&t(new o.SDKError("Required parameter 'campaignId' missing.")));var n={},i={},a={},s=[],u=["application/json"];return this.request({url:"/v3/update-campaigns/{campaign_id}/".replace("{campaign_id}",String(e)),method:"GET",headers:n,query:i,formParams:a,useFormData:!1,contentTypes:s,acceptTypes:u,requestOptions:r},t)},t.prototype.updateCampaignUpdate=function(e,t,r,n){if(null===e||void 0===e)return void(r&&r(new o.SDKError("Required parameter 'campaignId' missing.")));if(null===t||void 0===t)return void(r&&r(new o.SDKError("Required parameter 'campaign' missing.")));var i={},a={},s={},u=[],c=["application/json"];return this.request({url:"/v3/update-campaigns/{campaign_id}/".replace("{campaign_id}",String(e)),method:"PUT",headers:i,query:a,formParams:s,useFormData:!1,contentTypes:u,acceptTypes:c,requestOptions:n,body:t},r)},t}(i.ApiBase);r.DefaultApi=a},{"../common/apiBase":38,"../common/sdkError":45}],10:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../common/functions"),i=e("../common/listResponse"),o=e("./endpoints"),a=e("./models/accountAdapter"),s=e("./models/apiKeyAdapter"),u=e("./models/userAdapter"),c=e("./models/groupAdapter"),p=function(){function e(e){this._endpoints=new o.Endpoints(e)}return e.prototype.getAccount=function(e){var t=this;return n.apiWrapper(function(e){t._endpoints.developer.getMyAccountInfo("limits, policies","",e)},function(e,r){r(null,a.AccountAdapter.map(e,t))},e)},e.prototype.updateAccount=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.admin.updateMyAccount(a.AccountAdapter.reverseMap(e),t)},function(e,t){t(null,a.AccountAdapter.map(e,r))},t)},e.prototype.listApiKeys=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.after,s=i.order,u=i.include,c=i.filter;r._endpoints.developer.getAllApiKeys(o,a,s,n.encodeInclude(u),n.extractFilter(c,"apiKey"),n.extractFilter(c,"ownerId"),t)},function(e,t){var n;e&&e.data&&e.data.length&&(n=e.data.map(function(e){return s.ApiKeyAdapter.map(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getApiKey=function(e,t){var r=this;return"function"==typeof e&&(t=e,e=null),n.apiWrapper(function(t){e?r._endpoints.developer.getApiKey(e,t):r._endpoints.developer.getMyApiKey(t)},function(e,t){t(null,s.ApiKeyAdapter.map(e,r))},t)},e.prototype.addApiKey=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.developer.createApiKey(s.ApiKeyAdapter.addMap(e),t)},function(e,t){t(null,s.ApiKeyAdapter.map(e,r))},t)},e.prototype.updateApiKey=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.developer.updateApiKey(e.id,s.ApiKeyAdapter.updateMap(e),t)},function(e,t){t(null,s.ApiKeyAdapter.map(e,r))},t)},e.prototype.deleteApiKey=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.developer.deleteApiKey(e,t)},function(e,t){t(null,e)},t)},e.prototype.listUsers=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.after,s=i.order,u=i.include,c=i.filter;r._endpoints.admin.getAllUsers(o,a,s,n.encodeInclude(u),n.extractFilter(c,"email"),n.extractFilter(c,"status"),n.extractFilter(c,"status","$in"),n.extractFilter(c,"status","$nin"),t)},function(e,t){var n;e.data&&e.data.length&&(n=e.data.map(function(e){return u.UserAdapter.map(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getUser=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.admin.getUser(e,"",t)},function(e,t){t(null,u.UserAdapter.map(e,r))},t)},e.prototype.addUser=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.admin.createUser(u.UserAdapter.addMap(e),"create",t)},function(e,t){t(null,u.UserAdapter.map(e,r))},t)},e.prototype.updateUser=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.admin.updateUser(e.id,u.UserAdapter.updateMap(e),t)},function(e,t){t(null,u.UserAdapter.map(e,r))},t)},e.prototype.deleteUser=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.admin.deleteUser(e,t)},function(e,t){t(null,e)},t)},e.prototype.listGroups=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.after,s=i.order,u=i.include,c=i.filter;r._endpoints.developer.getAllGroups(o,a,s,n.encodeInclude(u),n.extractFilter(c,"name"),t)},function(e,t){var n;e.data&&e.data.length&&(n=e.data.map(function(e){return c.GroupAdapter.map(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getGroup=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.developer.getGroupSummary(e,t)},function(e,t){t(null,c.GroupAdapter.map(e,r))},t)},e.prototype.listGroupUsers=function(e,t,r){var o=this;return t=t||{},"function"==typeof t&&(r=t,t={}),n.apiWrapper(function(r){var i=t,a=i.limit,s=i.after,u=i.order,c=i.include,p=i.filter;o._endpoints.admin.getUsersOfGroup(e,a,s,u,n.encodeInclude(c),n.extractFilter(p,"status"),n.extractFilter(p,"status","$in"),n.extractFilter(p,"status","$nin"),r)},function(e,t){var r;e.data&&e.data.length&&(r=e.data.map(function(e){return u.UserAdapter.map(e,o)})),t(null,new i.ListResponse(e,r))},r)},e.prototype.listGroupApiKeys=function(e,t,r){var o=this;return t=t||{},"function"==typeof t&&(r=t,t={}),n.apiWrapper(function(r){var i=t,a=i.limit,s=i.after,u=i.order,c=i.include;o._endpoints.developer.getApiKeysOfGroup(e,a,s,u,n.encodeInclude(c),r)},function(e,t){var r;e.data&&e.data.length&&(r=e.data.map(function(e){return s.ApiKeyAdapter.map(e,o)})),t(null,new i.ListResponse(e,r))},r)},e.prototype.getLastApiMetadata=function(e){var t=this;return n.asyncStyle(function(e){e(null,t._endpoints.getLastMeta())},e)},e}();r.AccountManagementApi=p},{"../common/functions":41,"../common/listResponse":43,"./endpoints":11,"./models/accountAdapter":13,"./models/apiKeyAdapter":15,"./models/groupAdapter":17,"./models/userAdapter":23}],11:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/endpointsBase"),o=e("../_api/iam"),a=function(e){function t(t){var r=e.call(this)||this;return r.developer=new o.DeveloperApi(t,r.responseHandler.bind(r)),r.admin=new o.AccountAdminApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(i.EndpointsBase);r.Endpoints=a},{"../_api/iam":6,"../common/endpointsBase":40}],12:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.update=function(e){var t=this;return n.asyncStyle(function(e){t._api.updateAccount(t,e)},e)},e}();r.Account=i},{"../../common/functions":41}],13:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./account"),i=e("./policyAdapter"),o=function(){function e(){}return e.map=function(e,t){var r=[];return e.policies&&(r=e.policies.map(function(e){return i.PolicyAdapter.map(e)})),new n.Account({displayName:e.display_name,aliases:e.aliases,company:e.company,contact:e.contact,email:e.email,phoneNumber:e.phone_number,addressLine1:e.address_line1,addressLine2:e.address_line2,city:e.city,state:e.state,postcode:e.postal_code,country:e.country,id:e.id,status:e.status,tier:e.tier,limits:e.limits,policies:r,createdAt:e.created_at,upgradedAt:e.upgraded_at,reason:e.reason,templateId:e.template_id,customerNumber:e.customer_number,expiryWarning:e.expiration_warning_threshold,salesContactEmail:e.sales_contact,multifactorAuthenticationStatus:e.mfa_status,notificationEmails:e.notification_emails,referenceNote:e.reference_note,updatedAt:e.updated_at,contractNumber:e.contract_number},t)},e.reverseMap=function(e){return{display_name:e.displayName,aliases:e.aliases,company:e.company,contact:e.contact,email:e.email,phone_number:e.phoneNumber,address_line1:e.addressLine1,address_line2:e.addressLine2,city:e.city,state:e.state,postal_code:e.postcode,country:e.country,mfa_status:e.multifactorAuthenticationStatus,notification_emails:e.notificationEmails,expiration_warning_threshold:e.expiryWarning}},e}();r.AccountAdapter=o},{"./account":12,"./policyAdapter":21}],14:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.listGroups=function(e){var t=this;return n.apiWrapper(function(e){t._api.listGroups(null,e)},function(e,r){var n=[];e.data&&e.data.length&&(n=e.data.filter(function(e){return t.groups.indexOf(e.id)>-1})),r(null,n)},e)},e.prototype.getOwner=function(e){var t=this;return n.asyncStyle(function(e){if(!t.ownerId)return e(null,null);t._api.getUser(t.ownerId,e)},e)},e.prototype.update=function(e){var t=this;return n.asyncStyle(function(e){t._api.updateApiKey(t,e)},e)},e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteApiKey(t.id,e)},e)},e}();r.ApiKey=i},{"../../common/functions":41}],15:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./apiKey"),i=function(){function e(){}return e.map=function(e,t){return new n.ApiKey({name:e.name,ownerId:e.owner,groups:e.groups,id:e.id,key:e.key,status:e.status,createdAt:e.created_at,creationTime:e.creation_time,lastLoginTime:e.last_login_time},t)},e.addMap=function(e){return{name:e.name,status:e.status,owner:e.ownerId,groups:e.groups}},e.updateMap=function(e){return{name:e.name,status:e.status,owner:e.ownerId}},e}();r.ApiKeyAdapter=i},{"./apiKey":14}],16:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.listUsers=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.asyncStyle(function(t){r._api.listGroupUsers(r.id,e,t)},t)},e.prototype.listApiKeys=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.asyncStyle(function(t){r._api.listGroupApiKeys(r.id,e,t)},t)},e}();r.Group=i},{"../../common/functions":41}],17:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./group"),i=function(){function e(){}return e.map=function(e,t){return new n.Group({id:e.id,accountId:e.account_id,name:e.name,userCount:e.user_count,apiKeyCount:e.apikey_count,createdAt:e.created_at},t)},e}();r.GroupAdapter=i},{"./group":16}],18:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t])}return e}();r.LoginHistory=n},{}],19:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./loginHistory"),i=function(){function e(){}return e.map=function(e){return new n.LoginHistory({date:e.date,userAgent:e.user_agent,ipAddress:e.ip_address,success:e.success})},e}();r.LoginHistoryAdapter=i},{"./loginHistory":18}],20:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t])}return e}();r.Policy=n},{}],21:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./policy"),i=function(){function e(){}return e.map=function(e){return new n.Policy({action:e.action,allow:e.allow,feature:e.feature,resource:e.resource})},e}();r.PolicyAdapter=i},{"./policy":20}],22:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.update=function(e){var t=this;return n.asyncStyle(function(e){t._api.updateUser(t,e)},e)},e.prototype.listGroups=function(e){var t=this;return n.apiWrapper(function(e){t._api.listGroups(null,e)},function(e,r){var n=[];e.data&&e.data.length&&(n=e.data.filter(function(e){return t.groups.indexOf(e.id)>-1})),r(null,n)},e)},e.prototype.listApiKeys=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.asyncStyle(function(t){e.filter={ownerId:{$eq:r.id}},r._api.listApiKeys(e,t)},t)},e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteUser(t.id,e)},e)},e}();r.User=i},{"../../common/functions":41}],23:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./user"),i=e("./loginHistoryAdapter"),o=function(){function e(){}return e.map=function(e,t){var r=[];return e.login_history&&(r=e.login_history.map(function(e){return i.LoginHistoryAdapter.map(e)})),new n.User({fullName:e.full_name,username:e.username,password:e.password,email:e.email,phoneNumber:e.phone_number,address:e.address,termsAccepted:e.is_gtc_accepted,marketingAccepted:e.is_marketing_accepted,groups:e.groups,id:e.id,status:e.status,accountId:e.account_id,emailVerified:e.email_verified,createdAt:e.created_at,creationTime:e.creation_time,passwordChangedTime:e.password_changed_time,twoFactorAuthentication:e.is_totp_enabled,lastLoginTime:e.last_login_time,loginHistory:r},t)},e.addMap=function(e){return{full_name:e.fullName,username:e.username,password:e.password,email:e.email,phone_number:e.phoneNumber,address:e.address,is_gtc_accepted:e.termsAccepted,is_marketing_accepted:e.marketingAccepted,groups:e.groups}},e.updateMap=function(e){return{full_name:e.fullName,username:e.username,email:e.email,phone_number:e.phoneNumber,address:e.address,is_gtc_accepted:e.termsAccepted,is_marketing_accepted:e.marketingAccepted,groups:e.groups}},e}();r.UserAdapter=o},{"./loginHistoryAdapter":19,"./user":22}],24:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./endpoints"),i=e("../common/functions"),o=e("./models/quotaHistoryAdapter"),a=e("../common/listResponse"),s=e("./models/servicePackageAdapter"),u=e("../common/sdkError"),c=e("fs"),p=e("superagent"),d=function(){function e(e){this._endpoints=new n.Endpoints(e)}return e.prototype.getReportOverview=function(e,t,r){var n=this;return"function"==typeof t&&(r=t),i.apiWrapper(function(t){n._endpoints.billing.getBillingReport(i.dateToBillingMonth(e),t)},function(e,r){var n=JSON.stringify(e);i.isThisNode()?t&&c.writeFile(t,n,"utf8",function(e){return e?r(new u.SDKError(e.message),null):r(null,n)}):r(null,n)},r)},e.prototype.getReportActiveDevices=function(e,t,r){var n=this;return"function"==typeof t&&(r=t),i.apiWrapper(function(t){n._endpoints.billing.getBillingReportActiveDevices(i.dateToBillingMonth(e),t)},function(e,r){n.streamToFile(t,e.url,r)},r)},e.prototype.getReportFirmwareUpdates=function(e,t,r){var n=this;return"function"==typeof t&&(r=t),i.apiWrapper(function(t){n._endpoints.billing.getBillingReportFirmwareUpdates(i.dateToBillingMonth(e),t)},function(e,r){n.streamToFile(t,e.url,r)},r)},e.prototype.getServicePackages=function(e){var t=this;return i.apiWrapper(function(e){t._endpoints.billing.getServicePackages(e)},function(e,t){var r=new Array;e&&(e.pending&&r.push(s.mapPending(e.pending)),e.active&&r.push(s.mapActive(e.active)),e.previous&&e.previous.forEach(function(e){return r.push(s.mapPrevious(e))})),t(null,r)},e)},e.prototype.streamToFile=function(e,t,r){if(i.isThisNode()&&e){var n=c.createWriteStream(e,{flags:"a+"}),o=p.get(t);o.pipe(n).on("finish",function(e){r(null,t)}),o.on("error",function(e){r(new u.SDKError(e.message),null)})}else r(null,t)},e.prototype.getQuotaHistory=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e),i.apiWrapper(function(t){var n=e.limit,i=e.after;r._endpoints.billing.getServicePackageQuotaHistory(n,i,t)},function(e,t){var r;e&&e.data&&e.data.length&&(r=e.data.map(function(e){return o.mapQuotaHistory(e)})),t(null,new a.ListResponse(e,r))},t)},e.prototype.getQuotaRemaining=function(e){var t=this;return i.apiWrapper(function(e){t._endpoints.billing.getServicePackageQuota(e)},function(e,t){if(e)return t(null,e.quota)},e)},e}();r.BillingApi=d},{"../common/functions":41,"../common/listResponse":43,"../common/sdkError":45,"./endpoints":25,"./models/quotaHistoryAdapter":27,"./models/servicePackageAdapter":29,fs:88,superagent:93}],25:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/endpointsBase"),o=e("../_api/billing"),a=function(e){function t(t){var r=e.call(this)||this;return r.billing=new o.DefaultApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(i.EndpointsBase);r.Endpoints=a},{"../_api/billing":1,"../common/endpointsBase":40}],26:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){var t=this;Object.keys(e).forEach(function(r){t[r]=e[r]})}return e}();r.QuotaHistory=n},{}],27:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./quotaHistory"),i=e("./servicePackageAdapter");r.mapQuotaHistory=function(e){return new n.QuotaHistory({id:e.id,createdAt:e.added,delta:e.amount,accountId:null!==e.reservation?e.reservation.account_id:null,campaignName:null!==e.reservation?e.reservation.campaign_name:null,servicePackage:i.mapQuotaHistoryServicePackage(e.service_package),reason:e.reason})}},{"./quotaHistory":26,"./servicePackageAdapter":29}],28:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){var t=this;Object.keys(e).forEach(function(r){t[r]=e[r]})}return e}();r.ServicePackage=n},{}],29:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./servicePackage");r.mapActive=function(e){var t=i(e);return t.nextId=e.id,t.gracePeriod=e.grace_period,t.state="active",new n.ServicePackage(t)},r.mapPending=function(e){var t=i(e);return t.state="pending",new n.ServicePackage(t)},r.mapPrevious=function(e){var t=i(e);return t.endsAt=e.end_time,t.nextId=e.next_id,t.reason=e.reason,t.state="previous",new n.ServicePackage(t)},r.mapQuotaHistoryServicePackage=function(e){return new n.ServicePackage({expiresAt:e.expires,firmwareUpdateCount:e.firmware_update_count,id:e.id,previousId:e.previous_id,startsAt:e.start_time})};var i=function(e){return new n.ServicePackage({createdAt:e.created,expiresAt:e.expires,endsAt:null,gracePeriod:null,nextId:null,reason:null,firmwareUpdateCount:e.firmware_update_count,id:e.id,modifiedAt:e.modified,previousId:e.previous_id,startsAt:e.start_time})}},{"./servicePackage":28}],30:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../common/functions"),i=e("./endpoints"),o=e("./models/preSharedKeyAdapter"),a=e("../common/listResponse"),s=function(){function e(e){this._endpoints=new i.Endpoints(e)}return e.prototype.listPsks=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var n=e,i=n.limit,o=n.after;r._endpoints.bootstrap.listPreSharedKeys(i,o,t)},function(e,t){var n;e&&e.data&&e.data.length&&(n=e.data.map(function(e){return o.mapToSDK(e,r)})),t(null,new a.ListResponse(e,n))},t)},e.prototype.addPsk=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.bootstrap.uploadPreSharedKey(o.mapToSpec(e),t)},function(t,n){n(null,o.mapFrom(e,r))},t)},e.prototype.getPsk=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.bootstrap.getPreSharedKey(e,t)},function(e,t){t(null,o.mapToSDK(e,r))},t)},e.prototype.deletePsk=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.bootstrap.deletePreSharedKey(e,t)},function(e,t){t(null,null)},t)},e.prototype.getLastApiMetadata=function(e){var t=this;return n.asyncStyle(function(e){e(null,t._endpoints.getLastMeta())},e)},e}();r.BootstrapApi=s},{"../common/functions":41,"../common/listResponse":43,"./endpoints":31,"./models/preSharedKeyAdapter":33}],31:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/endpointsBase"),o=e("../_api/connector_bootstrap"),a=function(e){function t(t){var r=e.call(this)||this;return r.bootstrap=new o.PreSharedKeysApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(i.EndpointsBase);r.Endpoints=a},{"../_api/connector_bootstrap":2,"../common/endpointsBase":40}],32:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){var r=this;this._api=t,Object.keys(e).forEach(function(t){r[t]=e[t]})}return e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deletePsk(t.endpointName,e)},e)},e}();r.PreSharedKey=i},{"../../common/functions":41}],33:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=e("./preSharedKey");r.mapToSDK=function(e,t){return new n.PreSharedKey({endpointName:e.endpoint_name,createdAt:e.created_at,secretHex:null},t)},r.mapFrom=function(e,t){return new n.PreSharedKey({endpointName:e.endpointName,secretHex:e.secretHex},t)},r.mapToSpec=function(e){return{endpoint_name:e.endpointName,secret_hex:e.secretHex}}},{"./preSharedKey":32}],34:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../common/functions"),i=e("../common/listResponse"),o=e("./endpoints"),a=e("./models/certificateAdapter"),s=function(){function e(e){this._endpoints=new o.Endpoints(e)}return e.prototype.extendCertificate=function(e,t){var r=this;if(1===e.device_execution_mode)return void this._endpoints.connector.getDeveloperCertificate(e.id,"",function(n,i){if(n)return t(n,null);var o=a.CertificateAdapter.mapDeveloperCertificate(e,r,i);t(null,o)});var n=null;this._endpoints.serverCredentials.getAllServerCredentials("",function(i,o){if(i)return t(i,null);"bootstrap"===e.service&&(n=o.bootstrap),"lwm2m"===e.service&&(n=o.lwm2m);var s=a.CertificateAdapter.mapServerCertificate(e,r,n);t(null,s)})},e.prototype.listCertificates=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.after,s=i.order,u=i.include,c=i.filter,p=n.extractFilter(c,"type"),d="developer"===p?"bootstrap":p,l="developer"===p?1:null,f=n.extractFilter(c,"typeNeq"),m="developer"===f?0:1;r._endpoints.accountDeveloper.getAllCertificates(o,a,s,n.encodeInclude(u),n.extractFilter(c,"name"),d,n.extractFilter(c,"expires"),l,m,n.extractFilter(c,"ownerId"),n.extractFilter(c,"enrollmentMode"),n.extractFilter(c,"issuer"),n.extractFilter(c,"subject"),t)},function(e,t){var n;e.data&&e.data.length&&(n=e.data.map(function(e){return a.CertificateAdapter.mapCertificate(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getCertificate=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.accountDeveloper.getCertificate(e,t)},function(e,t){r.extendCertificate(e,t)},t)},e.prototype.addDeveloperCertificate=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.connector.createDeveloperCertificate("",a.CertificateAdapter.reverseDeveloperMap(e),t)},function(e,t){r._endpoints.accountDeveloper.getCertificate(e.id,function(n,i){if(n)return t(n,null);var o=a.CertificateAdapter.mapDeveloperCertificate(i,r,e);t(null,o)})},t)},e.prototype.addCertificate=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.admin.addCertificate(a.CertificateAdapter.reverseMap(e),t)},function(e,t){r.extendCertificate(e,t)},t)},e.prototype.updateCertificate=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.accountDeveloper.updateCertificate(e.id,a.CertificateAdapter.reverseUpdateMap(e),t)},function(e,t){r.extendCertificate(e,t)},t)},e.prototype.deleteCertificate=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.accountDeveloper.deleteCertificate(e,t)},function(e,t){t(null,e)},t)},e.prototype.getLastApiMetadata=function(e){var t=this;return n.asyncStyle(function(e){e(null,t._endpoints.getLastMeta())},e)},e}();r.CertificatesApi=s},{"../common/functions":41,"../common/listResponse":43,"./endpoints":35,"./models/certificateAdapter":37}],35:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/endpointsBase"),o=e("../_api/iam"),a=e("../_api/connector_ca"),s=function(e){function t(t){var r=e.call(this)||this;return r.accountDeveloper=new o.DeveloperApi(t,r.responseHandler.bind(r)),r.connector=new a.DeveloperCertificateApi(t,r.responseHandler.bind(r)),r.admin=new o.AccountAdminApi(t,r.responseHandler.bind(r)),r.serverCredentials=new a.ServerCredentialsApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(i.EndpointsBase);r.Endpoints=s},{"../_api/connector_ca":3,"../_api/iam":6,"../common/endpointsBase":40}],36:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t,this.enrollmentMode=!1;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.update=function(e,t){var r=this;return n.asyncStyle(function(t){r._api.updateCertificate({id:r.id,signature:e,type:r.type,status:r.status,certificateData:r.certificateData,name:r.name,description:r.description},t)},t)},e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteCertificate(t.id,e)},e)},e}();r.Certificate=i},{"../../common/functions":41}],37:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./certificate"),i=function(){function e(){}return e.map=function(e){return{id:e.id,name:e.name,description:e.description,type:1===e.device_execution_mode?"developer":e.service,status:e.status,accountId:e.account_id,certificateData:e.certificate,createdAt:e.created_at,issuer:e.issuer,subject:e.subject,validity:e.validity,ownerId:e.owner_id,enrollmentMode:e.enrollment_mode||!1,serverUri:null,serverCertificate:null,headerFile:null,developerCertificate:null,developerPrivateKey:null}},e.mapCertificate=function(t,r){return new n.Certificate(e.map(t),r)},e.mapServerCertificate=function(t,r,i){var o=e.map(t);return o.serverUri=i.url,o.serverCertificate=i.certificate,new n.Certificate(o,r)},e.mapDeveloperCertificate=function(t,r,i){var o=e.map(t);return o.headerFile=i.security_file_content,o.developerCertificate=i.developer_certificate,o.developerPrivateKey=i.developer_private_key,new n.Certificate(o,r)},e.reverseMap=function(e){return{certificate:e.certificateData,name:e.name,service:"developer"===e.type?"bootstrap":e.type,status:e.status,signature:e.signature,enrollment_mode:e.enrollmentMode,description:e.description}},e.reverseUpdateMap=function(e){return{certificate:e.certificateData,name:e.name,service:"developer"===e.type?"bootstrap":e.type,status:e.status,signature:e.signature,enrollment_mode:e.enrollmentMode,description:e.description}},e.reverseDeveloperMap=function(e){return{name:e.name,description:e.description}},e}();r.CertificateAdapter=i},{"./certificate":36}],38:[function(e,t,r){(function(t,n){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var i=e("superagent"),o=e("dotenv"),a=e("./sdkError"),s=e("../version"),u=e("./functions"),c=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/,p=/^application\/json(;.*)?$/i,d=/^text\/plain(;.*)?$/i,l=s.Version.isPublished?s.Version.version:s.Version.version+"+dev",f=s.Version.packageName+"-javascript / "+l,m=function(){function r(e,r){if(void 0===r&&(r=null),this.responseHandler=r,this.ENV_API_KEY="MBED_CLOUD_SDK_API_KEY",this.ENV_HOST="MBED_CLOUD_SDK_HOST",e=e||{},o&&"function"==typeof o.config&&o.config(),this.apiKey=e.apiKey||t&&t.env[this.ENV_API_KEY],this.host=e.host||t&&t.env[this.ENV_HOST]||"https://api.us-east-1.mbedcloud.com",!this.apiKey)throw new a.SDKError("no api key provided");"bearer"!==this.apiKey.substr(0,6).toLowerCase()&&(this.apiKey="Bearer "+this.apiKey)}return r.normalizeParams=function(e){var t={};for(var n in e)if(e.hasOwnProperty(n)&&void 0!==e[n]&&null!==e[n]){var i=e[n];this.isFileParam(i)||Array.isArray(i)?t[n]=i:t[n]=r.paramToString(i)}return t},r.isFileParam=function(t){return!!(u.isThisNode()&&e("fs")&&t instanceof e("fs").ReadStream)||("function"==typeof n&&t instanceof n||("function"==typeof Blob&&t instanceof Blob||"function"==typeof File&&t instanceof File))},r.paramToString=function(e){return void 0===e||null===e?"":e instanceof Date?e.toJSON():e.toString()},r.chooseType=function(e,t){if(void 0===t&&(t=null),!e.length)return t;var r=e[0]||t;return e.some(function(e){if(d.test(e))return r=e,!0}),r},r.debugLog=function(e,r){t&&t.env&&"superagent"===t.env.DEBUG&&(t.stdout.write("  [1m[35msuperagent[0m "+e.toUpperCase()+" "),console.log(r))},r.prototype.currentConfig=function(){return{apiKey:this.apiKey,host:this.host}},r.prototype.request=function(e,t){var n=this,o=e.requestOptions||{};o.timeout=o.timeout||6e4,o.method=o.method||e.method,o.query=o.query||r.normalizeParams(e.query),o.headers=o.headers||r.normalizeParams(e.headers),o.acceptHeader=o.acceptHeader||r.chooseType(e.acceptTypes),o.url=o.url||e.url.replace(/([:])?\/+/g,function(e,t){return t?e:"/"});var a=i(o.method,this.host+o.url);a.query(o.query),o.headers.Authorization=this.apiKey,u.isThisNode()&&(o.headers["User-Agent"]=f),a.set(o.headers),a.timeout(o.timeout),o.acceptHeader&&a.accept(o.acceptHeader);var s=null;if(Object.keys(e.formParams).length>0)if(e.useFormData){var c=r.normalizeParams(e.formParams);for(var d in c)c.hasOwnProperty(d)&&(r.isFileParam(c[d])?a.attach(d,c[d]):a.field(d,c[d]))}else o.contentType=o.contentType||"application/x-www-form-urlencoded",a.type(o.contentType),a.send(r.normalizeParams(e.formParams));else e.body&&(s=e.body,o.contentType=o.contentType||r.chooseType(e.contentTypes,"application/json"),a.type(o.contentType),s&&s.constructor==={}.constructor&&p.test(o.contentType)&&(s=Object.keys(s).reduce(function(e,t){return null!==s[t]&&void 0!==s[t]&&(e[t]=s[t]),e},{})),a.send(s));return s&&r.debugLog("body",s),a.end(function(e,r){n.complete(e,r,o.acceptHeader,t)}),a},r.prototype.complete=function(e,t,r,n){var i=null;if(e){var o=e.message,s=e,u="";t&&(t.error&&(o=t.error.message),t.body&&t.body.message&&(o=t.body.message,o.error&&(o=o.error)),s=t.error||e,u=t.body||t.text),i=new a.SDKError(o,s,u,e.status)}if(this.responseHandler&&this.responseHandler(i,t),n){var d=null;t&&!i&&(d=t.body||t.text),d&&d.constructor==={}.constructor&&p.test(r)&&(d=JSON.parse(JSON.stringify(d),function(e,t){return c.test(t)?new Date(t):t})),n(i,d)}},r}();r.ApiBase=m}).call(this,e("_process"),e("buffer").Buffer)},{"../version":87,"./functions":41,"./sdkError":45,_process:91,buffer:88,dotenv:88,fs:88,superagent:93}],39:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e,t,r,n,i){this.statusCode=e,this.errorMessage=t,r&&(this.headers=r,this.date=r.date?new Date(r.date):new Date,this.requestId=r["x-request-id"]),n&&(this.object=n.object,this.etag=n.etag),i&&(this.method=i.method,this.url=i.url)}return e}();r.ApiMetadata=n},{}],40:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./apiMetadata"),i=function(){function e(){}return e.prototype.responseHandler=function(e,t){var r=null,i=null,o=null,a=null,s=null;e&&(r=e.code,i=e.message,s=e.innerError),t&&(r=t.statusCode,o=t.headers,a=t.body||t.text,s=t.request||t.req),this.lastMeta=new n.ApiMetadata(r,i,o,a,s)},e.prototype.getLastMeta=function(){return this.lastMeta},e}();r.EndpointsBase=i},{"./apiMetadata":39}],41:[function(e,t,r){(function(t){"use strict";function n(e,t){if(!t)return new Promise(function(t,r){try{e(function(e,n){e?r(e):t(n)})}catch(e){r(new h.SDKError(e.message,e))}});try{e(t)}catch(e){t(new h.SDKError(e.message,e))}}function i(e,t,r,i){return void 0===i&&(i=!1),n(function(r){try{e(function(e,n){if(e)return i||404!==e.code?r(e):r(null,null);if(!t)return r(null,n);try{t(n,r)}catch(e){r(new h.SDKError(e.message,e))}})}catch(e){r(new h.SDKError(e.message,e))}},r)}function o(e){return"function"==typeof btoa?btoa(e):t.from(e).toString("base64")}function a(e,r){var n="";if(n="function"==typeof atob?atob(e):new t(e,"base64").toString("binary"),r&&r.indexOf("tlv")>-1)try{return _.decodeTlv(n)}catch(e){}return isNaN(n)?n:Number(n)}function s(e){return e&&e.length?e.map(c).join(","):null}function u(e){return e.replace(/(\_\w)/g,function(e){return e[1].toUpperCase()})}function c(e){return e.replace(/([A-Z]+?)/g,function(e){return"_"+e.toLowerCase()})}function p(e,t,r,n){if(void 0===r&&(r="$eq"),void 0===n&&(n=null),e&&e[t]){var i=e[t];if(i.constructor!=={}.constructor)return i;switch(r){case"$ne":if(i.$ne)return i.$ne;break;case"$gte":if(i.$gte)return i.$gte;break;case"$lte":if(i.$lte)return i.$lte;break;case"$in":if(i.$in)return i.$in;break;case"$nin":if(i.$nin)return i.$nin;break;default:if(i.$eq)return i.$eq}}return n}function d(e,t,r){function n(e,r,n,i){if(void 0===i&&(i=""),n instanceof Date&&(n=n.toISOString()),"boolean"==typeof n&&(n=n.toString()),i)i=c(i),i+="__";else{var o=t.from.indexOf(e);e=o>-1?t.to[o]:c(e)}var a=r.replace("$","");return"ne"===a&&(a="neq"),"eq"===a&&(a=""),a&&(a="__"+a),""+i+e+a+"="+n}return void 0===t&&(t={from:[],to:[]}),void 0===r&&(r=[]),e?Object.keys(e).map(function(t){return e[t].constructor!=={}.constructor?n(t,"",e[t]):Object.keys(e[t]).map(function(i){return r.indexOf(t)>-1?e[t][i].constructor!=={}.constructor?n(i,"",e[t][i],t):Object.keys(e[t][i]).map(function(r){return n(i,r,e[t][i][r],t)}).join("&"):n(t,i,e[t][i])}).join("&")}).join("&"):""}function l(e,t,r){function n(e){var r=t.to.indexOf(e);return r>-1?t.from[r]:u(e)}function i(e,t,r){t||(t="eq"),"neq"===t&&(t="ne"),t="$"+t,e[t]=r}void 0===t&&(t={from:[],to:[]}),void 0===r&&(r=[]);var o={};return e=decodeURIComponent(e),e.split("&").forEach(function(e){var t=e.match(/^(.+)=(.+)$/);if(t){var a=t[2],s=t[1].split("__"),u=n(s[0]);if(o[u]||(o[u]={}),r.indexOf(u)>-1){var c=s[1];return o[u][c]||(o[u][c]={}),void i(o[u][c],s[2],a)}i(o[u],s[1],a)}}),o}function f(e){return e instanceof Array?e:[e]}function m(e,t){return null!==t&&void 0!==t&&""!==t&&(null===e||void 0===e||""===e||"*"===e||(e.endsWith("*")?t.startsWith(e.slice(0,-1)):e===t))}function v(e){return e=new Date(e),e.getFullYear()+"-"+("0"+(e.getMonth()+1)).slice(-2)}function y(){return"undefined"==typeof window&&"function"==typeof e}/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var h=e("./sdkError"),_=e("./tlvDecoder");r.asyncStyle=n,r.apiWrapper=i,r.encodeBase64=o,r.decodeBase64=a,r.encodeInclude=s,r.snakeToCamel=u,r.camelToSnake=c,r.extractFilter=p,r.encodeFilter=d,r.decodeFilter=l,r.ensureArray=f,r.matchWithWildcard=m,r.dateToBillingMonth=v,r.isThisNode=y}).call(this,e("buffer").Buffer)},{"./sdkError":45,"./tlvDecoder":46,buffer:88}],42:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0}),r.generateId=function(){return""+Date.now()+Math.floor(1e4*Math.random())}},{}],43:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e,t){this.after=e.after,this.hasMore=e.has_more||e.hasMore,this.pageSize="limit"in e?e.limit:"pageSize"in e?e.pageSize:void 0,this.order=e.order,this.totalCount=e.total_count||e.totalCount||0,this.continuationMarker=e.continuation_marker||e.continuationMarker,this.data=t||[];this.limit=this.pageSize}return e}();r.ListResponse=n},{}],44:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./listResponse");r.executeForAll=function(e,t){var r=function(n){return e({after:n}).then(function(e){var n=e.data,i=e.hasMore,o=n.map(function(e){var r=e.id;return t(r)});return Promise.all(o).then(function(){return i?r(n[n.length-1].id):null})})};return r()};var i=function(){function e(e,t){this.maxResults=t?t.maxSize||t.limit||50:50,this.listOptions=Object.create(t||null);"pageSize"in this.listOptions&&(this.listOptions.limit=this.listOptions.pageSize),this.pageRequester=e,this.collectionTotalCount=void 0,this.reset()}return e.prototype.reset=function(){this.currentPageIndex=-1,this.currentElementIndex=-1,this.isFirstRequest=!0,this.currentPageData=null},e.prototype.setCurrentPage=function(e){this.currentPageData=e,this.currentPageIndex++},e.prototype.fetchNextPageCursor=function(e){return e&&0!==e.data.length?e.continuationMarker?e.continuationMarker:this.fetchIdOfLastElement(e):null},e.prototype.fetchIdOfLastElement=function(e){var t=e.data.slice(-1).pop();return""+(t.id||t)},e.prototype.hasNewPage=function(){return!(this.maxResults&&this.pageSize()*(this.currentPageIndex+1)>this.maxResults)&&(this.currentPageData?this.currentPageData.hasMore:this.isFirstRequest)},e.prototype.nextPage=function(){var e=this;if(this.hasNewPage()){this.currentElementIndex=-1;var t=this.currentPageIndex<0?null:this.fetchNextPageCursor(this.currentPageData),r=Object.create(this.listOptions||null);return r.after=t,this.pageRequester(r).then(function(t){return e.setCurrentPage(t),e.isFirstRequest=!1,t}).then(function(t){return t&&0!==t.data.length?new n.ListResponse(t,t.data.slice(0,e.remainingElementsNumber())):null}).catch(function(e){throw e})}return Promise.resolve(null)},e.prototype.totalCount=function(){var e=this;if(this.collectionTotalCount)return Promise.resolve(this.collectionTotalCount);if(this.currentPageData&&this.currentPageData.totalCount)return this.collectionTotalCount=this.currentPageData.totalCount,Promise.resolve(this.collectionTotalCount);var t=Object.create(this.listOptions||null);return t.include?t.include.push("totalCount"):t.include=["totalCount"],this.pageRequester(t).then(function(t){return e.collectionTotalCount=t?t.totalCount:void 0,e.collectionTotalCount}).catch(function(e){throw e})},e.prototype.pageSize=function(){return this.currentPageData?this.currentPageData.data.length:this.listOptions.limit},e.prototype.hasNext=function(){if(this.hasNewPage())return!0;var e=this.remainingElementsNumber();return this.currentElementIndex<e-1},e.prototype.remainingElementsNumber=function(){var e=this.maxResults?this.maxResults-this.pageSize()*this.currentPageIndex:this.pageSize();return e?e<0?0:e:null},e.prototype.fetchElementInPage=function(e,t,r,n){if(!e)return null;var i=t>r?r:t;return n&&(this.currentElementIndex=i),i<0||i>=e.data.length?null:e.data[i]},e.prototype.first=function(){return this.reset(),this.next()},e.prototype.next=function(){var e=this;if(this.currentElementIndex++,this.currentPageData){var t=this.fetchElementInPage(this.currentPageData,this.currentElementIndex,this.remainingElementsNumber(),!1);return t?Promise.resolve(t):this.nextPage().then(function(t){return t?e.next():null})}return this.nextPage().then(function(t){return t?e.next():null})},e.prototype.browseAndConcatenateAllPages=function(){var e=this;return this.hasNewPage()?this.nextPage().then(function(t){return e.browseAndConcatenateAllPages().then(function(e){return 0===t.data.length?e:t.data.concat(e)})}):Promise.resolve([])},e.prototype.executeOnAllElements=function(e){var t=this;return this.hasNext()?this.next().then(function(t){return e(t)}).then(function(){return t.executeOnAllElements(e)}):Promise.resolve()},e.prototype.executeForAll=function(e){return this.reset(),this.executeOnAllElements(e)},e.prototype.all=function(){return this.reset(),this.browseAndConcatenateAllPages()},e}();r.Paginator=i},{"./listResponse":43}],45:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=function(e){function t(t,r,n,i){var o=e.call(this,t)||this;return o.innerError=r,o.details=n,o.code=i,o}return n(t,e),t}(Error);r.SDKError=i},{}],46:[function(e,t,r){"use strict";function n(e){return(e&u)===u?2:1}function i(e){return(e&c)===l.ONE_BYTE?1:(e&c)===l.TWO_BYTE?2:(e&c)===l.TRE_BYTE?3:e&p}function o(e,t,r){if(void 0===t&&(t={}),void 0===r&&(r=""),!e||e.length<1)return t;var a=e[0],u=a&s,p=n(a),f=i(a),m=function(e){return String.fromCharCode(e)},v=function(e,t,r,n){return e+(t<<8*(n.length-r-1))},y=1,h=e.slice(y,y+p).reduce(v,0);y+=p;var _=f;if((a&c)!==l.OTR_BYTE&&(_=e.slice(y,y+f).reduce(v,0),y+=f),u===d.MULT_RESOURCE)o(e.slice(y,y+_),t,r+"/"+h);else{var g=e.slice(y,y+_),q=g.some(function(e){return 0===e}),E=q?g.reduce(v,0):g.map(m).join("");t[r+"/"+h]=E}return y+=_,o(e.slice(y),t,r),t}function a(e){return o(e.split("").map(function(e){return e.charCodeAt(0)}))}/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var s=parseInt("11000000",2),u=parseInt("00100000",2),c=parseInt("00011000",2),p=parseInt("00000111",2),d={OBJECT_INSTAN:parseInt("00000000",2),RESOURCE_INST:parseInt("01000000",2),MULT_RESOURCE:parseInt("10000000",2),RESOURCE_VALU:parseInt("11000000",2)},l={ONE_BYTE:parseInt("00001000",2),TWO_BYTE:parseInt("00010000",2),TRE_BYTE:parseInt("00011000",2),OTR_BYTE:parseInt("00000000",2)};r.decodeTlv=a},{}],47:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("events"),o=e("../common/listResponse"),a=e("../common/functions"),s=e("../common/sdkError"),u=e("./endpoints"),c=e("./models/webhookAdapter"),p=e("./models/presubscriptionAdapter"),d=e("./models/resourceAdapter"),l=e("./models/connectedDevice"),f=e("./models/deviceEventAdapter"),m=e("./models/metricAdapter"),v=e("../deviceDirectory/deviceDirectoryApi"),y=e("../common/idGenerator"),h=e("../common/pagination"),_=e("../subscribe/subscribe"),g=function(e){function t(t){var r=e.call(this)||this;return r._handleNotifications=!1,r._asyncFns={},r._notifyFns={},t=t||{},r._endpoints=new u.Endpoints(t),r._deviceDirectory=new v.DeviceDirectoryApi(t),r._handleNotifications=t.handleNotifications||!1,r.subscribe=new _.Subscribe(r),r}return n(t,e),Object.defineProperty(t.prototype,"handleNotifications",{get:function(){return this._handleNotifications},set:function(e){!0===e&&this.stopNotifications(),this._handleNotifications=e},enumerable:!0,configurable:!0}),t.prototype.normalizePath=function(e){return e&&"/"===e.charAt(0)?e.substr(1):e},t.prototype.reverseNormalizePath=function(e){return e&&"/"!==e.charAt(0)?"/"+e:e},t.prototype.handleAsync=function(e,r){if(e&&e[t.ASYNC_KEY])return void(this._asyncFns[e[t.ASYNC_KEY]]=r);r(null,e)},t.prototype.notify=function(e){var r=this;e&&(e.notifications&&e.notifications.forEach(function(e){var n=e.payload?a.decodeBase64(e.payload,e.ct):null,i=""+e.ep+e.path,o=r._notifyFns[i];o&&o(n),r.emit(t.EVENT_NOTIFICATION,{id:e.ep,path:e.path,payload:n}),r.subscribe.notifyResourceValues({deviceId:e.ep,path:e.path,payload:n,maxAge:e["max-age"],contentType:e.ct})}),e.registrations&&e.registrations.forEach(function(e){var n=f.DeviceEventAdapter.map(e,r,"registration");r.subscribe.notifyDeviceEvents(n),r.emit(t.EVENT_REGISTRATION,n)}),e["reg-updates"]&&e["reg-updates"].forEach(function(e){var n=f.DeviceEventAdapter.map(e,r,"reregistration");r.subscribe.notifyDeviceEvents(n),r.emit(t.EVENT_REREGISTRATION,n)}),e["de-registrations"]&&e["de-registrations"].forEach(function(e){var n=f.DeviceEventAdapter.mapId(e,"deregistration");r.subscribe.notifyDeviceEvents(n),r.emit(t.EVENT_DEREGISTRATION,e)}),e["registrations-expired"]&&e["registrations-expired"].forEach(function(e){var n=f.DeviceEventAdapter.mapId(e,"expired");r.subscribe.notifyDeviceEvents(n),r.emit(t.EVENT_EXPIRED,e)}),e["async-responses"]&&e["async-responses"].forEach(function(e){var t=e.id,n=r._asyncFns[t];if(n){if(e.status>=400){n(new s.SDKError(e.error||e.status,null,null,e.status),null)}else{var i=e.payload?a.decodeBase64(e.payload,e.ct):null;i?n(null,i):n(null,e)}delete r._asyncFns[t]}}))},t.prototype.startNotifications=function(e,r){var n=this;return e=e||{},"function"==typeof e&&(r=e,e={}),a.asyncStyle(function(r){function i(){d(),r(null,null)}if(n._handleNotifications||n._pollRequest)return r(null,null);n._pollRequest=!0;var o=e.interval,a=e.requestCallback,u=e.forceClear,c=0,p=0,d=function(){n._pollRequest=n._endpoints.notifications.longPollNotifications(function(e,r){if(e)return void(++p<=t.MAXIMUM_NUMBER_OF_RETRIES&&setTimeout(d,t.DELAY_BETWEEN_RETRIES));if(r["async-responses"]){var i=r["async-responses"].filter(function(e){return e.status>=400}),s=i.every(function(e){return e.status>=500});if(i.length>0&&s&&++c<=t.MAXIMUM_NUMBER_OF_RETRIES)return void setTimeout(d,t.DELAY_BETWEEN_RETRIES*c)}n.notify(r),a&&r["async-responses"]&&a(e,r["async-responses"]),c=0,p=0,setTimeout(d,o||500)})};if(u)return n.deleteWebhook(i);n.getWebhook(function(e,t){return e?r(e,null):t?r(new s.SDKError("Webhook already exists at "+t.url),null):void i()})},r)},t.prototype.stopNotifications=function(e){var t=this;return a.asyncStyle(function(e){t._endpoints.notifications.deleteLongPollChannel(function(){t._pollRequest&&(t._pollRequest.abort&&t._pollRequest.abort(),t._pollRequest=null),e(null,null)})},e)},t.prototype.getWebhook=function(e){var t=this;return a.asyncStyle(function(e){t._endpoints.notifications.getWebhook(function(t,r){if(t)return 404===t.code?e(null,null):e(t);var n=c.WebhookAdapter.map(r);e(null,n)})},e)},t.prototype.updateWebhook=function(e,t,r,n){var i=this;return t=t||{},r=r||!1,"function"==typeof r&&(n=r,r=!1),"function"==typeof t&&(n=t,t={}),a.asyncStyle(function(n){function o(){this._endpoints.notifications.registerWebhook({url:e,headers:t},function(e){if(e)return n(e);n(null,null)})}r?(i._handleNotifications=!0,i.stopNotifications(o.bind(i))):o.call(i)},n)},t.prototype.deleteWebhook=function(e){var t=this;return a.asyncStyle(function(e){t._endpoints.notifications.deregisterWebhook(function(){e(null,null)})},e)},t.prototype.listPresubscriptions=function(e){var t=this;return a.apiWrapper(function(e){t._endpoints.subscriptions.getPreSubscriptions(e)},function(e,t){t(null,e.map(p.PresubscriptionAdapter.map))},e)},t.prototype.updatePresubscriptions=function(e,t){var r=this;return a.apiWrapper(function(t){var n=e.map(p.PresubscriptionAdapter.reverseMap);r._endpoints.subscriptions.updatePreSubscriptions(n,t)},function(e,t){t(null,e)},t)},t.prototype.deletePresubscriptions=function(e){var t=this;return a.apiWrapper(function(e){t._endpoints.subscriptions.deletePreSubscriptions(e)},function(e,t){t(null,e)},e)},t.prototype.deleteSubscriptions=function(e){var t=this;return a.asyncStyle(function(e){h.executeForAll(t.listConnectedDevices.bind(t),t.deleteDeviceSubscriptions.bind(t)).then(function(){return e(null)},e)},e)},t.prototype.listConnectedDevices=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),e.filter=e.filter||{},e.filter.state="registered",a.apiWrapper(function(t){r._deviceDirectory.listDevices(e,t)},function(e,t){var n=e.data.map(function(e){return new l.ConnectedDevice(e,r)});t(null,new o.ListResponse(e,n))},t)},t.prototype.listDeviceSubscriptions=function(e,t){var r=this;return a.apiWrapper(function(t){r._endpoints.subscriptions.getEndpointSubscriptions(e,t)},function(e,t){t(null,e)},t)},t.prototype.deleteDeviceSubscriptions=function(e,t){var r=this;return a.apiWrapper(function(t){r._endpoints.subscriptions.deleteEndpointSubscriptions(e,t)},function(t,n){Object.keys(r._notifyFns).forEach(function(t){0===t.indexOf(e+"/")&&delete r._notifyFns[t]}),n(null,t)},t)},t.prototype.listResources=function(e,t){var r=this;return a.apiWrapper(function(t){r._endpoints.endpoints.getEndpointResources(e,t)},function(t,n){n(null,t.map(function(t){return d.ResourceAdapter.map(t,e,r)}))},t)},t.prototype.getResource=function(e,t,r){var n=this;return t=this.normalizePath(t),a.apiWrapper(function(t){n._endpoints.endpoints.getEndpointResources(e,t)},function(r,i){var o=r.find(function(e){return n.normalizePath(e.uri)===t});if(!o)return i(new s.SDKError("Resource not found"),null);i(null,d.ResourceAdapter.map(o,e,n))},r)},t.prototype.getResourceValue=function(e,t,r,n){var i=this;"function"==typeof r&&(n=r,r=null),t=this.reverseNormalizePath(t);var o=y.generateId();return a.apiWrapper(function(n){i._asyncFns[o]=n;var a=function(e){e&&(delete i._asyncFns[o],n(e,null))};i.startNotifications(null,function(n){if(n)return a(n);i._endpoints.deviceRequests.createAsyncRequest(e,o,{method:"GET",uri:t,accept:r},a)})},null,n)},t.prototype.setResourceValue=function(e,t,r,n,i){var o=this;"function"==typeof n&&(i=n,n=null),t=this.reverseNormalizePath(t);var s=y.generateId(),u=a.encodeBase64(r);return a.apiWrapper(function(r){o._asyncFns[s]=r;var i=function(e){e&&(delete o._asyncFns[s],r(e,null))};o.startNotifications(null,function(r){if(r)return i(r);o._endpoints.deviceRequests.createAsyncRequest(e,s,{method:"PUT",uri:t,"content-type":n,"payload-b64":u},i)})},null,i)},t.prototype.executeResource=function(e,t,r,n){var i=this;"function"==typeof r&&(n=r,r=null),t=this.reverseNormalizePath(t);var o=y.generateId();return a.apiWrapper(function(n){i._asyncFns[o]=n;var a=function(e){if(e)return delete i._asyncFns[o],n(e,null)};i.startNotifications(null,function(n){if(n)return a(n);i._endpoints.deviceRequests.createAsyncRequest(e,o,{method:"POST",uri:t,"content-type":r},a)})},null,n)},t.prototype.getResourceSubscription=function(e,t,r){var n=this;return t=this.normalizePath(t),a.asyncStyle(function(r){n._endpoints.subscriptions.checkResourceSubscription(e,t,function(e){return r(null,!e)})},r)},t.prototype.addResourceSubscription=function(e,t,r,n){var i=this;return t=this.normalizePath(t),a.apiWrapper(function(r){i.startNotifications(null,function(n){if(n)return r(n,null);i._endpoints.subscriptions.addResourceSubscription(e,t,r)})},function(n,o){r&&(i._notifyFns[e+"/"+t]=r),i.handleAsync(n,o)},n)},t.prototype.deleteResourceSubscription=function(e,t,r){var n=this;return t=this.normalizePath(t),a.apiWrapper(function(r){n.startNotifications(null,function(i){if(i)return r(i,null);n._endpoints.subscriptions.deleteResourceSubscription(e,t,r)})},function(r,i){delete n._notifyFns[e+"/"+t],i(null,null)},r)},t.prototype.listMetrics=function(e,t){var r=this;return a.apiWrapper(function(t){var n=e,i=n.limit,o=n.after,a=n.order,s=n.include,u=n.interval,c=null,p=null,d=null;!function(e){return void 0!==e.period}(e)?(c=e.start,p=e.end):d=m.MetricAdapter.mapTimePeriod(e.period),r._endpoints.statistics.v3MetricsGet(m.MetricAdapter.mapIncludes(s),m.MetricAdapter.mapTimePeriod(u),c,p,d,i,o,a,t)},function(e,t){var r=[];e.data&&e.data.length&&(r=e.data.map(function(e){return m.MetricAdapter.map(e)})),t(null,new o.ListResponse(e,r))},t)},t.prototype.getLastApiMetadata=function(e){var t=this;return a.asyncStyle(function(e){e(null,t._endpoints.getLastMeta())},e)},t.EVENT_NOTIFICATION="notification",t.EVENT_REGISTRATION="registration",t.EVENT_REREGISTRATION="reregistration",t.EVENT_DEREGISTRATION="deregistration",t.EVENT_EXPIRED="expired",t.ASYNC_KEY="async-response-id",t.DELAY_BETWEEN_RETRIES=1e3,t.MAXIMUM_NUMBER_OF_RETRIES=3,t}(i.EventEmitter);r.ConnectApi=g},{"../common/functions":41,"../common/idGenerator":42,"../common/listResponse":43,"../common/pagination":44,"../common/sdkError":45,"../deviceDirectory/deviceDirectoryApi":58,"../subscribe/subscribe":75,"./endpoints":48,"./models/connectedDevice":49,"./models/deviceEventAdapter":50,"./models/metricAdapter":52,"./models/presubscriptionAdapter":53,"./models/resourceAdapter":55,"./models/webhookAdapter":57,events:90}],48:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../_api/statistics"),o=e("../common/endpointsBase"),a=e("../_api/mds"),s=function(e){function t(t){var r=e.call(this)||this;return r.endpoints=new a.EndpointsApi(t,r.responseHandler.bind(r)),r.deviceRequests=new a.DeviceRequestsApi(t,r.responseHandler.bind(r)),r.notifications=new a.NotificationsApi(t,r.responseHandler.bind(r)),r.resources=new a.ResourcesApi(t,r.responseHandler.bind(r)),r.subscriptions=new a.SubscriptionsApi(t,r.responseHandler.bind(r)),r.account=new i.AccountApi(t,r.responseHandler.bind(r)),r.statistics=new i.StatisticsApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(o.EndpointsBase);r.Endpoints=s},{"../_api/mds":7,"../_api/statistics":8,"../common/endpointsBase":40}],49:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../../common/functions"),o=e("../../deviceDirectory/models/device"),a=function(e){function t(t,r){var n=e.call(this)||this;n._connectApi=r;for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);return n}return n(t,e),t.prototype.listResources=function(e){var t=this;return i.asyncStyle(function(e){t._connectApi.listResources(t.id,e)},e)},t.prototype.getResource=function(e,t){var r=this;return i.asyncStyle(function(t){r._connectApi.getResource(r.id,e,t)},t)},t.prototype.listSubscriptions=function(e){var t=this;return i.asyncStyle(function(e){t._connectApi.listDeviceSubscriptions(t.id,e)},e)},t.prototype.deleteSubscriptions=function(e){var t=this;return i.asyncStyle(function(e){t._connectApi.deleteDeviceSubscriptions(t.id,e)},e)},t.prototype.getResourceValue=function(e,t,r){var n=this;return"function"==typeof t&&(r=t,t=null),i.asyncStyle(function(r){n._connectApi.getResourceValue(n.id,e,t,r)},r)},t.prototype.setResourceValue=function(e,t,r,n){var o=this;return"function"==typeof r&&(n=r,r=null),i.asyncStyle(function(n){o._connectApi.setResourceValue(o.id,e,t,r,n)},n)},t.prototype.executeResource=function(e,t,r){var n=this;return"function"==typeof t&&(r=t,t=null),i.asyncStyle(function(r){n._connectApi.executeResource(n.id,e,t,r)},r)},t.prototype.getResourceSubscription=function(e,t){var r=this;return i.asyncStyle(function(t){r._connectApi.getResourceSubscription(r.id,e,t)},t)},t.prototype.addResourceSubscription=function(e,t,r){var n=this;return i.asyncStyle(function(r){n._connectApi.addResourceSubscription(n.id,e,t,r)},r)},t.prototype.deleteResourceSubscription=function(e,t){var r=this;return i.asyncStyle(function(t){r._connectApi.deleteResourceSubscription(r.id,e,t)},t)},t}(o.Device);r.ConnectedDevice=a},{"../../common/functions":41,"../../deviceDirectory/models/device":61}],50:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./resource"),i=function(){function e(){}return e.mapResource=function(e,t,r){return new n.Resource({contentType:e.ct,observable:e.obs,type:e.rt,path:e.path,deviceId:t},r)},e.map=function(t,r,n){var i=[];return t&&t.resources&&(i=t.resources.map(function(n){return e.mapResource(n,t.ep,r)})),{id:t.ep,type:t.ept,queueMode:t.q,resources:i,event:n}},e.mapId=function(e,t){return{id:e,event:t}},e}();r.DeviceEventAdapter=i},{"./resource":54}],51:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t])}return e}();r.Metric=n},{}],52:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./metric"),i=function(){function e(){}return e.map=function(e){return new n.Metric({id:e.id,timestamp:e.timestamp,handshakes:e.handshakes_successful,transactions:e.transactions,observations:e.device_observations,successfulApiCalls:e.connect_rest_api_success,failedApiCalls:e.connect_rest_api_error,successfulProxyRequests:e.device_proxy_request_success,failedProxyRequests:e.device_proxy_request_error,successfulSubscriptionRequests:e.device_subscription_request_success,failedSubscriptionRequests:e.device_subscription_request_error,successfulBootstraps:e.bootstraps_successful,failedBootstraps:e.bootstraps_failed,pendingBootstraps:e.bootstraps_pending,fullRegistrations:e.full_registrations,updatedRegistrations:e.registration_updates,expiredRegistrations:e.expired_registrations,deletedRegistrations:e.deleted_registrations})},e.mapIncludes=function(e){var t=[],r=["handshakes","transactions","observations","successfulApiCalls","failedApiCalls","successfulProxyRequests","failedProxyRequests","successfulSubscriptionRequests","failedSubscriptionRequests","successfulBootstraps","failedBootstraps","pendingBootstraps","fullRegistrations","updatedRegistrations","expiredRegistrations","deletedRegistrations"],n=["handshakes_successful","transactions","device_observations","connect_rest_api_success","connect_rest_api_error","device_proxy_request_success","device_proxy_request_error","device_subscription_request_success","device_subscription_request_error","bootstraps_successful","bootstraps_failed","bootstraps_pending","full_registrations","registration_updates","expired_registrations","deleted_registrations"];return e&&e.forEach(function(e){var i=r.indexOf(e);i>=0&&t.push(n[i])}),0===t.length&&(t=n),t.join(",")},e.mapTimePeriod=function(t){if(!t)return e.DEFAULT_TIME_PERIOD;var r=t.unit[0];return""+t.duration+r},e.DEFAULT_TIME_PERIOD="1d",e}();r.MetricAdapter=i},{"./metric":51}],53:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(){}return e.map=function(e){return{deviceId:e["endpoint-name"],deviceType:e["endpoint-type"],resourcePaths:e["resource-path"]}},e.reverseMap=function(e){return{"endpoint-name":e.deviceId,"endpoint-type":e.deviceType,"resource-path":e.resourcePaths}},e}();r.PresubscriptionAdapter=n},{}],54:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("events"),o=e("../../common/functions"),a=function(e){function t(r,n){var i=e.call(this)||this;i._api=n;for(var o in r)r.hasOwnProperty(o)&&(i[o]=r[o]);return i.on("newListener",function(e){e===t.EVENT_NOTIFICATION&&i.addSubscription(function(e){return i.emit(t.EVENT_NOTIFICATION,e)})}),i.on("removeListener",function(e){e===t.EVENT_NOTIFICATION&&0===i.listenerCount(t.EVENT_NOTIFICATION)&&i.deleteSubscription()}),i}return n(t,e),t.prototype.addSubscription=function(e,t){var r=this;return o.asyncStyle(function(t){if(!r.observable)return t(null,null);r._api.addResourceSubscription(r.deviceId,r.path,e,t)},t)},t.prototype.deleteSubscription=function(e){var t=this;return o.asyncStyle(function(e){t._api.deleteResourceSubscription(t.deviceId,t.path,e)},e)},t.prototype.getValue=function(e,t){var r=this;return"function"==typeof e&&(t=e,e=null),o.asyncStyle(function(t){r._api.getResourceValue(r.deviceId,r.path,e,t)},t)},t.prototype.setValue=function(e,t,r){var n=this;return"function"==typeof t&&(r=t,t=null),o.asyncStyle(function(r){n._api.setResourceValue(n.deviceId,n.path,e,t,r)},r)},t.prototype.execute=function(e,t){var r=this;return"function"==typeof e&&(t=e,e=null),o.asyncStyle(function(t){r._api.executeResource(r.deviceId,r.path,e,t)},t)},t.prototype.getSubscription=function(e){var t=this;return o.asyncStyle(function(e){if(!t.observable)return e(null,!1);t._api.getResourceSubscription(t.deviceId,t.path,e)},e)},t.EVENT_NOTIFICATION="notification",t}(i.EventEmitter);r.Resource=a},{"../../common/functions":41,events:90}],55:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./resource"),i=function(){function e(){}return e.map=function(e,t,r){return new n.Resource({contentType:e.type,observable:e.obs,type:e.rt,path:e.uri,deviceId:t},r)},e}();r.ResourceAdapter=i},{"./resource":54}],56:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t])}return e}();r.Webhook=n},{}],57:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./webhook"),i=function(){function e(){}return e.map=function(e){return new n.Webhook({url:e.url,headers:e.headers})},e}();r.WebhookAdapter=i},{"./webhook":56}],58:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../common/functions"),i=e("../common/listResponse"),o=e("./models/deviceAdapter"),a=e("./models/queryAdapter"),s=e("./models/deviceEventAdapter"),u=e("./endpoints"),c=e("./filters"),p=function(){function e(e){this._endpoints=new u.Endpoints(e)}return e.prototype.listDevices=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e.limit,o=e.after,a=e.order,s=e.include,u=e.filter;r._endpoints.directory.deviceList(i,a,o,n.encodeFilter(u,c.Filters.DEVICE_FILTER_MAP,c.Filters.NESTED_FILTERS),n.encodeInclude(s),t)},function(e,t){var n=e.data.map(function(e){return o.DeviceAdapter.map(e,r)});t(null,new i.ListResponse(e,n))},t)},e.prototype.getDevice=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceRetrieve(e,t)},function(e,t){t(null,o.DeviceAdapter.map(e,r))},t)},e.prototype.addDevice=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceCreate(o.DeviceAdapter.addMap(e),t)},function(e,t){t(null,o.DeviceAdapter.map(e,r))},t)},e.prototype.updateDevice=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceUpdate(e.id,o.DeviceAdapter.updateMap(e),t)},function(e,t){t(null,o.DeviceAdapter.map(e,r))},t)},e.prototype.deleteDevice=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceDestroy(e,t)},function(e,t){t(null,e)},t)},e.prototype.listQueries=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e.limit,o=e.order,a=e.after,s=e.include,u=e.filter;r._endpoints.directory.deviceQueryList(i,o,a,n.encodeFilter(u,c.Filters.EMPTY_FILTER_MAP),n.encodeInclude(s),t)},function(e,t){var n;e.data&&e.data.length&&(n=e.data.map(function(e){return a.QueryAdapter.map(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getQuery=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceQueryRetrieve(e,t)},function(e,t){t(null,a.QueryAdapter.map(e,r))},t)},e.prototype.addQuery=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceQueryCreate(a.QueryAdapter.addMap(e),t)},function(e,t){t(null,a.QueryAdapter.map(e,r))},t)},e.prototype.updateQuery=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceQueryUpdate(e.id,a.QueryAdapter.updateMap(e),t)},function(e,t){t(null,a.QueryAdapter.map(e,r))},t)},e.prototype.deleteQuery=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceQueryDestroy(e,t)},function(e,t){t(null,e)},t)},e.prototype.listDeviceEvents=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.order,s=i.after,u=i.include,p=i.filter;r._endpoints.directory.deviceLogList(o,a,s,n.encodeFilter(p,c.Filters.DEVICE_EVENT_FILTER_MAP),n.encodeInclude(u),t)},function(e,t){var r;e.data&&e.data.length&&(r=e.data.map(function(e){return s.DeviceEventAdapter.map(e)})),t(null,new i.ListResponse(e,r))},t)},e.prototype.getDeviceEvent=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.directory.deviceLogRetrieve(e,t)},function(e,t){t(null,s.DeviceEventAdapter.map(e))},t)},e.prototype.getLastApiMetadata=function(e){var t=this;return n.asyncStyle(function(e){e(null,t._endpoints.getLastMeta())},e)},e}();r.DeviceDirectoryApi=p},{"../common/functions":41,"../common/listResponse":43,"./endpoints":59,"./filters":60,"./models/deviceAdapter":62,"./models/deviceEventAdapter":64,"./models/queryAdapter":66}],59:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../_api/device_directory"),o=e("../common/endpointsBase"),a=function(e){function t(t){var r=e.call(this)||this;return r.directory=new i.DefaultApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(o.EndpointsBase);r.Endpoints=a},{"../_api/device_directory":4,"../common/endpointsBase":40}],60:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(){}return e.NESTED_FILTERS=["customAttributes"],e.DEVICE_FILTER_MAP={from:["alias","bootstrapCertificateExpiration","certificateFingerprint","certificateIssuerId","connectorCertificateExpiration","deviceType"],to:["endpoint_name","bootstrap_expiration_date","device_key","ca_id","connector_expiration_date","endpoint_type"]},e.DEVICE_EVENT_FILTER_MAP={from:["eventDate","type"],to:["date_time","event_type"]},e.EMPTY_FILTER_MAP={from:[],to:[]},e}();r.Filters=n},{}],61:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.update=function(e){var t=this;return n.asyncStyle(function(e){t._api.updateDevice(t,e)},e)},e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteDevice(t.id,e)},e)},e}();r.Device=i},{"../../common/functions":41}],62:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./device"),i=function(){function e(){}return e.map=function(e,t){return new n.Device({accountId:e.account_id,bootstrappedTimestamp:e.bootstrapped_timestamp,createdAt:e.created_at,customAttributes:e.custom_attributes,description:e.description,deviceClass:e.device_class,id:e.id,mechanism:e.mechanism,mechanismUrl:e.mechanism_url,name:e.name,serialNumber:e.serial_number,state:e.state,updatedAt:e.updated_at,vendorId:e.vendor_id,alias:e.endpoint_name,bootstrapCertificateExpiration:e.bootstrap_expiration_date,certificateFingerprint:e.device_key,certificateIssuerId:e.ca_id,connectorCertificateExpiration:e.connector_expiration_date,deviceExecutionMode:e.device_execution_mode,firmwareChecksum:e.firmware_checksum,manifestTimestamp:e.manifest_timestamp,hostGateway:e.host_gateway,deviceType:e.endpoint_type,claimedAt:e.enrolment_list_timestamp},t)},e.addMap=function(e){return{name:e.name,vendor_id:e.vendorId,custom_attributes:e.customAttributes,mechanism:e.mechanism,device_class:e.deviceClass,mechanism_url:e.mechanismUrl,serial_number:e.serialNumber,description:e.description,bootstrap_expiration_date:e.bootstrapCertificateExpiration,bootstrapped_timestamp:e.bootstrappedTimestamp,ca_id:e.certificateIssuerId,connector_expiration_date:e.connectorCertificateExpiration,device_execution_mode:e.deviceExecutionMode,device_key:e.certificateFingerprint,endpoint_name:e.alias,firmware_checksum:e.firmwareChecksum,state:e.state,host_gateway:e.hostGateway,endpoint_type:e.deviceType}},e.updateMap=function(e){return{name:e.name,custom_attributes:e.customAttributes,description:e.description,ca_id:e.certificateIssuerId,device_key:e.certificateFingerprint,endpoint_name:e.alias,host_gateway:e.hostGateway,endpoint_type:e.deviceType}},e}();r.DeviceAdapter=i},{"./device":61}],63:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t])}return e}();r.DeviceEvent=n},{}],64:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./deviceEvent"),i=function(){function e(){}return e.map=function(e){return new n.DeviceEvent({id:e.id,eventDate:e.date_time,stateChanged:e.state_change,description:e.description,changes:e.changes,typeDescription:e.event_type_description,type:e.event_type,data:e.data,deviceId:e.device_id})},e}();r.DeviceEventAdapter=i},{"./deviceEvent":63}],65:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.update=function(e){var t=this;return n.asyncStyle(function(e){t._api.updateQuery(t,e)},e)},e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteQuery(t.id,e)},e)},e}();r.Query=i},{"../../common/functions":41}],66:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=e("../filters"),o=e("./query"),a=function(){function e(){}return e.map=function(e,t){return new o.Query({filter:n.decodeFilter(e.query,i.Filters.DEVICE_FILTER_MAP,i.Filters.NESTED_FILTERS),createdAt:e.created_at,id:e.id,name:e.name,updatedAt:e.updated_at},t)},e.addMap=function(e){return{name:e.name,query:n.encodeFilter(e.filter,i.Filters.DEVICE_FILTER_MAP,i.Filters.NESTED_FILTERS)||null}},e.updateMap=function(e){return{name:e.name,query:n.encodeFilter(e.filter,i.Filters.DEVICE_FILTER_MAP,i.Filters.NESTED_FILTERS)||null}},e}();r.QueryAdapter=a},{"../../common/functions":41,"../filters":60,"./query":65}],67:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../common/endpointsBase"),o=e("../_api/enrollment"),a=function(e){function t(t){var r=e.call(this)||this;return r.enrollment=new o.PublicAPIApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(i.EndpointsBase);r.Endpoints=a},{"../_api/enrollment":5,"../common/endpointsBase":40}],68:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../common/functions"),i=e("./endpoints"),o=e("../common/listResponse"),a=e("./models/enrollmentClaimAdapter"),s=function(){function e(e){this._endpoints=new i.Endpoints(e)}return e.prototype.addEnrollmentClaim=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.enrollment.createDeviceEnrollment(a.addMap(e),t)},function(e,t){t(null,a.map(e,r))},t)},e.prototype.getEnrollmentClaim=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.enrollment.getDeviceEnrollment(e,t)},function(e,t){t(null,a.map(e,r))},t)},e.prototype.listEnrollmentClaims=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e),n.apiWrapper(function(t){var i=e.limit,o=e.after,a=e.order,s=e.include;r._endpoints.enrollment.getDeviceEnrollments(i,a,o,n.encodeInclude(s),t)},function(e,t){var n=e.data.map(function(e){return a.map(e,r)});t(null,new o.ListResponse(e,n))},t)},e.prototype.deleteEnrollmentClaim=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.enrollment.deleteDeviceEnrollment(e,t)},function(e,t){t(null,e)},t)},e.prototype.getLastApiMetadata=function(e){var t=this;return n.asyncStyle(function(e){e(null,t._endpoints.getLastMeta())},e)},e}();r.EnrollmentApi=s},{"../common/functions":41,"../common/listResponse":43,"./endpoints":67,"./models/enrollmentClaimAdapter":70}],69:[function(e,t,r){"use strict";/*
	 * Mbed Cloud JavaScript SDK
	 * Copyright Arm Limited 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){var r=this;this._api=t,Object.keys(e).forEach(function(t){r[t]=e[t]})}return e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteEnrollmentClaim(t.id,e)},e)},e}();r.EnrollmentClaim=i},{"../../common/functions":41}],70:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=e("./enrollmentClaim");r.map=function(e,t){return new n.EnrollmentClaim({accountId:e.account_id,claimId:e.enrollment_identity,createdAt:e.created_at,deviceId:e.enrolled_device_id,expiresAt:e.expires_at,id:e.id},t)},r.addMap=function(e){return{enrollment_identity:e.claimId}}},{"./enrollmentClaim":69}],71:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./accountManagement/accountManagementApi");r.AccountManagementApi=n.AccountManagementApi;var i=e("./billing/billingApi");r.BillingApi=i.BillingApi;var o=e("./bootstrap/bootstrapApi");r.BootstrapApi=o.BootstrapApi;var a=e("./certificates/certificatesApi");r.CertificatesApi=a.CertificatesApi;var s=e("./connect/connectApi");r.ConnectApi=s.ConnectApi;var u=e("./deviceDirectory/deviceDirectoryApi");r.DeviceDirectoryApi=u.DeviceDirectoryApi;var c=e("./enrollment/enrollmentApi");r.EnrollmentApi=c.EnrollmentApi;var p=e("./update/updateApi");r.UpdateApi=p.UpdateApi},{"./accountManagement/accountManagementApi":10,"./billing/billingApi":24,"./bootstrap/bootstrapApi":30,"./certificates/certificatesApi":34,"./connect/connectApi":47,"./deviceDirectory/deviceDirectoryApi":58,"./enrollment/enrollmentApi":68,"./update/updateApi":86}],72:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("./observer"),o=e("../../common/functions"),a=function(e){function t(t){var r=e.call(this)||this;return r._subscribed=!0,t&&(r.filter=t),r}return n(t,e),t.prototype.filterFunc=function(e){if(this.filter)for(var t in this.filter)if(-1===o.ensureArray(this.filter[t]).indexOf(e[t]))return!1;return!0},t.prototype.notify=function(t){this._subscribed&&this.filterFunc(t)&&e.prototype.notify.call(this,t)},t.prototype.unsubscribe=function(){this._subscribed=!1,e.prototype.clearListeners.call(this)},t}(i.Observer);r.DeviceStateObserver=a},{"../../common/functions":41,"./observer":73}],73:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(){this.subscribed=!0,this.notificationQueue=new Array,this.callbacks=new Array,this._waiting=new Array,this.filters=new Array}return e.prototype.notify=function(e){this.runLocalFilter(e)&&(this._notifyCallbacks(e),this._waiting.length>0?this._waiting.shift()(e):this.notificationQueue.push(e))},e.prototype.once=function(e){var t=this;if(this.notificationQueue.length>0){var r=this.notificationQueue.shift();if(!e)return new Promise(function(e,t){e(r)});e(r)}else{if(!e){return new Promise(function(e,r){var n=function(t){e(t)};t._waiting.push(n)})}this._waiting.push(e)}},e.prototype.addListener=function(e){return this.callbacks.push(e),this},e.prototype.removeListener=function(e){var t=this.callbacks.indexOf(e,0);return t>-1&&this.callbacks.splice(t,1),this},e.prototype.clearListeners=function(){return this.callbacks=new Array,this},e.prototype.listeners=function(){return this.callbacks},e.prototype.getNotificationQueue=function(){return this.notificationQueue},e.prototype.addLocalFilter=function(e){return this.filters.push(e),this},e.prototype.runLocalFilter=function(e){return!(this.filters.length>0)||this.filters.some(function(t){return t(e)})},e.prototype._notifyCallbacks=function(e){this.callbacks.forEach(function(t){return t(e)})},e}();r.Observer=n},{}],74:[function(e,t,r){"use strict";var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("./observer"),o=e("../../common/functions"),a=function(e){function t(t,r,n){void 0===n&&(n="OnValueUpdate");var i=e.call(this)||this;return i._subscribed=!0,i.firstValue=n,i.localPresubscriptions=new Array,r&&(i.connect=r),t&&(i.filter=t,o.ensureArray(i.filter.deviceId).forEach(function(e){i.localPresubscriptions.push({deviceId:e,resourcePaths:i.filter.resourcePaths||new Array})}),i.syncPresubscriptions()),i}return n(t,e),t.prototype.notify=function(t){this._subscribed&&(0===this.localPresubscriptions.length&&e.prototype.notify.call(this,t),this.compareData(t)&&e.prototype.notify.call(this,t))},t.prototype.unsubscribe=function(){this._subscribed=!1,e.prototype.clearListeners.call(this)},t.prototype.compareData=function(e){return this.localPresubscriptions.some(function(t){return o.matchWithWildcard(t.deviceId,e.deviceId)&&(0===t.resourcePaths.length||t.resourcePaths.some(function(t){return o.matchWithWildcard(t,e.path)}))})},t.prototype.syncPresubscriptions=function(){var e=this;this.connect&&(this.connect.listPresubscriptions().then(function(t){var r=e.localPresubscriptions.concat(t),n=r.filter(function(e,t,r){return t===r.indexOf(e)});e.connect.updatePresubscriptions(n)}),"OnValueUpdate"===this.firstValue&&this.localPresubscriptions.forEach(function(t){e.connect.listConnectedDevices().then(function(r){r.data.filter(function(e){return o.matchWithWildcard(e.id,t.deviceId)}).forEach(function(r){r.listResources().then(function(n){n.forEach(function(n){(0===t.resourcePaths.length||t.resourcePaths.some(function(e){return o.matchWithWildcard(e,n.path)}))&&e.connect.addResourceSubscription(r.id,n.path)})})})})}))},t}(i.Observer);r.ResourceValuesObserver=a},{"../../common/functions":41,"./observer":73}],75:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./observers/deviceStateObserver"),i=e("./observers/resourceValuesObserver"),o=function(){function e(e){e&&(this.connect=e),this.deviceStateObservers=new Array,this.resourceValueObservers=new Array}return e.prototype.deviceStateChanges=function(e){var t=new n.DeviceStateObserver(e);return this.deviceStateObservers.push(t),this.startNotifications(),t},e.prototype.resourceValues=function(e,t){void 0===t&&(t="OnValueUpdate");var r=new i.ResourceValuesObserver(e,this.connect,t);return this.resourceValueObservers.push(r),this.startNotifications(),r},e.prototype.notifyDeviceEvents=function(e){this.deviceStateObservers.forEach(function(t){return t.notify(e)})},e.prototype.notifyResourceValues=function(e){this.resourceValueObservers.forEach(function(t){return t.notify(e)})},e.prototype.startNotifications=function(){this.connect&&(this.connect.handleNotifications||this.connect.startNotifications())},e}();r.Subscribe=o},{"./observers/deviceStateObserver":72,"./observers/resourceValuesObserver":74}],76:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	var n=this&&this.__extends||function(){var e=function(t,r){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(t,r)};return function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}();Object.defineProperty(r,"__esModule",{value:!0});var i=e("../_api/update_service"),o=e("../common/endpointsBase"),a=function(e){function t(t){var r=e.call(this)||this;return r.update=new i.DefaultApi(t,r.responseHandler.bind(r)),r}return n(t,e),t}(o.EndpointsBase);r.Endpoints=a},{"../_api/update_service":9,"../common/endpointsBase":40}],77:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(){}return e.CAMPAIGN_FILTER_MAP={from:["finishedAt","manifestId","manifestUrl","scheduledAt"],to:["finished","root_manifest_id","root_manifest_url","when"]},e.EMPTY_FILTER_MAP={from:[],to:[]},e}();r.Filters=n},{}],78:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.update=function(e){var t=this;return n.asyncStyle(function(e){t._api.updateCampaign(t,e)},e)},e.prototype.start=function(e){var t=this;return n.asyncStyle(function(e){t._api.startCampaign(t.id,e)},e)},e.prototype.stop=function(e){var t=this;return n.asyncStyle(function(e){t._api.stopCampaign(t.id,e)},e)},e.prototype.listDeviceStates=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.asyncStyle(function(t){r._api.listCampaignDeviceStates(r.id,e,t)},t)},e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteCampaign(t.id,e)},e)},e}();r.Campaign=i},{"../../common/functions":41}],79:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=e("../../deviceDirectory/filters"),o=e("./campaign"),a=function(){function e(){}return e.map=function(e,t){return new o.Campaign({deviceFilter:n.decodeFilter(e.device_filter,i.Filters.DEVICE_FILTER_MAP,i.Filters.NESTED_FILTERS),createdAt:e.created_at,description:e.description,finishedAt:e.finished,id:e.id,manifestId:e.root_manifest_id,manifestUrl:e.root_manifest_url,name:e.name,startedAt:e.started_at,state:e.state,phase:e.phase,scheduledAt:e.when,updatedAt:e.updated_at},t)},e.addMap=function(e){return{description:e.description,device_filter:n.encodeFilter(e.deviceFilter,i.Filters.DEVICE_FILTER_MAP,i.Filters.NESTED_FILTERS)||null,name:e.name,root_manifest_id:e.manifestId,state:e.state,when:e.scheduledAt,object:e.object}},e.updateMap=function(e){return{description:e.description,device_filter:n.encodeFilter(e.deviceFilter,i.Filters.DEVICE_FILTER_MAP,i.Filters.NESTED_FILTERS)||null,name:e.name,root_manifest_id:e.manifestId,state:e.state,when:e.scheduledAt,object:e.object}},e}();r.CampaignAdapter=a},{"../../common/functions":41,"../../deviceDirectory/filters":60,"./campaign":78}],80:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t])}return e}();r.CampaignDeviceState=n},{}],81:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./campaignDeviceState"),i=function(){function e(){}return e.map=function(e){return new n.CampaignDeviceState({id:e.id,deviceId:e.device_id,campaignId:e.campaign,state:e.deployment_state,name:e.name,description:e.description,createdAt:e.created_at,updatedAt:e.updated_at,mechanism:e.mechanism,mechanismUrl:e.mechanism_url})},e}();r.CampaignDeviceStateAdapter=i},{"./campaignDeviceState":80}],82:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteFirmwareImage(t.id,e)},e)},e}();r.FirmwareImage=i},{"../../common/functions":41}],83:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./firmwareImage"),i=function(){function e(){}return e.map=function(e,t){return new n.FirmwareImage({createdAt:e.created_at,url:e.datafile,datafileChecksum:e.datafile_checksum,datafileSize:e.datafile_size,description:e.description,id:e.id,name:e.name,updatedAt:e.updated_at},t)},e}();r.FirmwareImageAdapter=i},{"./firmwareImage":82}],84:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../../common/functions"),i=function(){function e(e,t){this._api=t;for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r])}return e.prototype.delete=function(e){var t=this;return n.asyncStyle(function(e){t._api.deleteFirmwareManifest(t.id,e)},e)},e}();r.FirmwareManifest=i},{"../../common/functions":41}],85:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("./firmwareManifest"),i=function(){function e(){}return e.map=function(e,t){return new n.FirmwareManifest({createdAt:e.created_at,url:e.datafile,datafileSize:e.datafile_size,keyTableUrl:e.key_table,description:e.description,deviceClass:e.device_class,id:e.id,name:e.name,timestamp:e.timestamp,updatedAt:e.updated_at},t)},e}();r.FirmwareManifestAdapter=i},{"./firmwareManifest":84}],86:[function(e,t,r){"use strict";/*
	* Mbed Cloud JavaScript SDK
	* Copyright Arm Limited 2017
	*
	* Licensed under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	*
	* Unless required by applicable law or agreed to in writing, software
	* distributed under the License is distributed on an "AS IS" BASIS,
	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	* See the License for the specific language governing permissions and
	* limitations under the License.
	*/
	Object.defineProperty(r,"__esModule",{value:!0});var n=e("../common/functions"),i=e("../common/listResponse"),o=e("./models/firmwareImageAdapter"),a=e("./models/firmwareManifestAdapter"),s=e("./models/campaignAdapter"),u=e("./models/campaignDeviceStateAdapter"),c=e("./endpoints"),p=e("./filters"),d=function(){function e(e){this._endpoints=new c.Endpoints(e)}return e.prototype.listFirmwareImages=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.order,s=i.after,u=i.include,c=i.filter;r._endpoints.update.firmwareImageList(o,a,s,n.encodeFilter(c,p.Filters.EMPTY_FILTER_MAP),n.encodeInclude(u),t)},function(e,t){var n;e.data&&e.data.length&&(n=e.data.map(function(e){return o.FirmwareImageAdapter.map(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getFirmwareImage=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.firmwareImageRetrieve(e,t)},function(e,t){t(null,o.FirmwareImageAdapter.map(e,r))},t)},e.prototype.addFirmwareImage=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.firmwareImageCreate(e.dataFile,e.name,e.description,t)},function(e,t){t(null,o.FirmwareImageAdapter.map(e,r))},t)},e.prototype.deleteFirmwareImage=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.firmwareImageDestroy(e,t)},function(e,t){t(null,e)},t)},e.prototype.listFirmwareManifests=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.order,s=i.after,u=i.include,c=i.filter;r._endpoints.update.firmwareManifestList(o,a,s,n.encodeFilter(c,p.Filters.EMPTY_FILTER_MAP),n.encodeInclude(u),t)},function(e,t){var n;e.data&&e.data.length&&(n=e.data.map(function(e){return a.FirmwareManifestAdapter.map(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getFirmwareManifest=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.firmwareManifestRetrieve(e,t)},function(e,t){t(null,a.FirmwareManifestAdapter.map(e,r))},t)},e.prototype.addFirmwareManifest=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.firmwareManifestCreate(e.dataFile,e.name,e.description,e.keyTableFile,t)},function(e,t){t(null,a.FirmwareManifestAdapter.map(e,r))},t)},e.prototype.deleteFirmwareManifest=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.firmwareManifestDestroy(e,t)},function(e,t){t(null,e)},t)},e.prototype.listCampaigns=function(e,t){var r=this;return e=e||{},"function"==typeof e&&(t=e,e={}),n.apiWrapper(function(t){var i=e,o=i.limit,a=i.order,s=i.after,u=i.include,c=i.filter;r._endpoints.update.updateCampaignList(o,a,s,n.encodeFilter(c,p.Filters.CAMPAIGN_FILTER_MAP),n.encodeInclude(u),t)},function(e,t){var n;e.data&&e.data.length&&(n=e.data.map(function(e){return s.CampaignAdapter.map(e,r)})),t(null,new i.ListResponse(e,n))},t)},e.prototype.getCampaign=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.updateCampaignRetrieve(e,t)},function(e,t){t(null,s.CampaignAdapter.map(e,r))},t)},e.prototype.addCampaign=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.updateCampaignCreate(s.CampaignAdapter.addMap(e),t)},function(e,t){t(null,s.CampaignAdapter.map(e,r))},t)},e.prototype.updateCampaign=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.updateCampaignUpdate(e.id,s.CampaignAdapter.updateMap(e),t)},function(e,t){t(null,s.CampaignAdapter.map(e,r))},t)},e.prototype.deleteCampaign=function(e,t){var r=this;return n.apiWrapper(function(t){r._endpoints.update.updateCampaignDestroy(e,t)},function(e,t){t(null,e)},t)},e.prototype.startCampaign=function(e,t){var r=this;return n.apiWrapper(function(t){r.updateCampaign({id:e,state:"scheduled"},t)},function(e,t){t(null,e)},t)},e.prototype.stopCampaign=function(e,t){var r=this;return n.apiWrapper(function(t){r.updateCampaign({id:e,state:"draft"},t)},function(e,t){t(null,e)},t)},e.prototype.listCampaignDeviceStates=function(e,t,r){var o=this;return t=t||{},"function"==typeof t&&(r=t,t={}),n.apiWrapper(function(r){var i=t.limit,a=t.order,s=t.after,u=t.include;o._endpoints.update.updateCampaignMetadataList(e,i,a,s,n.encodeInclude(u),r)},function(e,t){var r;e.data&&e.data.length&&(r=e.data.map(function(e){return u.CampaignDeviceStateAdapter.map(e)})),t(null,new i.ListResponse(e,r))},r)},e.prototype.getLastApiMetadata=function(e){var t=this;return n.asyncStyle(function(e){e(null,t._endpoints.getLastMeta())},e)},e}();r.UpdateApi=d},{"../common/functions":41,"../common/listResponse":43,"./endpoints":76,"./filters":77,"./models/campaignAdapter":79,"./models/campaignDeviceStateAdapter":81,"./models/firmwareImageAdapter":83,"./models/firmwareManifestAdapter":85}],87:[function(e,t,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(){function e(){}return e.packageName="mbed-cloud-sdk",e.version="1.0.0",e.commit="42069",e.testrunnerVersion="1.0.0",e.isPublished=!1,e}();r.Version=n},{}],88:[function(e,t,r){},{}],89:[function(e,t,r){function n(e){if(e)return i(e)}function i(e){for(var t in n.prototype)e[t]=n.prototype[t];return e}void 0!==t&&(t.exports=n),n.prototype.on=n.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this},n.prototype.once=function(e,t){function r(){this.off(e,r),t.apply(this,arguments)}return r.fn=t,this.on(e,r),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r=this._callbacks["$"+e];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+e],this;for(var n,i=0;i<r.length;i++)if((n=r[i])===t||n.fn===t){r.splice(i,1);break}return this},n.prototype.emit=function(e){this._callbacks=this._callbacks||{};var t=[].slice.call(arguments,1),r=this._callbacks["$"+e];if(r){r=r.slice(0);for(var n=0,i=r.length;n<i;++n)r[n].apply(this,t)}return this},n.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]},n.prototype.hasListeners=function(e){return!!this.listeners(e).length}},{}],90:[function(e,t,r){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(e){return"function"==typeof e}function o(e){return"number"==typeof e}function a(e){return"object"==typeof e&&null!==e}function s(e){return void 0===e}t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!o(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,r,n,o,u,c;if(this._events||(this._events={}),"error"===e&&(!this._events.error||a(this._events.error)&&!this._events.error.length)){if((t=arguments[1])instanceof Error)throw t;var p=new Error('Uncaught, unspecified "error" event. ('+t+")");throw p.context=t,p}if(r=this._events[e],s(r))return!1;if(i(r))switch(arguments.length){case 1:r.call(this);break;case 2:r.call(this,arguments[1]);break;case 3:r.call(this,arguments[1],arguments[2]);break;default:o=Array.prototype.slice.call(arguments,1),r.apply(this,o)}else if(a(r))for(o=Array.prototype.slice.call(arguments,1),c=r.slice(),n=c.length,u=0;u<n;u++)c[u].apply(this,o);return!0},n.prototype.addListener=function(e,t){var r;if(!i(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,i(t.listener)?t.listener:t),this._events[e]?a(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,a(this._events[e])&&!this._events[e].warned&&(r=s(this._maxListeners)?n.defaultMaxListeners:this._maxListeners)&&r>0&&this._events[e].length>r&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace()),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function r(){this.removeListener(e,r),n||(n=!0,t.apply(this,arguments))}if(!i(t))throw TypeError("listener must be a function");var n=!1;return r.listener=t,this.on(e,r),this},n.prototype.removeListener=function(e,t){var r,n,o,s;if(!i(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(r=this._events[e],o=r.length,n=-1,r===t||i(r.listener)&&r.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(a(r)){for(s=o;s-- >0;)if(r[s]===t||r[s].listener&&r[s].listener===t){n=s;break}if(n<0)return this;1===r.length?(r.length=0,delete this._events[e]):r.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,r;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(r=this._events[e],i(r))this.removeListener(e,r);else if(r)for(;r.length;)this.removeListener(e,r[r.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){return this._events&&this._events[e]?i(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(i(t))return 1;if(t)return t.length}return 0},n.listenerCount=function(e,t){return e.listenerCount(t)}},{}],91:[function(e,t,r){function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function o(e){if(d===setTimeout)return setTimeout(e,0);if((d===n||!d)&&setTimeout)return d=setTimeout,setTimeout(e,0);try{return d(e,0)}catch(t){try{return d.call(null,e,0)}catch(t){return d.call(this,e,0)}}}function a(e){if(l===clearTimeout)return clearTimeout(e);if((l===i||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(e);try{return l(e)}catch(t){try{return l.call(null,e)}catch(t){return l.call(this,e)}}}function s(){y&&m&&(y=!1,m.length?v=m.concat(v):h=-1,v.length&&u())}function u(){if(!y){var e=o(s);y=!0;for(var t=v.length;t;){for(m=v,v=[];++h<t;)m&&m[h].run();h=-1,t=v.length}m=null,y=!1,a(e)}}function c(e,t){this.fun=e,this.array=t}function p(){}var d,l,f=t.exports={};!function(){try{d="function"==typeof setTimeout?setTimeout:n}catch(e){d=n}try{l="function"==typeof clearTimeout?clearTimeout:i}catch(e){l=i}}();var m,v=[],y=!1,h=-1;f.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];v.push(new c(e,t)),1!==v.length||y||o(u)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=p,f.addListener=p,f.once=p,f.off=p,f.removeListener=p,f.removeAllListeners=p,f.emit=p,f.prependListener=p,f.prependOnceListener=p,f.listeners=function(e){return[]},f.binding=function(e){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(e){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},{}],92:[function(e,t,r){function n(){this._defaults=[]}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(function(e){n.prototype[e]=function(){return this._defaults.push({fn:e,arguments:arguments}),this}}),n.prototype._setDefaults=function(e){this._defaults.forEach(function(t){e[t.fn].apply(e,t.arguments)})},t.exports=n},{}],93:[function(e,t,r){function n(){}function i(e){if(!v(e))return e;var t=[];for(var r in e)o(t,r,e[r]);return t.join("&")}function o(e,t,r){if(null!=r)if(Array.isArray(r))r.forEach(function(r){o(e,t,r)});else if(v(r))for(var n in r)o(e,t+"["+n+"]",r[n]);else e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));else null===r&&e.push(encodeURIComponent(t))}function a(e){for(var t,r,n={},i=e.split("&"),o=0,a=i.length;o<a;++o)t=i[o],r=t.indexOf("="),-1==r?n[decodeURIComponent(t)]="":n[decodeURIComponent(t.slice(0,r))]=decodeURIComponent(t.slice(r+1));return n}function s(e){for(var t,r,n,i,o=e.split(/\r?\n/),a={},s=0,u=o.length;s<u;++s)r=o[s],-1!==(t=r.indexOf(":"))&&(n=r.slice(0,t).toLowerCase(),i=g(r.slice(t+1)),a[n]=i);return a}function u(e){return/[\/+]json($|[^-\w])/.test(e)}function c(e){this.req=e,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||void 0===this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;var t=this.xhr.status;1223===t&&(t=204),this._setStatusProperties(t),this.header=this.headers=s(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&e._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null}function p(e,t){var r=this;this._query=this._query||[],this.method=e,this.url=t,this.header={},this._header={},this.on("end",function(){var e=null,t=null;try{t=new c(r)}catch(t){return e=new Error("Parser is unable to parse the response"),e.parse=!0,e.original=t,r.xhr?(e.rawResponse=void 0===r.xhr.responseType?r.xhr.responseText:r.xhr.response,e.status=r.xhr.status?r.xhr.status:null,e.statusCode=e.status):(e.rawResponse=null,e.status=null),r.callback(e)}r.emit("response",t);var n;try{r._isResponseOK(t)||(n=new Error(t.statusText||"Unsuccessful HTTP response"))}catch(e){n=e}n?(n.original=e,n.response=t,n.status=t.status,r.callback(n,t)):r.callback(null,t)})}function d(e,t,r){var n=_("DELETE",e);return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n}var l;"undefined"!=typeof window?l=window:"undefined"!=typeof self?l=self:(console.warn("Using browser-only version of superagent in non-browser environment"),l=this);var f=e("component-emitter"),m=e("./request-base"),v=e("./is-object"),y=e("./response-base"),h=e("./agent-base"),_=r=t.exports=function(e,t){return"function"==typeof t?new r.Request("GET",e).end(t):1==arguments.length?new r.Request("GET",e):new r.Request(e,t)};r.Request=p,_.getXHR=function(){if(!(!l.XMLHttpRequest||l.location&&"file:"==l.location.protocol&&l.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}throw Error("Browser-only version of superagent could not find XHR")};var g="".trim?function(e){return e.trim()}:function(e){return e.replace(/(^\s*|\s*$)/g,"")};_.serializeObject=i,_.parseString=a,_.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},_.serialize={"application/x-www-form-urlencoded":i,"application/json":JSON.stringify},_.parse={"application/x-www-form-urlencoded":a,"application/json":JSON.parse},y(c.prototype),c.prototype._parseBody=function(e){var t=_.parse[this.type];return this.req._parser?this.req._parser(this,e):(!t&&u(this.type)&&(t=_.parse["application/json"]),t&&e&&(e.length||e instanceof Object)?t(e):null)},c.prototype.toError=function(){var e=this.req,t=e.method,r=e.url,n="cannot "+t+" "+r+" ("+this.status+")",i=new Error(n);return i.status=this.status,i.method=t,i.url=r,i},_.Response=c,f(p.prototype),m(p.prototype),p.prototype.type=function(e){return this.set("Content-Type",_.types[e]||e),this},p.prototype.accept=function(e){return this.set("Accept",_.types[e]||e),this},p.prototype.auth=function(e,t,r){1===arguments.length&&(t=""),"object"==typeof t&&null!==t&&(r=t,t=""),r||(r={type:"function"==typeof btoa?"basic":"auto"});var n=function(e){if("function"==typeof btoa)return btoa(e);throw new Error("Cannot use basic auth, btoa is not a function")};return this._auth(e,t,r,n)},p.prototype.query=function(e){return"string"!=typeof e&&(e=i(e)),e&&this._query.push(e),this},p.prototype.attach=function(e,t,r){if(t){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(e,t,r||t.name)}return this},p.prototype._getFormData=function(){return this._formData||(this._formData=new l.FormData),this._formData},p.prototype.callback=function(e,t){if(this._shouldRetry(e,t))return this._retry();var r=this._callback;this.clearTimeout(),e&&(this._maxRetries&&(e.retries=this._retries-1),this.emit("error",e)),r(e,t)},p.prototype.crossDomainError=function(){var e=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");e.crossDomain=!0,e.status=this.status,e.method=this.method,e.url=this.url,this.callback(e)},p.prototype.buffer=p.prototype.ca=p.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},p.prototype.pipe=p.prototype.write=function(){throw Error("Streaming is not supported in browser version of superagent")},p.prototype._isHost=function(e){return e&&"object"==typeof e&&!Array.isArray(e)&&"[object Object]"!==Object.prototype.toString.call(e)},p.prototype.end=function(e){return this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=e||n,this._finalizeQueryString(),this._end()},p.prototype._end=function(){var e=this,t=this.xhr=_.getXHR(),r=this._formData||this._data;this._setTimeouts(),t.onreadystatechange=function(){var r=t.readyState;if(r>=2&&e._responseTimeoutTimer&&clearTimeout(e._responseTimeoutTimer),4==r){var n;try{n=t.status}catch(e){n=0}if(!n){if(e.timedout||e._aborted)return;return e.crossDomainError()}e.emit("end")}};var n=function(t,r){r.total>0&&(r.percent=r.loaded/r.total*100),r.direction=t,e.emit("progress",r)};if(this.hasListeners("progress"))try{t.onprogress=n.bind(null,"download"),t.upload&&(t.upload.onprogress=n.bind(null,"upload"))}catch(e){}try{this.username&&this.password?t.open(this.method,this.url,!0,this.username,this.password):t.open(this.method,this.url,!0)}catch(e){return this.callback(e)}if(this._withCredentials&&(t.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof r&&!this._isHost(r)){var i=this._header["content-type"],o=this._serializer||_.serialize[i?i.split(";")[0]:""];!o&&u(i)&&(o=_.serialize["application/json"]),o&&(r=o(r))}for(var a in this.header)null!=this.header[a]&&this.header.hasOwnProperty(a)&&t.setRequestHeader(a,this.header[a]);return this._responseType&&(t.responseType=this._responseType),this.emit("request",this),t.send(void 0!==r?r:null),this},_.agent=function(){return new h},["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(function(e){h.prototype[e.toLowerCase()]=function(t,r){var n=new _.Request(e,t);return this._setDefaults(n),r&&n.end(r),n}}),h.prototype.del=h.prototype.delete,_.get=function(e,t,r){var n=_("GET",e);return"function"==typeof t&&(r=t,t=null),t&&n.query(t),r&&n.end(r),n},_.head=function(e,t,r){var n=_("HEAD",e);return"function"==typeof t&&(r=t,t=null),t&&n.query(t),r&&n.end(r),n},_.options=function(e,t,r){var n=_("OPTIONS",e);return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n},_.del=d,_.delete=d,_.patch=function(e,t,r){var n=_("PATCH",e);return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n},_.post=function(e,t,r){var n=_("POST",e);return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n},_.put=function(e,t,r){var n=_("PUT",e);return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n}},{"./agent-base":92,"./is-object":94,"./request-base":95,"./response-base":96,"component-emitter":89}],94:[function(e,t,r){"use strict";function n(e){return null!==e&&"object"==typeof e}t.exports=n},{}],95:[function(e,t,r){"use strict";function n(e){if(e)return i(e)}function i(e){for(var t in n.prototype)e[t]=n.prototype[t];return e}var o=e("./is-object");t.exports=n,n.prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},n.prototype.parse=function(e){return this._parser=e,this},n.prototype.responseType=function(e){return this._responseType=e,this},n.prototype.serialize=function(e){return this._serializer=e,this},n.prototype.timeout=function(e){if(!e||"object"!=typeof e)return this._timeout=e,this._responseTimeout=0,this;for(var t in e)switch(t){case"deadline":this._timeout=e.deadline;break;case"response":this._responseTimeout=e.response;break;default:console.warn("Unknown timeout option",t)}return this},n.prototype.retry=function(e,t){return 0!==arguments.length&&!0!==e||(e=1),e<=0&&(e=0),this._maxRetries=e,this._retries=0,this._retryCallback=t,this};var a=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];n.prototype._shouldRetry=function(e,t){if(!this._maxRetries||this._retries++>=this._maxRetries)return!1;if(this._retryCallback)try{var r=this._retryCallback(e,t);if(!0===r)return!0;if(!1===r)return!1}catch(e){console.error(e)}if(t&&t.status&&t.status>=500&&501!=t.status)return!0;if(e){if(e.code&&~a.indexOf(e.code))return!0;if(e.timeout&&"ECONNABORTED"==e.code)return!0;if(e.crossDomain)return!0}return!1},n.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},n.prototype.then=function(e,t){if(!this._fullfilledPromise){var r=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise(function(e,t){r.end(function(r,n){r?t(r):e(n)})})}return this._fullfilledPromise.then(e,t)},n.prototype.catch=function(e){return this.then(void 0,e)},n.prototype.use=function(e){return e(this),this},n.prototype.ok=function(e){if("function"!=typeof e)throw Error("Callback required");return this._okCallback=e,this},n.prototype._isResponseOK=function(e){return!!e&&(this._okCallback?this._okCallback(e):e.status>=200&&e.status<300)},n.prototype.get=function(e){return this._header[e.toLowerCase()]},n.prototype.getHeader=n.prototype.get,n.prototype.set=function(e,t){if(o(e)){for(var r in e)this.set(r,e[r]);return this}return this._header[e.toLowerCase()]=t,this.header[e]=t,this},n.prototype.unset=function(e){return delete this._header[e.toLowerCase()],delete this.header[e],this},n.prototype.field=function(e,t){if(null===e||void 0===e)throw new Error(".field(name, val) name can not be empty");if(this._data&&console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"),o(e)){for(var r in e)this.field(r,e[r]);return this}if(Array.isArray(t)){for(var n in t)this.field(e,t[n]);return this}if(null===t||void 0===t)throw new Error(".field(name, val) val can not be empty");return"boolean"==typeof t&&(t=""+t),this._getFormData().append(e,t),this},n.prototype.abort=function(){return this._aborted?this:(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort"),this)},n.prototype._auth=function(e,t,r,n){switch(r.type){case"basic":this.set("Authorization","Basic "+n(e+":"+t));break;case"auto":this.username=e,this.password=t;break;case"bearer":this.set("Authorization","Bearer "+e)}return this},n.prototype.withCredentials=function(e){return void 0==e&&(e=!0),this._withCredentials=e,this},n.prototype.redirects=function(e){return this._maxRedirects=e,this},n.prototype.maxResponseSize=function(e){if("number"!=typeof e)throw TypeError("Invalid argument");return this._maxResponseSize=e,this},n.prototype.toJSON=function(){return{method:this.method,url:this.url,data:this._data,headers:this._header}},n.prototype.send=function(e){var t=o(e),r=this._header["content-type"];if(this._formData&&console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"),t&&!this._data)Array.isArray(e)?this._data=[]:this._isHost(e)||(this._data={});else if(e&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(t&&o(this._data))for(var n in e)this._data[n]=e[n];else"string"==typeof e?(r||this.type("form"),r=this._header["content-type"],this._data="application/x-www-form-urlencoded"==r?this._data?this._data+"&"+e:e:(this._data||"")+e):this._data=e;return!t||this._isHost(e)?this:(r||this.type("json"),this)},n.prototype.sortQuery=function(e){return this._sort=void 0===e||e,this},n.prototype._finalizeQueryString=function(){var e=this._query.join("&");if(e&&(this.url+=(this.url.indexOf("?")>=0?"&":"?")+e),this._query.length=0,this._sort){var t=this.url.indexOf("?");if(t>=0){var r=this.url.substring(t+1).split("&");"function"==typeof this._sort?r.sort(this._sort):r.sort(),this.url=this.url.substring(0,t)+"?"+r.join("&")}}},n.prototype._appendQueryString=function(){console.trace("Unsupported")},n.prototype._timeoutError=function(e,t,r){if(!this._aborted){var n=new Error(e+t+"ms exceeded");n.timeout=t,n.code="ECONNABORTED",n.errno=r,this.timedout=!0,this.abort(),this.callback(n)}},n.prototype._setTimeouts=function(){var e=this;this._timeout&&!this._timer&&(this._timer=setTimeout(function(){e._timeoutError("Timeout of ",e._timeout,"ETIME")},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(function(){e._timeoutError("Response timeout of ",e._responseTimeout,"ETIMEDOUT")},this._responseTimeout))}},{"./is-object":94}],96:[function(e,t,r){"use strict";function n(e){if(e)return i(e)}function i(e){for(var t in n.prototype)e[t]=n.prototype[t];return e}var o=e("./utils");t.exports=n,n.prototype.get=function(e){return this.header[e.toLowerCase()]},n.prototype._setHeaderProperties=function(e){var t=e["content-type"]||"";this.type=o.type(t);var r=o.params(t);for(var n in r)this[n]=r[n];this.links={};try{e.link&&(this.links=o.parseLinks(e.link))}catch(e){}},n.prototype._setStatusProperties=function(e){var t=e/100|0;this.status=this.statusCode=e,this.statusType=t,this.info=1==t,this.ok=2==t,this.redirect=3==t,this.clientError=4==t,this.serverError=5==t,this.error=(4==t||5==t)&&this.toError(),this.created=201==e,this.accepted=202==e,this.noContent=204==e,this.badRequest=400==e,this.unauthorized=401==e,this.notAcceptable=406==e,this.forbidden=403==e,this.notFound=404==e,this.unprocessableEntity=422==e}},{"./utils":97}],97:[function(e,t,r){"use strict";r.type=function(e){return e.split(/ *; */).shift()},r.params=function(e){return e.split(/ *; */).reduce(function(e,t){var r=t.split(/ *= */),n=r.shift(),i=r.shift();return n&&i&&(e[n]=i),e},{})},r.parseLinks=function(e){return e.split(/ *, */).reduce(function(e,t){var r=t.split(/ *; */),n=r[0].slice(1,-1);return e[r[1].split(/ *= */)[1].slice(1,-1)]=n,e},{})},r.cleanHeader=function(e,t){return delete e["content-type"],delete e["content-length"],delete e["transfer-encoding"],delete e.host,t&&(delete e.authorization,delete e.cookie),e}},{}]},{},[71])(71)});
	//# sourceMappingURL=index.min.js.map


/***/ }
/******/ ]);
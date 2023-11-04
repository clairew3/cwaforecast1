
# 開發筆記

------------------------------------------------------------

## API授權碼

API授權碼應該要自己收好藏好，不應公開讓別人有機會取得。

雖然你可以申請新的API授權碼沒錯，但它基本上是個類似通行碼 (密碼) 的東西。

雖然拿到這通行碼 (密碼) 無法知道這是誰的密碼，但對 cwa 來說，出示這通行碼 (密碼)，就跟出示你的身份資料是一樣的。

所以，你不能把這API授權碼直接寫在前端。


------------------------------------------------------------

## 氣象資料開放平臺 使用說明

氣象資料開放平臺，開發指南，使用說明 
https://opendata.cwa.gov.tw/devManual/insrtuction


### 你必須cache資料

https://opendata.cwa.gov.tw/opendatadoc/client_cache.pdf

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match

https://easonwang.gitbook.io/web_advance/liu-lan-qi-kuai-qu-yu-huan-cun

有 cache 好的話，重新要求同一 url 會得到 `304`：
```
http status 304: Not Modified
```

原本想說，純前端是不用做這個的。

嗯，但，現在曉得，你不可以只做純前端了。因為API授權碼不可以寫在前端。

你一定需要一個後端來服務你的前端；然後把你的API授權碼寫在你的後端程式中。

所以，你必須依指示/要求做。


------------------------------------------------------------

## 使用資料集： F_C0032_001 (一般天氣預報-今明 36 小時天氣預報)

關於此資料集 
https://opendata.cwa.gov.tw/dataset/forecast/F-C0032-001

資料擷取API服務說明網址
https://opendata.cwa.gov.tw/dist/opendata-swagger.html?urls.primaryName=openAPI#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_C0032_001

中央氣象署產品說明文件，預報-精緻化天氣預報-今明 36 小時天氣預報 
https://www.cwa.gov.tw/Data/data_catalog/1-1-6.pdf



### API 測試 (F_C0032_001)

中央氣象署開放資料平臺之資料擷取API 
https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_C0032_001


此 url 測試結果 ok：
```
https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=xxx
```
取得的 json 已儲存為檔案 `F-C0032-001_sample.json`。


可以只索取特定縣市 (可多選) 的資料：
```
// locationName=臺南縣,高雄縣,屏東縣
https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=xxx&locationName=%E8%87%BA%E5%8D%97%E5%B8%82,%E9%AB%98%E9%9B%84%E5%B8%82,%E5%B1%8F%E6%9D%B1%E7%B8%A3
```

------------------------------------------------------------

## 使用資料集： F-C0032-005 (一般天氣預報-一週縣市天氣預報)

關於此資料集 
https://opendata.cwa.gov.tw/dataset/forecast/F-C0032-005
(嗯，官方目前沒有提供「資料擷取API服務說明網址」)

此資料集的說明文件 
https://opendata.cwa.gov.tw/opendatadoc/Forecast/F-C0032-003_006.pdf

中央氣象署產品說明文件，預報-精緻化天氣預報-一週天氣預報 
https://www.cwa.gov.tw/Data/data_catalog/1-1-5.pdf


### 檔案下載

https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-005?Authorization=xxx&downloadType=WEB&format=JSON


### 其他相似資料集

鄉鎮天氣預報-台灣未來1週天氣預報
https://opendata.cwb.gov.tw/dataset/statisticAll/F-D0047-091

檔案下載：
https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-091?Authorization=xxx&downloadType=WEB&format=JSON

中央氣象署產品說明文件，預報-精緻化天氣預報-368 鄉鎮預報
https://www.cwa.gov.tw/Data/data_catalog/1-1-1.pdf


------------------------------------------------------------

## 使用資料集： O-A0003-001 (現在天氣觀測報告-現在天氣觀測報告)

關於此資料集 
https://opendata.cwa.gov.tw/dataset/observation/O-A0003-001

此資料集的說明文件 
https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0003-001.pdf

資料擷取API服務說明網址
https://opendata.cwa.gov.tw/dist/opendata-swagger.html?urls.primaryName=openAPI#/%E8%A7%80%E6%B8%AC/get_v1_rest_datastore_O_A0003_001


### API 測試 (O-A0003-001)

中央氣象署開放資料平臺之資料擷取API 
https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/%E8%A7%80%E6%B8%AC/get_v1_rest_datastore_O_A0003_001

各 url 測試心得：
```
// 最終決定不指定測站了，因此可使用此 url
https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=xxx&elementName=ELEV,TEMP&parameterName=CITY

// ELEV 文件是寫「高度」，單位是公尺
// locationName 是指測站名稱，可指定多個 (但可能要考量URL長度？)
https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=xxx&locationName=%E5%9F%BA%E9%9A%86,%E9%AB%98%E9%9B%84&elementName=ELEV,TEMP&parameterName=CITY

https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=xxx&locationName=新北,臺北,基隆,桃園,新竹,新竹市東區,苗栗,臺中,田中,日月潭,虎尾,太保,嘉義,臺南,高雄,恆春,宜蘭,花蓮,臺東,澎湖,馬祖,金門&elementName=ELEV,TEMP&parameterName=CITY
// 此url只能取得16筆資料，與預期不符 (預期應得22筆)

// API文件說：`若使用「stationId」，則參數「locationName」的篩選資料則會失效，只會回傳stationId符合的資料`
// 那改用測試id取資料吧，每個縣市只取一個測站的資料，使用stationId的話，最終的URL總長度，總是有個限度吧。
https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=xxx&stationId=466880,466920,466940,C0C480,467570,C0D660,C0E750,467490,467270,467650,C0K330,C0M680,467480,467410,467440,467590,467080,466990,467660,467350,467990,467110&elementName=ELEV,TEMP&parameterName=CITY
// 此url只能取得13筆資料，與預期不符 (預期應得22筆)
```

#### 令人困惑的測站資料

API說明文件中提到的測站資料位於 https://e-service.cwa.gov.tw/wdps/obs/state.htm (稱為網址A)。

cwa官方網站上，最新天氣觀測資料中，查詢各測站資料的網址，隨意找一個作為代表 https://www.cwa.gov.tw/V8/C/W/OBS_County.html?ID=10017 (稱為網址B)。

由 API 得到的資料，其中的 stationId 以 `基隆` 測站為例是 `466940`，
在「網址A」中列的 ID 是 `466940`，
在「網址B」中觀察到的 ID 是 `46694`。

由 API 得到的資料，其中隨意一筆 (測站名稱為 `國三S007K`) 的 stationId 為 `CAB040`，
在「網址A」中試圖搜尋 `CAB040` 或 `CAB04`，都是找不到的；
而在「網址B」中，可找到 stationId 為 `CAB04`。

然而，卻也不是所有「網址A」中的測站 ID 都是「網址B」中的測站 ID 尾碼加上一個 `0`。

而當對 API 直接指定「測站名稱」時 (測站名稱是由「網址B」一一查詢並找出想要的22個測站)，也無法如預期取得所指定的22個測站的資料。

因此，目前決定這樣做：
不指定任何測站資料；直接依所取得的所有資料，依縣市區分後，隨機列出該縣市某個測站的觀測資料。


------------------------------------------------------------

## 其他相關文件

預報XML產品預報因子欄位中文說明表 
https://opendata.cwa.gov.tw/opendatadoc/MFC/A0012-001.pdf

氣象產品目錄總集 
https://www.cwa.gov.tw/V8/C/D/Data_catalog_Detail.html?cls=1&pubtype_02=0

氣象資料開放平臺，使用規範
https://opendata.cwa.gov.tw/about/rules
★ 注意使用這些資料的義務

------------------------------------------------------------

## cwa 天氣 icon

base url:
https://www.cwa.gov.tw/

多雲
```
https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/04.svg
https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/night/04.svg
// 從browser直接打開圖是可以的
```

```
https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/
// 當然會被拒絕 XDD
```

天氣圖示對照表
https://www.cwa.gov.tw/V8/C/K/Weather_Icon.html

icon不知有無公開授權？

icon其實就那幾種；雖然「天氣現象」文字有很多種，讓人眼花繚亂。

可以找免費的svg icon來擋著用，先處理常見的幾種天氣現象即可。

------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
------------------------------------------------------------
(end)

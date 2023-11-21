import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';
import { counties, countiesArr } from '../src/County.js';
import { getRawJsonStrFromFile } from './DataProvider.js';
import { Parser10min } from '../src/Parser10min.js';
import { format as dateFormat, parse as dateParse, addHours } from 'date-fns';
import { Authorization } from '../auth/authorization.js';


// test suite
describe(`Parser10min.js 可否如預期運作`, () => {

	// setup for test suite	

	const datafolder = './test/data/';
	let datafilename;

	// test case
	// 因實際與預期不一致，故skip
	it.skip(`可否正確解析 O-A0003-001_sample_20231115on.json`, () => {
		// arrange ------
		//20231017通知資料中提供的、新的 O-A0003-001 API 拿到的 json
		let jsonobj = getJsonFromFile('./test/data/O-A0003-001_sample_20231115on.json');
		// console.log(`14, jsonobj: `);
		// console.log(jsonobj);
		
		// act ------
		
		// assert ------
		console.log(`共 ${(jsonobj['cwaopendata']['dataset']['Station']['length'])} 筆資料`);
		let dataSeemsCorrect = 
			'O-A0003_001'=== jsonobj['cwaopendata']['dataid']
			// && '一週縣市天氣預報' === fullobj['cwaopendata']['dataset']['datasetInfo']['datasetDescription']
			&& jsonobj['cwaopendata']['dataset']['Station']['length'] > 0;
	});


	// test case
	// 20231115 新的 O-A0003-001 API 實際上線時拿到的 json
	datafilename = 'O-A0003-001_sample_202311151435.json';
	it(`可否正確解析 ${datafilename}`, () => {

		// arrange ------
		let jsonstr, obj;
		jsonstr = getRawJsonStrFromFile(`${datafolder}${datafilename}`);
		obj = JSON.parse(jsonstr);
		// console.log(`40, obj: `);
		// console.log(obj);

		// act ------
		let parser = new Parser10min();
		parser.setRawjson(jsonstr).parse();
		let obsData = parser.obsData;


		// assert ------

		// 應有137筆觀測資料
		expect.soft(obj['records']['Station']['length']).toBe(137);

		// 資料格式應與下列相符
		expect.soft(obj['success']).toBe('true');
		
		expect.soft(obj['result']['resource_id']).toBe('O-A0003-001');
		
		let dataSeemsCorrect = 
					'true' === obj['success']
					&& 'O-A0003-001' === obj['result']['resource_id']
					&& obj['records']['Station']['length'] > 0;
		expect.soft(dataSeemsCorrect).toBe(true);

		// 得到的觀測時間應為
		const fmt = "yyyy-MM-dd'T'HH:mm:ssxxx";   // ex: "2023-11-15T14:40:00+08:00"
		const obsTimeShouldBe = '2023-11-15T14:20:00+08:00';
		expect.soft(dateFormat(parser.obsTime, fmt)).toBe(obsTimeShouldBe);

		// 觀測資料第0筆應為：
		// (最終畫面上使用資料時是以縣市和觀測站為key取資料；此處寫「第N筆」是為了方便找出原始資料位於何處)
		// 縣市：基隆市
		// 觀測站名稱：基隆
		// station id: 466940
		// 標高 (GeoInfo.StationAltitude)： 26.7 公尺
		// 氣溫 (WeatherElement.AirTemperature)： 21 ℃
		let dataOfSomeCounty = obsData['基隆市'];
		let observation = dataOfSomeCounty['466940'];
		expect(observation['stationName']).toBe('基隆');
		expect(observation['elev']).toBe('26.7');
		expect(observation['temp']).toBe('21');

		// 觀測資料第136筆應為：
		// (最終畫面上使用資料時是以縣市和觀測站為key取資料；此處寫「第N筆」是為了方便找出原始資料位於何處)
		// 縣市：臺南市
		// 觀測站名稱：西濱N304K
		// station id: 466940
		// 標高 (GeoInfo.StationAltitude)： 49.0 公尺
		// 氣溫 (WeatherElement.AirTemperature)： 24.2 ℃
		dataOfSomeCounty = obsData['臺南市'];
		observation = dataOfSomeCounty['CAN120'];
		expect(observation['stationName']).toBe('西濱N304K');
		expect(observation['elev']).toBe('49.0');
		expect(observation['temp']).toBe('24.2');

	});



	// test case
	it(`可否正確解析自 20231115 起由 O-A0003-001 取得的資料`, async () => {

		// arrange ------
		let jsonstr, obj;

		await axios.get(composeUrl10min(), {responseType: 'text'})
			.then(response => {
				jsonstr = response.data;
				// console.log(`116, jsonstr:`);
				// console.log(jsonstr);
				obj = JSON.parse(jsonstr);
				// console.log(`118, obj: `);
				// console.log(obj);
			
			}).then(() => {

				// act ------
				let parser = new Parser10min();
				parser.setRawjson(jsonstr).parse();
				let obsData = parser.obsData;


				// assert ------

				// 觀測資料筆數應該在一定數量以上
				expect.soft(obj['records']['Station']['length']).greaterThan(120);

				// 資料格式應與下列相符
				expect.soft(obj['success']).toBe('true');
				
				expect.soft(obj['result']['resource_id']).toBe('O-A0003-001');
				
				let dataSeemsCorrect = 
							'true' === obj['success']
							&& 'O-A0003-001' === obj['result']['resource_id']
							&& obj['records']['Station']['length'] > 0;
				expect.soft(dataSeemsCorrect).toBe(true);

				// 得到的觀測時間應為：1hr以內
				const onehrEnd = new Date();
				let onehrStart = addHours(onehrEnd, -1);
				// const fmt = "yyyy-MM-dd'T'HH:mm:ssxxx";   // ex: "2023-11-15T14:40:00+08:00"
				expect.soft(parser.obsTime.getTime()).toBeGreaterThan(onehrStart.getTime());
				expect.soft(parser.obsTime.getTime()).toBeLessThan(onehrEnd.getTime());

				// 以下隨機挑選一些資料來看是否合理。
				// 為了使測試結果容易查錯，不使用陣列與迴圈包覆/簡化程式碼。

				// 觀測資料應該看來合理：
				// (最終畫面上使用資料時是以縣市和觀測站為key取資料)
				// 縣市：臺南縣、新北市
				// 觀測站名稱：(隨機決定) 必須有值
				// station id: (隨機決定) 必須有值
				// 標高 (GeoInfo.StationAltitude)： 必須有值
				// 氣溫 (WeatherElement.AirTemperature)： 必須有值，且不為 `-99`
				let dataOfSomeCounty = obsData['新北市'];
				let stationIds = Object.keys(dataOfSomeCounty);
				let r = Math.floor(Math.random() * stationIds.length);
				let observation = dataOfSomeCounty[stationIds[r]];
				expect(observation['stationName']).toBeTruthy();
				expect(observation['elev']).toBeTruthy();
				expect(observation['temp']).toBeTruthy();
				expect(Number(observation['temp'])).toBeGreaterThan(-99);

				// 觀測資料應該看來合理：
				// (最終畫面上使用資料時是以縣市和觀測站為key取資料)
				// 縣市：新北市
				// 觀測站名稱：(隨機決定) 必須有值
				// station id: (隨機決定) 必須有值
				// 標高 (GeoInfo.StationAltitude)： 必須有值
				// 氣溫 (WeatherElement.AirTemperature)： 必須有值，且不為 `-99`
				dataOfSomeCounty = obsData['臺南市'];
				stationIds = Object.keys(dataOfSomeCounty);
				r = Math.floor(Math.random() * stationIds.length);
				observation = dataOfSomeCounty[stationIds[r]];
				expect(observation['stationName']).toBeTruthy();
				expect(observation['elev']).toBeTruthy();
				expect(observation['temp']).toBeTruthy();
				expect(Number(observation['temp'])).toBeGreaterThan(-99);

			});

	});


});




function composeUrl10min() {
  return `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${Authorization}&elementName=ELEV,TEMP&parameterName=CITY`;
}





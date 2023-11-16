import { describe, it, expect, beforeAll } from 'vitest';
import { getRawJsonStrFromFile } from './DataProvider.js';
import { Parser10min } from './src/Parser10min.js';
import { format, parse } from 'date-fns';

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
		expect.soft(format(parser.obsTime, fmt)).toBe(obsTimeShouldBe);

	});


});


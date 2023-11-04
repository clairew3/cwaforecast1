import { format, parse } from 'date-fns';

class Parser7d {

	constructor() {
		this.rawjson;

		this.dataSeemsCorrect = false;
		this.fullobj;
		this.result = {
			wx: {},  // 天氣現象； 某縣市的 各時段的 天氣現象
			mint: {},  // 最低溫度； 某縣市的 各時段的 最低溫度
			maxt: {},  // 最高溫度
			dates: [],   // 7個日期 (型態為 Date)，供顯示用
			timestrs: [],   // 所有可用來取資料的字串 (用途類似key)
		};
	}

	setRawjson(jsonstr) {
		this.rawjson = jsonstr;
		return this;
	}

	checkData() {
		
		let x = JSON.parse(this.rawjson);

		this.dataSeemsCorrect = 
			'C0032-005'=== x['cwaopendata']['dataid']
			&& '一週縣市天氣預報' === x['cwaopendata']['dataset']['datasetInfo']['datasetDescription']
			&& x['cwaopendata']['dataset']['location']['length'] > 0;

		if (!this.dataSeemsCorrect) {
			throw new Error("unknown content");
		}

		this.fullobj = x;
	}

	parse() {
		
		this.checkData();

		// for parsers
		const fmt = `yyyyMMdd'T'HH`;
		const fmtHHmm = `HH:mm`;
		const fmtDate = `yyyyMMdd`;
		const sep = `_`;   //separater
		const sep2 = `~`;   //for timeDesc

		const locationName = 'locationName';
		const MinT = 'MinT';
		const MaxT = 'MaxT';
		const Wx = 'Wx';
		

		
		for (let c of this.fullobj['cwaopendata']['dataset']['location']) {
			// c: county
			
			let objWE = {};   // an object which contains weather elements (key: {mint|maxt|wx}, value: Array)
			for (let e of c['weatherElement']) {
				objWE[e['elementName']] = e['time'];
			}

			let obj;
			let arr = [];

			obj = parseMintOrMaxt(objWE[MinT]);
			arr = arr.concat(Object.keys(obj));
			this.result.mint[c[locationName]] = obj;

			obj = parseMintOrMaxt(objWE[MaxT]);
			arr = arr.concat(Object.keys(obj));
			this.result.maxt[c[locationName]] = obj;

			obj = parseWx(objWE[Wx]);
			arr = arr.concat(Object.keys(obj));
			this.result.wx[c[locationName]] = obj;

			// 去掉要無視的字串後，自然排序後，再製作出 distinct 的效果
			arr = arr.filter((s) => !s.endsWith('X'));
			arr.sort();
			obj = {};
			arr.forEach(e => {
				obj[e] = null;
			});
			this.result.timestrs = Object.keys(obj);
		}

		// 找出所有的「日期」(不需要任何時間資訊)，並把它們都製作成 Date 型態
		let dateCnt = {};
		let arr = [];
		this.result.timestrs.forEach(e => {
			let dateStr = e.substring(0,8);   // 會得到類似 "20231101" 的字串
			dateCnt[dateStr] = (dateCnt[dateStr] || 0) +1;
			if (dateCnt[dateStr]>=2) {
				// 必須有至少2筆，才算是「有當日預報資料」
				arr.push(dateStr);
			}
		})
		let obj = {};   // 製作 disinct 的效果
		arr.forEach(e => {
			obj[e] = null;
		});
		let arr2 = [];   // 製作好 Date 物件後，放這
		Object.keys(obj).forEach(e => {
			arr2.push(parse(e, fmtDate, new Date()));
		});
		this.result.dates = arr2;




		// main parsers

		function reformTimeStr(s) {
			return String(s).replaceAll(':00:00+08:00','').replaceAll('-','').replaceAll(' ','');
		}
		function reformAsDayNightX(str) {
			return (str.endsWith('T06') || str.endsWith('T12'))
										? `${str.substring(0,8)}D` 
										: str.endsWith('T18') 
														? `${str.substring(0,8)}N`
														: `${str.substring(0,8)}X`;
		}

		function parseMintOrMaxt(d) {
			let obj = {};
			d.forEach(e => {
				// input:
				// startTime: '2023-11-01T06:00:00+08:00'
				// endTime: '2023-11-01T18:00:00+08:00'
				// parameter: {parameterName: '27', parameterUnit: 'C'}
				
				// output:
				// 時間區間若為 "06-18"，尾碼改為 "D" (日)。
				// 時間區間若為 "18-06"，尾碼改為 "N" (夜)。
				// 時間區間若為 "00-06"，尾碼改為 "X" (無視)。
				let s = reformTimeStr(e.startTime);   // 算完後會得到類似這樣："20231101T06"
				s = reformAsDayNightX(s);   // 算完後會得到類似這樣："20231101D"
				obj[s] = e['parameter'] && e['parameter']['parameterName'];
				// obj['20231101D'] = '27'
				// obj['20231101N'] = '27'
				// obj['20231101X'] = '27'

				// Here we simply forget parameterUnit, take it if you need it.
			});
			return obj;
		}

		function parseWx(d) {
			let obj = {};
			d.forEach(e => {
				// input:
				// sample 1:
				// startTime: '2023-11-01T06:00:00+08:00'
				// endTime: '2023-11-01T18:00:00+08:00'
				// parameter: {parameterName: '晴時多雲', parameterValue: '2'}
				// sample 2:
				// startTime: '2023-11-01T18:00:00+08:00'
				// endTime: '2023-11-02T06:00:00+08:00'
				// parameter: {parameterName: '多雲時晴', parameterValue: '3'}
				// parameterValue 猜測應與 icon 檔名有關係。

				// output:
				// 時間區間若為 "06-18"，尾碼改為 "D" (日)。
				// 時間區間若為 "18-06"，尾碼改為 "N" (夜)。
				// 時間區間若為 "00-06"，尾碼改為 "X" (無視)。
				let s = reformTimeStr(e.startTime);   // 算完後會得到類似這樣："20231101T06"
				s = reformAsDayNightX(s);   // 算完後會得到類似這樣："20231101D"
				let n = e['parameter'] && e['parameter']['parameterValue'];
				let s2 = (n<=9) ? `0${n}` : String(n);
				obj[s] = s2;
				// obj['20231101D'] = '02'
				// obj['20231101N'] = '03'
				// obj['20231101X'] = '04'

				// Here we simply forget parameterName, take it if you need it.
			});
			return obj;
		}




	}


	// getter
	get wx() { return this.result.wx; }
	get mint() { return this.result.mint; }
	get maxt() { return this.result.maxt; }

	get timestrs() { return this.result.timestrs; }
	get dates() { return this.result.dates; }

}



export { Parser7d };


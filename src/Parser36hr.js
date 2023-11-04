import { format, parse } from 'date-fns';

class Parser36hr {

	constructor() {
		this.rawjson;

		this.dataSeemsCorrect = false;
		this.fullobj;
		this.result = {
			wx: {},  // 天氣現象； 某縣市的 各時段的 天氣現象
			pop: {},  // 降雨機率
			mint: {},  // 最低溫度； 某縣市的 各時段的 最低溫度
			maxt: {},  // 最高溫度
			ci: {},   // 舒適度
			timestrs: [],   // 上述各種資料曾出現過的所有「經運算後的key值」
			timeTitles: [],   // ex: 今日白天，今晚明晨，明日白天，明日晚上
			timeDescs: [],   // ex: "06:00~18:00", "12:00~18:00"
		};
	}

	setRawjson(jsonstr) {
		this.rawjson = jsonstr;
		return this;
	}

	checkData() {
		
		let x = JSON.parse(this.rawjson);

		this.dataSeemsCorrect = JSON.parse(String(x['success']).toLowerCase())
			&& x['result'] && 'F-C0032-001'=== x['result']['resource_id']
			&& x['records'] && '三十六小時天氣預報' === x['records']['datasetDescription'] 
			&& x['records']['location'] && x['records']['location']['length'] > 0;

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
		const sep = `_`;   //separater
		const sep2 = `~`;   //for timeDesc

		const locationName = 'locationName';
		const MinT = 'MinT';
		const MaxT = 'MaxT';
		const PoP = 'PoP';
		const Wx = 'Wx';
		const CI = 'CI';

		for (let c of this.fullobj['records']['location']) {
			// c: county
			
			let objWE = {};   // an object which contains weather elements (key: {mint|maxt|pop|wx|ci}, value: Array)
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

			obj = parsePop(objWE[PoP]);
			arr = arr.concat(Object.keys(obj));
			this.result.pop[c[locationName]] = obj;

			obj = parseWx(objWE[Wx]);
			arr = arr.concat(Object.keys(obj));
			this.result.wx[c[locationName]] = obj;

			obj = parseCi(objWE[CI]);
			arr = arr.concat(Object.keys(obj));
			this.result.ci[c[locationName]] = obj;

			obj = {};
			arr.sort();
			arr.forEach(e => {
				obj[e] = null;
			});
			this.result.timestrs = Object.keys(obj);
			this.result.timeTitles = findTitles(this.timestrs);
			this.result.timeDescs = findDescs(this.timestrs);
		}



		// parsers to find the Title and Description of timestr

		function findTitles__(arr) {
			const title = ['今日白天','今晚明晨','明日白天','明日晚上'];
			let fs,fe;
			[fs,fe] = arr[0].split(sep);
			let dfs = parse(fs, fmt, new Date());
			// let dfe = parse(fe, fmt);
			let h,titleStart;
			h = dfs.getHours();
			if (h>=6 && h<=12) {
				titleStart = 0;
			} else if (h<6 || h>=18) {
				titleStart = 1;
			}
			let rv = title.slice(titleStart, titleStart+arr.length);
			return rv;
		}

		function findTitles(arr) {
			let fs,fe,rv;
			[fs,fe] = arr[0].split(sep);
			let dfs = parse(fs, fmt, new Date());
			// let dfe = parse(fe, fmt);
			let h,titleStart;
			h = dfs.getHours();
			if (h<6) {
				rv = ['今日凌晨','今日白天','今日晚上'];
			} else if (h>=6 && h<18) {
				rv = ['今日白天','今晚明晨','明日白天'];
			} else if (h>=18) {
				rv = ['今晚明晨','明日白天','明日晚上'];
			}
			return rv;
		}

		function findDescs(arr) {
			let rv = [];
			arr.forEach(elem => {
				let ss, se;
				[ss,se] = elem.split(sep);
				rv.push(`${toDesc(ss)}${sep2}${toDesc(se)}`);
			});
			return rv;

			function toDesc(str) {
				let d = parse(str, fmt, new Date());
				return format(d, fmtHHmm);
			}
		}



		// main parsers

		function reformTimeStr(s) {
			return String(s).replaceAll(':00:00','').replaceAll('-','').replaceAll(' ','T');
		}
		function reformAsTimePeriod(startTime, endTime) {
			return reformTimeStr(startTime) + sep + reformTimeStr(endTime);
		}

		function parseMintOrMaxt(d) {
			let obj = {};
			d.forEach(e => {
				// input:
				// startTime: '2023-10-24 18:00:00'
				// endTime: '2023-10-25 06:00:00'
				// parameter: {parameterName: '27', parameterUnit: 'C'}
				
				// output (v1):
				// obj['t'] = reformAsTimePeriod(e.startTime, e.endTime);  // 2023102418_2023102506
				// obj['v'] = e['parameter'] && e['parameter']['parameterName'];
				// t: '2023102418_2023102506'
				// v: '27'

				// output (v2):
				obj[reformAsTimePeriod(e.startTime, e.endTime)] = e['parameter'] && e['parameter']['parameterName'];
				// obj['2023102418_2023102506'] = '27'

				// Here we simply forget parameterUnit, take it if you need it.
			});
			return obj;
		}

		function parsePop(d) {
			let obj = {};
			d.forEach(e => {
				// input:
				// startTime: '2023-10-24 18:00:00'
				// endTime: '2023-10-25 06:00:00'
				// parameter: {parameterName: '0', parameterUnit: '百分比'}

				// output:
				obj[reformAsTimePeriod(e.startTime, e.endTime)] = e['parameter'] && e['parameter']['parameterName'];
				// obj['2023102418_2023102506'] = '0'

				// Here we simply forget parameterUnit, take it if you need it.
			});
			return obj;
		}

		function parseWx(d) {
			let obj = {};
			d.forEach(e => {
				// input:
				// sample 1:
				// startTime: '2023-10-25 06:00:00'
				// endTime: '2023-10-25 18:00:00'
				// parameter: {parameterName: '晴時多雲', parameterValue: '2'}
				// sample 2:
				// startTime: '2023-10-25 18:00:00'
				// endTime: '2023-10-26 06:00:00'
				// parameter: {parameterName: '多雲', parameterValue: '4'}
				// parameterValue 猜測應與 icon 檔名有關係。

				// output:
				obj[reformAsTimePeriod(e.startTime, e.endTime)] 
						= e['parameter'] && e['parameter']['parameterName']
							+ ',' 
							+ e['parameter'] && e['parameter']['parameterValue'];
				// obj['2023102506_2023102518'] = '晴時多雲,2'
				// obj['2023102518_2023102606'] = '多雲,4'
			});
			return obj;
		}

		function parseCi(d) {
			let obj = {};
			d.forEach(e => {
				// input:
				// startTime: '2023-10-25 06:00:00'
				// endTime: '2023-10-25 18:00:00'
				// parameter: {parameterName: '舒適至悶熱'}

				// output:
				obj[reformAsTimePeriod(e.startTime, e.endTime)] 
						= e['parameter'] && e['parameter']['parameterName'];
				// obj['2023102506_2023102518'] = '舒適至悶熱'
			});
			return obj;
		}


	}


	// getter
	get wx() { return this.result.wx; }
	get pop() { return this.result.pop; }
	get mint() { return this.result.mint; }
	get maxt() { return this.result.maxt; }
	get ci() { return this.result.ci; }

	get timestrs() { return this.result.timestrs; }
	get timeTitles() { return this.result.timeTitles; }
	get timeDescs() { return this.result.timeDescs; }

}



export { Parser36hr };


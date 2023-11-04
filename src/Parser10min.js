import { format, parse } from 'date-fns';

class Parser10min {

	constructor() {
		this.rawjson;

		this.dataSeemsCorrect = false;
		this.fullobj;
		this.result = {
			obsTime: null,   // 資料時間 (所有觀測資料的時間應該都是一致的；distinct完應該只會有一筆資料 (理論上?))
			obsData: {},   // 解析後的資料； key為 countyFullname， value為Array內放多筆觀測資料
		};
	}

	setRawjson(jsonstr) {
		this.rawjson = jsonstr;
		return this;
	}

	checkData() {
		
		let x = JSON.parse(this.rawjson);

		this.dataSeemsCorrect = JSON.parse(String(x['success']).toLowerCase())
			&& 'O-A0003-001'=== (x['result'] && x['result']['resource_id'])
			&& x['records']['location'] && x['records']['location']['length'] > 0;

		if (!this.dataSeemsCorrect) {
			throw new Error("unknown content");
		}

		this.fullobj = x;
	}



/***** input sample:
{
  lat: '25.093730',
  lon: '121.184277',
  locationName: '西濱S032K',
  stationId: 'CAC060',
  time: { obsTime: '2023-11-01 16:00:00' },
  weatherElement: [
    { elementName: 'ELEV', elementValue: '21.0' },
    { elementName: 'TEMP', elementValue: '26.8' }
  ],
  parameter: [ { parameterName: 'CITY', parameterValue: '桃園市' } ]
}
******/

/***** 預計 output:

obsTime: 一個 Date() 物件

obsData: 
{
	"高雄市": { 
		"stationId": { stationName: "測站名稱",	elev: "30",	temp: "25.0" },
		"stationId": { stationName: "測站名稱",	elev: "30",	temp: "25.0" },
	},
	"苗栗縣": { 
		"stationId": { stationName: "測站名稱",	elev: "30",	temp: "25.0" },
		"stationId": { stationName: "測站名稱",	elev: "30",	temp: "25.0" },
	},
}

******/



	parse() {
		
		this.checkData();

		// for parsers
		const fmt = 'yyyy-MM-dd HH:mm:ss';   // ex: "2023-11-01 16:00:00"


		let distinctObsTime = {};   // 用來收集所有的time字串 (所有觀測資料的時間應該都是一致的；distinct完應該只會有一筆資料 (理論上?))
		let obsData = {};   // 觀測資料 (obs = observation)
				
		let records = this.fullobj.records.location;
		records.forEach(e => {
	
			distinctObsTime[e.time.obsTime] = null;
		
			let county = e.parameter[0].parameterValue;
			obsData[county] = obsData[county] || {};
		
			let tmpElev, tmpTemp;
			e.weatherElement.forEach(e2 => {
				if ('ELEV' === e2.elementName) {
					tmpElev = e2.elementValue;
				}
				if ('TEMP' === e2.elementName) {
					tmpTemp = e2.elementValue;
				}
			});
		
			obsData[county][e.stationId] = {
				'stationName': e.locationName,
				'elev': tmpElev,
				'temp': tmpTemp,
			};
		
		});
		
		let distinctObsTimeKeys = Object.keys(distinctObsTime);
		if (distinctObsTimeKeys.length == 1) {
			this.result.obsTime = parse(distinctObsTimeKeys[0], fmt, new Date());
		} else {
			throw new Error('Parser10min 解析結果得到 0 筆或多筆不同的日期時間');
		}

		this.result.obsData = obsData;


	}


	// getter
	get obsTime() { return this.result.obsTime; }
	get obsData() { return this.result.obsData; }


}



export { Parser10min };


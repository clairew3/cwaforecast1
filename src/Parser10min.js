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

		this.dataSeemsCorrect = 'true' === x['success']
			&& 'O-A0003-001' === x['result']['resource_id']
			&& x['records']['Station']['length'] > 0;

		if (!this.dataSeemsCorrect) {
			throw new Error("unknown content");
		}

		this.fullobj = x;
	}



/***** input sample:
{
  StationName: '國一N013K',
  StationId: 'CAA010',
  ObsTime: { DateTime: '2023-09-25T11:00:00+08:00' },
  GeoInfo: {
    Coordinates: [ [Object], [Object] ],
    StationAltitude: '39.0',
    CountyName: '新北市',
    TownName: '汐止區',
    CountyCode: '65000',
    TownCode: '65000110'
  },
  WeatherElement: {
    Weather: '晴',
    VisibilityDescription: '-99',
    SunshineDuration: '-99',
    Now: { Precipitation: '0.0' },
    WindDirection: '40.0',
    WindSpeed: '2.5',
    AirTemperature: '31.7',
    RelativeHumidity: '73',
    AirPressure: '-99',
    UVIndex: '-99',
    Max10MinAverage: { WindSpeed: '3.9', Occurred_at: [Object] },
    GustInfo: { PeakGustSpeed: '7.4', Occurred_at: [Object] },
    DailyExtreme: { DailyHigh: [Object], DailyLow: [Object] }
  }
}
******/

/***** 預計 output:

obsTime: 一個 Date() 物件

obsData: 
{
	"高雄市": { 
		"stationId": { stationName: "觀測站名稱",	elev: "30",	temp: "25.0" },
		"stationId": { stationName: "觀測站名稱",	elev: "30",	temp: "25.0" },
	},
	"苗栗縣": { 
		"stationId": { stationName: "觀測站名稱",	elev: "30",	temp: "25.0" },
		"stationId": { stationName: "觀測站名稱",	elev: "30",	temp: "25.0" },
	},
}

******/



	parse() {
		
		this.checkData();

		// for parsers
		const fmt = "yyyy-MM-dd'T'HH:mm:ssxxx";   // ex: "2023-11-15T14:40:00+08:00"


		let distinctObsTime = {};   // 用來收集所有的time字串 (所有觀測資料的時間應該都是一致的；distinct完應該只會有一筆資料 (理論上?))
		let obsData = {};   // 觀測資料 (obs = observation)
				
		let records = this.fullobj.records.Station;
		records.forEach(e => {
	
			distinctObsTime[e.ObsTime.DateTime] = null;
		
			let county = e.GeoInfo.CountyName;
			obsData[county] = obsData[county] || {};
		
			let tmpElev, tmpTemp;
			tmpElev = e.GeoInfo.StationAltitude;
			tmpTemp = e.WeatherElement.AirTemperature;
		
			if (Number(tmpTemp) > -50) {
				obsData[county][String(e.StationId)] = {
					'stationName': e.StationName,
					'elev': tmpElev,
					'temp': tmpTemp,
				}
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


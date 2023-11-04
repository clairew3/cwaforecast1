
let data = [
	{id:'N1',name:'新北',fullname:'新北市',pathid:'NewTaipeiCity',},
	{id:'N2',name:'臺北',fullname:'臺北市',pathid:'TaipeiCity',},
	{id:'N3',name:'基隆',fullname:'基隆市',pathid:'KeelungCity',},
	{id:'N4',name:'桃園',fullname:'桃園市',pathid:'TaoyuanCity',},
	{id:'N5',name:'新竹',fullname:'新竹縣',pathid:'HsinchuCounty',},
	{id:'N6',name:'新竹市',fullname:'新竹市',pathid:'HsinchuCity',},
	{id:'C1',name:'苗栗',fullname:'苗栗縣',pathid:'MiaoliCounty',},
	{id:'C2',name:'臺中',fullname:'臺中市',pathid:'TaichungCity',},
	{id:'C3',name:'彰化',fullname:'彰化縣',pathid:'ChanghuaCounty',},
	{id:'C4',name:'南投',fullname:'南投縣',pathid:'NantouCounty',},
	{id:'C5',name:'雲林',fullname:'雲林縣',pathid:'YunlinCounty',},
	{id:'N1',name:'嘉義',fullname:'嘉義縣',pathid:'ChiayiCounty',},
	{id:'N2',name:'嘉義市',fullname:'嘉義市',pathid:'ChiayiCity',},
	{id:'N3',name:'臺南',fullname:'臺南市',pathid:'TainanCity',},
	{id:'N4',name:'高雄',fullname:'高雄市',pathid:'KaohsiungCity',},
	{id:'N5',name:'屏東',fullname:'屏東縣',pathid:'PingtungCounty',},
	{id:'E1',name:'宜蘭',fullname:'宜蘭縣',pathid:'YilanCounty',},
	{id:'E2',name:'花蓮',fullname:'花蓮縣',pathid:'HualienCounty',},
	{id:'E3',name:'臺東',fullname:'臺東縣',pathid:'TaitungCounty',},
	{id:'I1',name:'澎湖',fullname:'澎湖縣',pathid:'PenghuCounty',},
	{id:'I2',name:'連江',fullname:'連江縣',pathid:'LienchiangCounty',},
	{id:'I3',name:'金門',fullname:'金門縣',pathid:'KinmenCounty',},
];

let counties = {
	'fullname': {},
	'id': {},
	'name': {},
	'pathid': {},
};

let countiesArr = [];

data.forEach( e => {
	counties['fullname'][e.fullname] = e;
	counties['id'][e.id] = e;
	counties['name'][e.name] = e;
	counties['pathid'][e.pathid] = e;
	countiesArr.push(e);
});

// console.log(`counties.fullname:`);
// console.log(counties.fullname);
// console.log(`counties.id:`);
// console.log(counties.id);
// console.log(`counties.name:`);
// console.log(counties.name);
// console.log(`counties.pathid:`);
// console.log(counties.pathid);
// console.log(`countiesArr.length`);
// console.log(countiesArr);

export { counties, countiesArr };

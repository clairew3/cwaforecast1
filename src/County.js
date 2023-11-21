
let data = [
	{id:'N1',name:'新北',fullname:'新北市',pathid:'NewTaipeiCity',n2:'NewTaipei',},
	{id:'N2',name:'臺北',fullname:'臺北市',pathid:'TaipeiCity',n2:'Taipei',},
	{id:'N3',name:'基隆',fullname:'基隆市',pathid:'KeelungCity',n2:'Keelung',},
	{id:'N4',name:'桃園',fullname:'桃園市',pathid:'TaoyuanCity',n2:'Taoyuan',},
	{id:'N5',name:'新竹',fullname:'新竹縣',pathid:'HsinchuCounty',n2:'Hsinchu',},
	{id:'N6',name:'新竹市',fullname:'新竹市',pathid:'HsinchuCity',n2:'HsinchuCity',},
	{id:'C1',name:'苗栗',fullname:'苗栗縣',pathid:'MiaoliCounty',n2:'Miaoli',},
	{id:'C2',name:'臺中',fullname:'臺中市',pathid:'TaichungCity',n2:'Taichung',},
	{id:'C3',name:'彰化',fullname:'彰化縣',pathid:'ChanghuaCounty',n2:'Changhua',},
	{id:'C4',name:'南投',fullname:'南投縣',pathid:'NantouCounty',n2:'Nantou',},
	{id:'C5',name:'雲林',fullname:'雲林縣',pathid:'YunlinCounty',n2:'Yunlin',},
	{id:'N1',name:'嘉義',fullname:'嘉義縣',pathid:'ChiayiCounty',n2:'Chiayi',},
	{id:'N2',name:'嘉義市',fullname:'嘉義市',pathid:'ChiayiCity',n2:'ChiayiCity',},
	{id:'N3',name:'臺南',fullname:'臺南市',pathid:'TainanCity',n2:'Tainan',},
	{id:'N4',name:'高雄',fullname:'高雄市',pathid:'KaohsiungCity',n2:'Kaohsiung',},
	{id:'N5',name:'屏東',fullname:'屏東縣',pathid:'PingtungCounty',n2:'Pingtung',},
	{id:'E1',name:'宜蘭',fullname:'宜蘭縣',pathid:'YilanCounty',n2:'Yilan',},
	{id:'E2',name:'花蓮',fullname:'花蓮縣',pathid:'HualienCounty',n2:'Hualien',},
	{id:'E3',name:'臺東',fullname:'臺東縣',pathid:'TaitungCounty',n2:'Taitung',},
	{id:'I1',name:'澎湖',fullname:'澎湖縣',pathid:'PenghuCounty',n2:'Penghu',},
	{id:'I2',name:'連江',fullname:'連江縣',pathid:'LienchiangCounty',n2:'Lienchiang',},
	{id:'I3',name:'金門',fullname:'金門縣',pathid:'KinmenCounty',n2:'Kinmen',},
];

let counties = {
	'fullname': {},
	'id': {},
	'name': {},
	'pathid': {},
	'n2': {},
};

let countiesArr = [];

data.forEach( e => {
	counties['fullname'][e.fullname] = e;
	counties['id'][e.id] = e;
	counties['name'][e.name] = e;
	counties['pathid'][e.pathid] = e;
	counties['n2'][e.n2] = e;
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
// console.log(`counties.n2:`);
// console.log(counties.n2);
// console.log(`countiesArr.length`);
// console.log(countiesArr);

let emptyCounty = {id:'',name:'',fullname:'',pathid:'',n2:''};

export { counties, countiesArr, emptyCounty };

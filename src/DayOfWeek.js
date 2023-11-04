

let arr = 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'.split(',');
let arr2 = '一,二,三,四,五,六,日'.split(',');
let w = {};

for (let i=0; i<arr.length; i++) {
	w[arr[i]] = arr2[i];
}

export { w as wname };



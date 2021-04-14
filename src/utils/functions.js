export const range = (start, end) => {
	var ans = [];
	for (let i = start; i <= end; i++) {
		ans.push(i);
	}
	return ans;
};

export const currentYearNum = new Date().getFullYear().toString().substr(-2);

let ctx = document.getElementById('piechart');
let chartCategorySelector = document.getElementById('chart-category');
if (chartCategorySelector) {
	chartCategorySelector.addEventListener('change', updateChart);
}

let pieChart = new Chart(ctx, {
	type: 'pie',
	data: {
		"labels":[],
		"datasets":[]
	},
	options: {
		title: {

		},
		responsive: true,
		aspectRatio	: 1.5
	}
});

function loadInitialChart() {
	let categoryId = chartCategorySelector.value;
	renderChart(categoryId);
}

loadInitialChart();

async function renderChart(categoryId) {
	if (monthSelector.value) {
		let { firstDay, lastDay} = monthBounds(monthSelector.value);
		removeData(pieChart);
		let { title, labels, data, backgroundColor } = await getChartData(categoryId, firstDay, lastDay);
		addData(pieChart, labels, title, data, backgroundColor);
	}
}

function removeData(chart) {
    chart.data.labels = [];
    chart.data.datasets = [];
    chart.update();
};

function addData(chart, labels, title, data, backgroundColor) {
    chart.data.labels = labels;
	chart.data.datasets.push({
		data: data,
		backgroundColor: backgroundColor
	});
	chart.options.title.text = title;
	chart.options.title.display = true;
    chart.update();
}

async function getChartData(categoryId, firstDay, lastDay) {
	let chartData = await axios.get(`spend/summary/${categoryId}?from=${firstDay}&to=${lastDay}`);

	let title = `Category: ${chartData.data.categoryName}`;

	let isCategory = (chartData.data.type === "subcategories") ? true : false;

	let labels = chartData.data.data.map((item)=>{
		if (isCategory){
			return item['sub_category_name'];
		} else {
			return item['category_name'];
		}
	});

	let data = chartData.data.data.map((item)=>{
		return item.total;
	});

	let backgroundColor = chartData.data.data.map((item)=>{
		return item.color;
	});

	return {
		title, 
		labels,
		data,
		backgroundColor
	};
}

function updateChart(event) {
	let categoryId = event.target.value;
	renderChart(categoryId);
}
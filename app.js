function getMetadata(sample){
	//Read in data file
	d3.json("samples.json").then((data) =>{
		var metadata= data.metadata;
		var results1 = metadata.filter(sampleObject => sampleObject.id == sample);
		var result2=results1[0]
		//console.log(result2['id'])
		var PANEL = d3.select("#sample-metadata");
		PANEL.html("");
		//var age = result2['age']
		//PANEL.append("h6").text('Age : ${age}');
		Object.entries(result2).forEach(([key, value])=>{
			PANEL.append("h6").text(`${key.toUpperCase()} : ${value}`);
		});
	});
};

function getPlots(sample){
	//fetch sample data for plots
	d3.json("samples.json").then((data)=> {
		var samples = data.samples;
		var sampleResult = samples.filter(sampleObject => sampleObject.id ==sample);
		var result = sampleResult[0]

		var values= result.sample_values;
		var ids = result.otu_ids;
		var labels = result.otu_labels;

		//Build bar chart using plotlu
		var trace1 = {
			y: ids.slice(0,10).map(otuId=> `OTU ${otuId}`).reverse(),
			x: values.slice(0,10).reverse(),
			text: labels.slice(0,10).reverse(),
			type: "bar",
			orientation: "h"
		};

		var barData = [trace1];

		var barLayout = {
			title: "Top 10 Operational Taxonomic Units (OTUs) Found",
			margin: {
				l: 150,
				t:30
		
			}
		};

		Plotly.newPlot("bar", barData, barLayout);

		//Build Bubble Chart
		var trace2 = {
			x: ids,
			y: values,
			text: labels,
			mode: 'markers',
			marker: {
				color: ids,
				size: values
			}
		};

		var bubbleData = [trace2];

		var bubbleLayout={
			xaxis: {title: "OTU ID"},
			hovermode: "closest"
		};

		Plotly.plot("bubble", bubbleData, bubbleLayout);

	});
}

function init(){
	//create variable to reference dropdown element 
	var selector = d3.select("#selDataset");
	//Populate options with the values in the list of sample names
	d3.json("samples.json").then((data)=> {
		var sampleNames = data.names;
		sampleNames.forEach((sample)=> {
			selector
				.append("option")
				.text(sample)
				.property("value", sample);
		});

	//Build initial plots with the data from the first sample
	const sample1= sampleNames[0];
	getPlots(sample1);
	getMetadata(sample1);
	});
}

function optionChanged(sample2) {
	//build plots with the data for the selected sample
	getPlots(sample2);
	getMetadata(sample2);
}

//Initialize the dashboard
init();
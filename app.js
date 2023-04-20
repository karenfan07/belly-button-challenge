const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
  console.log(data);
});

function main() {


    let dropdown = d3.select("#selDataset");


    d3.json(url).then((data) => {

        let names = data.names;


        names.forEach((id) => {



            dropdown.append("option")
            .text(id)
            .property("value",id);
        });


        let sample_one = names[0];



        Meta(sample_one);
        Bar(sample_one);
        Bubble(sample_one);
        buildGauge(sample_one);

    });
};

function Meta(sample) {

    d3.json(url).then((data) => {

        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == sample);

         console.log(value)


        let valueData = value[0];


        d3.select("#sample-metadata").html("");

        Object.entries(valueData).forEach(([key,value]) => {

         console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};


function Bar(sample) {


    d3.json(url).then((data) => {


        let sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];


        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;


        console.log(otu_ids,otu_labels,sample_values);


        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();


        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };


        let layout = {
            title: "Top 10 OTUs Present"
        };


        Plotly.newPlot("bar", [trace], layout)
    });
};

function Bubble(sample) {


    d3.json(url).then((data) => {


        let sampleInfo = data.samples;


        let value = sampleInfo.filter(result => result.id == sample);


        let valueData = value[0];


        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;


        console.log(otu_ids,otu_labels,sample_values);


        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };


        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

function buildGauge(sample) {
  console.log("sample", sample);

  d3.json("samples.json").then(data =>{

    var objs = data.metadata;

    var matchedSampleObj = objs.filter(sampleData =>
      sampleData["id"] === parseInt(sample));

    gaugeChart(matchedSampleObj[0]);
 });
}

function gaugeChart(data) {
      console.log("gaugeChart", data);

      if(data.wfreq === null){
        data.wfreq = 0;

      }

      let degree = parseInt(data.wfreq) * (180/10);


      let degrees = 180 - degree;
      let radius = .5;
      let radians = degrees * Math.PI / 180;
      let x = radius * Math.cos(radians);
      let y = radius * Math.sin(radians);

      let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';

      let path = mainPath.concat(pathX, space, pathY, pathEnd);

       var arrColorsG = ['rgba(6, 51, 0, .5)', 'rgba(9, 77, 0, .5)',
                               'rgba(12, 102, 0 ,.5)', 'rgba(14, 127, 0, .5)',
                               'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)',
                               'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)',
                               'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)'
                        ];

      let trace = [
            { type: 'scatter',
             x: [0], y:[0],
              marker: {size: 50, color:'2F6497'},
              showlegend: false,
              name: 'WASH FREQ',
              text: data.wfreq,
              hoverinfo: 'text+name'},
            { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
            textinfo: 'text',
            textposition:'inside',
            textfont:{
              size : 15,
              },
            marker: {colors:[...arrColorsG]},
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
            hoverinfo: 'text',
            hole: .5,
            type: 'pie',
            showlegend: false
          }];

      let layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '#2F6497',
            line: {
              color: '#2F6497'
            }
          }],

        title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
        height: 550,
        width: 550,
        xaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
      };

      Plotly.newPlot('gauge', trace, layout, {responsive: true});

}

function Changed(value) {


    console.log(value);


    Meta(value);
    Bar(value);
    Bubble(value);
    buildGauge(value);
};

// Call the main function
main();

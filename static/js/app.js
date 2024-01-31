// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Use D3 to read in samples then console log it
d3.json(url).then(function(data) {
  console.log("Data loaded successfully:", data); // Log to display data loaded successfully
});

// init function to load data into the dashboard
function init() {
    let dropdownMenu = d3.select("#selDataset"); // Select the dropdown menu
    d3.json(url).then((data) => {
        let names = data.names; // Set variable for the sample names

        // Loop to add samples to the dropdown menu
        for (let i = 0; i < names.length; i++) {
            console.log(names[i]);
            dropdownMenu.append("option").text(names[i]).property("value", names[i]);
        }

        let initialSample = names[0]; // Set the initial sample data

        // Log the value of the initial sample and call all functions selected sample
        console.log(initialSample);
        loadMetadata(initialSample);
        loadBarchart(initialSample);
        loadBubblechart(initialSample);
    });
};

// Function that populates metadata information based on the selected sample
function loadMetadata(sample) {
    // Fetch data from the specified URL
    d3.json(url).then((data) => {
        let metadata = data.metadata; // Extract metadata information from the fetched data

        let selectedMetadata = metadata.find(entry => entry.id == sample); // Find the metadata entry that matches to the selected sample
        console.log(selectedMetadata); // Log the metadata entry for the selected sample
        d3.select("#sample-metadata").html(""); // Clear any existing content in the metadata panel

        // A loop to iterate over key/value pairs of the selected metadata
        for (let [key, value] of Object.entries(selectedMetadata)) {
            console.log(key, value); // Log individual key-value pairs to the console
            d3.select("#sample-metadata").append("h5").html(`<b>${key.toUpperCase()}:</b> ${value}`); // Append key-value pairs as text elements to the metadata panel
        }
    });
};

// Function that creates the horizontal bar chart based on the selected sample
function loadBarchart(sample) {
    // Use D3 to retrieve all data
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.id == sample); // Filter out the specific sample data based on the sample ID

        let valueData = value[0]; // Get the first index from the array

        let otuId = valueData.otu_ids;
        let otuLabel = valueData.otu_labels;
        let sampleValue = valueData.sample_values;

        console.log(otuId, otuLabel, sampleValue); // Log the data to the console

        // Arrays to store top ten bacteria samples
        let yticks = [];
        let xticks = [];
        let labels = [];
        
        // Loop to get the top ten bacteria samples
        for (let i = 0; i < 10; i++) {
            yticks.push(`OTU ${otuId[i]}`);
            xticks.push(sampleValue[i]);
            labels.push(otuLabel[i]);
        }

        // Trace for the bar chart
        let trace1 = {
            x: xticks.reverse(),
            y: yticks.reverse(),
            text: labels.reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: "Burlywood"
            }            
        };

        // Setup the layout
        let layout = {
            title: "Top 10 <b>Operational Taxonomic Units</b> found"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace1], layout);
    });
};

// Function that builds the bubble chart based on the selected sample
function loadBubblechart(sample) {
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {        
        let sampleInfo = data.samples; // Retrieve all sample data

        let value = sampleInfo.filter(result => result.id == sample); // Filter out the specific sample data based on the sample ID

        let valueData = value[0]; // Get the first index value

        let otuId = valueData.otu_ids;
        let otuLabel = valueData.otu_labels;
        let sampleValue = valueData.sample_values;

        console.log(otuId,otuLabel,sampleValue); // Log the data to the console        
        // Trace for the bubble chart
        let trace2 = {
            x: otuId,
            y: sampleValue,
            text: otuLabel,
            mode: "markers",
            marker: {
                size: sampleValue,
                color: otuId,
                colorscale: "Earth"
            }
        };

        // Set up layout
        let layout = {
            title: "<b>Bacteria Bubble Chart</b>",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace2], layout) // use Plotly to plot the bubble chart
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(item) {
    // Log the new selected sample value and call all functions again for the newly selected sample
    console.log(item); 
    loadMetadata(item);
    loadBarchart(item);
    loadBubblechart(item);
};

// Call the initialize function
init();
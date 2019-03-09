/**
 * New node file
 */
var fs = require('fs'), stream = require('stream'), es = require('event-stream');
var lineNr = 0;
// Constants

const source_file = 'data/FoodFacts.csv';
const fatcarbs_file = 'data/fatcarbs.json';
const sugarsalt_file = 'data/sugarsalt.json';

const northEurope = [ "United Kingdom", "Denmark", "Sweden", 'Norway' ];
const centralEurope = [ "France", "Belgium", "Germany", 'Switzerland', 'Netherlands' ];
const southEurope = [ "Portugal", "Greece", "Italy", 'Spain', 'Croatia', 'Albania' ];
const fatKey = 'fat';
const proteinsKey = 'proteins';
const carbohydratesKey = 'carbohydrates';
const northEuropeKey = 'North Europe';
const centralEuropeKey = 'Central Europe';
const southEuropeKey = 'South Europe';
const sugarSalt_Countries = [ "Netherlands", "Canada", "United Kingdom",
		"United States", "Australia", "France", "Germany", "Spain",
		"South Africa" ];

var fatcarbs = {};
var sugarsalt = {};

var fatcarbs_end = {};
var sugarsalt_end = {};
var csvHeader = "";

var csvToJSON = function(header, line) {
	var headers = header.split(',');
	var jsonObj = {};
	line = line.toString().replace(/"/g, '');
	var data = line.split(',');
	// if (data.length == headers.length) {
	// var obj = {};
	for (var j = 0; j < headers.length; j++) {
		var key = headers[j];
		var value = data[j];
		jsonObj[headers[j]] = data[j];
	}
	// jsonObj.push(obj);
	// }
	return jsonObj;
}

var buildFatCarbs = function(jsonObj) {
	var country = jsonObj.countries_en;
	var fat = Number.parseInt(jsonObj.fat_100g);
	var carbohydrates = Number.parseInt(jsonObj.carbohydrates_100g);
	var proteins = Number.parseInt(jsonObj.proteins_100g);

	//console.log("value" + ":" + country + " | " + fat + " | "+ carbohydrates
	//			+ " | "+ proteins);
	// console.log("value" + ":" + fat + " | "+ carbohydrates + " | "+
	// proteins);

	var region = getRegionKey(country);
	if (region != null) {
		if (fat > 0) {
			addFatCarbs(fatcarbs, fatKey, region, fat);
		}
		if (carbohydrates > 0) {
			addFatCarbs(fatcarbs, carbohydratesKey, region, carbohydrates);
		}
		if (proteins > 0) {
			addFatCarbs(fatcarbs, proteinsKey, region, proteins);
		}
	}
}

var buildSugarSalts = function(jsonObj) {
	var country = jsonObj.countries_en;

	if (sugarSalt_Countries.indexOf(country) < 0) {
		return;
	}

	var sugar = Number.parseInt(jsonObj.sugars_100g);
	var salt = Number.parseInt(jsonObj.salt_100g);
	sugar = sugar > 0 ? sugar : 0;
	salt = salt > 0 ? salt : 0;
	var data = sugarsalt["data"];
	if (data == null) {
		data = [];
	}

	var isAdded = false;
	if (data != null) {
		data.forEach(function(item) {
			if (item.country == country) {
				item.sugar = item.sugar + sugar;
				item.salt = item.salt + salt;
				isAdded = true;
			}
		});
	}
	if (!isAdded) {
		data.push({
			country : country,
			sugar : sugar,
			salt : salt
		});
	}
	sugarsalt["data"] = data;
}

var addFatCarbs = function(jsonObject, energyKey, region, value) {
	var energyList = jsonObject[energyKey];
	if (energyList) {
		var isAdded = false;
		energyList.forEach(function(item) {
			if (item.region == region) {
				item.value = item.value + value;
				isAdded = true;
			}
			if (item.region == region) {
				item.value = item.value + value;
				isAdded = true;
			}
			if (item.region == region) {
				item.value = item.value + value;
				isAdded = true;
			}
		});
		if (!isAdded) {
			energyList.push({
				region : region,
				value : value
			});
		}
	} else {
		jsonObject[energyKey] = [ {
			region : region,
			value : value
		} ];
	}
};

var findInArray = function(inputArray, inputValue){
    var outputValue = false;
    inputArray.map(function(value){
        if (value === inputValue){
        	outputValue = true;
        }
    });
    return outputValue;
};

var getRegionKey = function(country) {
	if (findInArray(northEurope, country)) {
		return northEuropeKey;
	}
	if (findInArray(centralEurope, country)) {
		return centralEuropeKey;
	}
	if (findInArray(southEurope, country)) {
		return southEuropeKey;
	}
	return null;
};

var buildJson = function() {

	return (new Promise(function(resolve, reject) {
		var s = fs.createReadStream(source_file).pipe(es.split()).pipe(
				es.mapSync(function(line) {
					s.pause();
					lineNr += 1;
					if (lineNr != 1) {
						var jsonObj = csvToJSON(csvHeader, line);
						// FatCarbs
						buildFatCarbs(jsonObj);
						// SugarSalts
						buildSugarSalts(jsonObj);
						s.resume();
					} else {
						csvHeader = line;
						s.resume();
					}
				}).on('error', function(err) {
					// console.log('Error while reading file.', err);
				}).on('end', function() {
					writeJson(fatcarbs, fatcarbs_file);
					writeJson(sugarsalt, sugarsalt_file);
					resolve([fatcarbs, sugarsalt])
				}));
	}));

};

var writeJson = function(jsonOutput, fileLocation) {
	const
	content = JSON.stringify(jsonOutput);
	fs.writeFile(fileLocation, content, 'utf8', function(err) {
		if (err) {
			return console.log(err);
		}
	});
};


module.exports = buildJson;

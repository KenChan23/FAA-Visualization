var fs = require('fs'),
    readline = require('readline');

var events = {events:[]};
var obj = {};
var counter = 0;

var rd = readline.createInterface({
    input: fs.createReadStream('AviationData.txt'),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
  if(counter === 0) {
    counter++;
  }
  else {
    line = line.split(' | ');

    (line[0]) ? obj['id'] = parseInt(line[0]) : obj['id'] = null;
    (line[1]) ? obj['investigation_type'] = line[1] : obj['investigation_type'] = null;
    (line[2]) ? obj['accident_number'] = line[2] : obj['accident_number'] = null;
    (line[3]) ? obj['event_date'] = line[3] : obj['event_date'] = null;
    (line[4]) ? obj['location'] = line[4] : obj['location'] = null;
    (line[5]) ? obj['country'] = line[5] : obj['country'] = null;
    (line[6]) ? obj['latitude'] = parseInt(line[6]) : obj['latitude'] = null;
    (line[7]) ? obj['longitude'] = parseInt(line[7]) : obj['longitude'] = null;
    (line[8]) ? obj['airport_code'] = line[8] : obj['airport_code'] = null;
    (line[9]) ? obj['airport_name'] = line[9] : obj['airport_name'] = null;
    (line[10]) ? obj['injury_severity'] = line[10] : obj['injury_severity'] = null;
    (line[11]) ? obj['aircraft_damage'] = line[11] : obj['aircraft_damage'] = null;
    (line[12]) ? obj['aircraft_category'] = line[12] : obj['aircraft_category'] = null;
    (line[13]) ? obj['registration_number'] = line[13] : obj['registration_number'] = null;
    (line[14]) ? obj['make'] = line[14] : obj['make'] = null;
    (line[15]) ? obj['model'] = line[15] : obj['model'] = null;
    (line[16]) ? obj['amateur_built'] = line[16] : obj['amateur_built'] = null;
    (line[17]) ? obj['number_of_engines'] = parseInt(line[17]) : obj['number_of_engines'] = null;
    (line[18]) ? obj['engine_type'] = line[18] : obj['engine_type'] = null;
    (line[19]) ? obj['FAR_description'] = line[19] : obj['FAR_description'] = null;
    (line[20]) ? obj['schedule'] = line[20] : obj['schedule'] = null;
    (line[21]) ? obj['purpose_of_flight'] = line[21] : obj['purpose_of_flight'] = null;
    (line[22]) ? obj['air_carrier'] = line[22] : obj['air_carrier'] = null;
    (line[23]) ? obj['total_fatal_injuries'] = parseInt(line[23]) : obj['total_fatal_injuries'] = null;
    (line[24]) ? obj['total_serious_injuries'] = parseInt(line[24]) : obj['total_serious_injuries'] = null;
    (line[25]) ? obj['total_minor_injuries'] = parseInt(line[25]) : obj['total_minor_injuries'] = null;
    (line[26]) ? obj['total_uninjured'] = parseInt(line[26]) : obj['total_uninjured'] = null;
    (line[27]) ? obj['weather_condition'] = line[27] : obj['weather_condition'] = null;
    (line[28]) ? obj['broad_phase_of_flight'] = line[28] : obj['broad_phase_of_flight'] = null;
    (line[29]) ? obj['report_status'] = line[29] : obj['report_status'] = null;
    (line[30]) ? obj['publication_date'] = line[30] : obj['publication_date'] = null;
    console.log(line);
    events.events.push(obj);
    obj = {};
  }
}).on('close', function() {
    fs.writeFile('aviation_data.json', JSON.stringify(events, null, 4), function(error){
      if (error) throw error;
      else {
        console.log('File has been written');
         process.exit(0);
      }
    });
});


//  Check:	https://stackoverflow.com/questions/24316355/multiple-controllers-with-angularjs-in-single-page-app
//			https://angular-ui.github.io/bootstrap/

var sensorID = "00001C00000000000001000001000A00";
var	iotBrokerUrl = "http://155.54.210.176:8060/ngsi10/queryContext";

var dataHandler = function(response, status, xhr) {
	var nElements = 0;
	var events = [];
	var temperatureValues = [];
	var attributes;
	
	console.log(response);
	
	if (response.contextResponses.length > 0) {
		attributes = response.contextResponses[0].contextElement.attributes;
		nElements = attributes.length;
		
	}
	
	$("#fetchResult").html(nElements + " datasets retrieved.");
	$("#fetchResult").css("color", "#00B000");
	
	if (nElements>0) {
		
		for (i=0; i<nElements; i++) {
			// Get event and temmperature infos
			if (attributes[i].name=="temperature") {
				var dateTime = attributes[i].metadata[0].value
				var date = dateTime.split("T")[0];
				var time = (dateTime.split("T")[1]).split(".")[0];
				events.push( {"date": date, "time": time, "event": attributes[i].metadata[1].value});
				temperatureValues.push( {"x": dateTime, "y": attributes[i].contextValue});
			}
		}
		
		updateEventTable(events);
		// updateTemperatureChart(temperatureValues);
		// temperatureChart.data = temperatureValues;
	}
	
	/*
	tvalues1 = [
		{x: "2018-05-09T10:03:36.814711517Z", y: "24.81"},
		{x: "2018-05-09T10:03:43.75103373Z", y: "24.88"},
		{x: "2018-05-09T10:03:52.276741141Z", y: "25"},
		{x: "2018-05-09T10:03:58.009244337Z", y: "25"},
		{x: "2018-05-09T10:04:00.751483051Z", y: "25"}
		];
		
	tvalues2 = [
        [{x: "2018-05-26T08:33:20.519786857Z", y: "5.34"},{x: "2018-05-26T08:34:20.519786857Z", y: "35.25"},{x: "2018-05-26T08:35:20.519786857Z", y: "30"},{x: "2018-05-29T08:36:20.519786857Z", y: "10.01"}]
    ];;
		
	//temperatureChart.data = [tvalues1];
	*/
	updateTemperatureChart([temperatureValues]);
};

function fetchData() {
	var dTo=toDate.value;
	var dFrom=fromDate.value;
	var range=dFrom + "T00:00:00+0000/" + dTo + "T24:00:00+0000";
	console.log("Fetching data... Daterange: " + range);

	var requestBody = {
	  "entities": [
		{
		  "id": sensorID
		}
	  ],
	  "restriction": {
		"attributeExpression": "",
		"scopes": [
		  {
			"scopeType": "ISO8601TimeInterval",
			"scopeValue": range
		  }
		]
	  }
	};
	
	//$.post(iotBrokerUrl, requestBody, dataHandler, "json");
	$.ajax({
		url: iotBrokerUrl,
		type: 'post',
		data: JSON.stringify(requestBody),
		headers: {
			'Content-type': 'application/json',   
			'Accept': 'application/json'  
		},
		dataType: 'json',
		success: dataHandler,
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			$("#fetchResult").html("Error: " + XMLHttpRequest.status + " " + errorThrown);
			$("#fetchResult").css("color", "red");
        }       

	});
	
};

var mainApp = angular.module('app', ['ngTouch', 'ui.grid', 'ui.bootstrap', 'chart.js']);

mainApp.controller('MainCtrl', ['$scope', function ($scope) {
  $scope.updateData = function(data) {
     $scope.gridOpts.data = data;
	 $scope.gridOpts.sortInfo = { fields: ['date'], directions: ['asc'] };
	 // $scope.gridOpts.reload();
  };
 
  window.updateEventTable = $scope.updateData;
 
 
  var columnDefs1 = [
    { name: 'date' },
    { name: 'time' },
    { name: 'event' }
  ];
 
 
 
  $scope.gridOpts = {
    columnDefs: columnDefs1,
    data: []
  };
}]);



mainApp.controller('DatepickerFromCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.setFromDate = function() {
    $scope.fromPopup.opened = true;
  };

  
  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['yyyy-MM-dd','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.fromPopup = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
});

mainApp.controller('DatepickerToCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.setToDate = function() {
    $scope.toPopup.opened = true;
  };

  
  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.toPopup = {
    opened: false
  };
  
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
  

});

mainApp.controller("TemperatureCtrl", function ($scope) {
    //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Temperature'];
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1',
		fill: false
    }];
    $scope.options = {
        scales: {
            xAxes: [{
				type: 'time',
				time: {
					min: "2018-04-26T00:00:00+0000",
					max: "2018-06-08T24:00:00+0000"
				}
			}],
			yAxes: [{
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left',
				ticks: {
                    suggestedMin: 0,
                    suggestedMax: 30
                }
            }]
        },
		multiTooltipTemplate: function(label) {
			return label.label + ': --- ' + label.value;
		}

    };
	
    $scope.data = [
        [{x: "2018-04-26T08:33:20.519786857Z", y: "23"},{x: "2018-04-26T08:34:20.519786857Z", y: "24"},{x: "2018-04-26T08:35:20.519786857Z", y: "30"},{x: "2018-04-29T08:36:20.519786857Z", y: "10"}]
    ];

	$scope.updateData = function(data) {
		window.temperatureChart.data = data;
		window.temperatureChart.options.scales.xAxes[0].time = {
						min: fromDate.value + "T00:00:00+0000",
						max: toDate.value + "T24:00:00+0000" 
					};
					
	};
 
	// store globally to make it more easily referenceable
	window.updateTemperatureChart = $scope.updateData;
	window.temperatureChart = $scope;

});

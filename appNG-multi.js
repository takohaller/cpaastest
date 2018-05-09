//  Check:	https://stackoverflow.com/questions/24316355/multiple-controllers-with-angularjs-in-single-page-app
//			https://angular-ui.github.io/bootstrap/

var sensorID = "00001C00000000000001000001000A00";
var	iotBrokerUrl = "http://155.54.210.176:8060/ngsi10/queryContext";

var dataHandler = function(response, status, xhr) {
	var nElements = 0;
	
	console.log(response);

	if (response.contextResponses.length > 0) {
		nElements = response.contextResponses[0].contextElement.attributes.length;
		
	}
	
	$("#fetchResult").html(nElements + " datasets retrieved.");
	$("#fetchResult").css("color", "#00B000");
	
	if (nElements>0) {
		updateEvents("test");
	}
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

var mainApp = angular.module('app', ['ngTouch', 'ui.grid', 'ui.bootstrap']);

mainApp.controller('EventDataCtrl', function($scope) {
 
  // global variable to allow easier access...
  window.eventData = [
    {
        date: "2018-05-13",
        time: "13:35",
        event: "motion"
    },
    {
        date: "2018-05-13",
        time: "13:36",
        event: "interval"
    },
    {
        date: "2018-05-13",
        time: "13:37",
        event: "button"
    },
    {
        date: "2018-05-14",
        time: "13:35",
        event: "motion"
    },
    {
        date: "2018-05-14",
        time: "13:36",
        event: "motionX"
    },
    {
        date: "2018-05-14",
        time: "13:40",
        event: "button"
    },
    {
        date: "2018-05-15",
        time: "13:35",
        event: "motion"
    }
  ];
  
  this.myData = window.eventData;
  
	var updateEventTable = function(data) {
		window.eventData = {date: "", time: "", event: data}  //ERROR : "this" has a different scope here, 
		// this.reload();
	};

	// updateEventTable();
	
	window.updateEvents = updateEventTable;
	
	


  
});


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


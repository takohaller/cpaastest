angular.module('app', ['ngTouch', 'ui.grid'])
  .controller('MainCtrl', MainCtrl);
 
function MainCtrl() {
  this.myData = [
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
        event: "motion"
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
  
	// When the user scrolls the page, execute myFunction 
	window.onscroll = function() {scrollFunction()};

	// Get the header
	var header = document.getElementById("myHeader");

	// Get the offset position of the navbar
	var sticky = header.offsetTop;

	// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
	function scrollFunction() {
	  if (window.pageYOffset >= sticky) {
		header.classList.add("sticky");
	  } else {
		header.classList.remove("sticky");
	  }
}
}


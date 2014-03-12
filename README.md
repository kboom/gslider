=GSlider
=======

== What does it do?

This is a simple jQuery-based slider. See the attached example to see what it can do.

== How to use it?

Include the required dependencies in your HTML file.

Include the following markup in your HTML:

```
	<div id="grabDropBar">
	  <div name="bar"><div name="handle"></div></div>
	  <input name="value" hidden="true" type="number" value="2" />
	</div>
```

Call the javascript function when page loads:

```
	$('#maxMinAlertingBar').gslider({
		/* your configuration */
	});
```

```
      locked: false,
			minColor: "#f9f9f9",
			maxColor: "#eaeaea",
			handleColor: "#f0f0f0",
			barActiveStyle: "bar gslider-bar",
			handleActiveStyle: "handle gslider-handle unselectable",
			barInactiveStyle: "bar gslider-bar",
			handleInactiveStyle: "handle gslider-handle unselectable",
			seekbarActiveStyle: "ui striped blue progress gslider",
			seekbarInactiveStyle: "ui striped grey progress gslider",
			onMaximized: function() { },
			onMinimized: function() { },
			onHandleGrab: function() { },
			onHandleDrop: function() { },
			valueAxis: [],
			labelAxis: [],
			defaultValue: undefined
```

#GSlider
=======

This is a simple jQuery-based slider. See the attached example to see what it can do.

## How do I use it?

Include the required dependencies in your HTML file.

Include the following markup in your HTML:

```
<div id="yourSeekbar">
  <div name="bar"><div name="handle"></div></div>
  <input name="value" hidden="true" type="number" value="2" />
</div>
```

Call the javascript function when page loads:

```
$('#yourSeekbar').gslider({
	/* your configuration */
});
```

## Configuration options

You can use any of those options, just push it into the json configuration object.
The following values are the default ones.

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

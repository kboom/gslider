(function($) {
			
	var getClosestValues = function(a, x) {
		var lo, hi;
		for (var i = a.length; i--;) {
			if (a[i] <= x && (lo === undefined || lo < a[i])) lo = a[i];
			if (a[i] >= x && (hi === undefined || hi > a[i])) hi = a[i];
		};
		return [lo, hi];
	}
	
	var getNearestValue = function(lo, hi, val) {
		var loError = val - lo;
		var hiError = hi - val;
		return loError < hiError ? lo : hi;
	}
	
	var roundToDisplay = function(value) {
		return Math.round(value);
	}
	
	var roundToNearestValue = function(value) {
		var percentageAxis = this.percentageAxis;
		if(percentageAxis === undefined) return roundToDisplay(value);		
		var hilo = getClosestValues(percentageAxis, value);
		var nearestValue = getNearestValue(hilo[0], hilo[1], value);
		return nearestValue;
	}
	
	var recalculatePointIndex = function(roundedPercentage) {
		this.pointIndex = this.percentageAxis.indexOf(roundedPercentage);
	};
	
	var setPosition = function(value) {
		if(this.valueAxis === undefined) setPositionByPercentage.call(this, value);
		else setPositionByValue.call(this, value);
	};
	
	var setPositionByValue = function(value) {
		if(this.valueAxis === undefined) throw "Cannot set position by value when no value axis is defined";
		var pointIndex = this.pointIndex = this.valueAxis.indexOf(parseInt(value));
		setPositionByPercentage.call(this, this.percentageAxis[pointIndex]);
	};
		
	var setPositionByPercentage = function(percentage) {
		if(percentage < 0) return Exception("percentage cannot be less than 0");
		if(percentage > 100) throw Exception("percentage cannot be more than 100");
		var roundedPercentage = roundToNearestValue.call(this, percentage);
		if(this.valueAxis !== undefined) {
			recalculatePointIndex.call(this, roundedPercentage);
			this.$input.val(this.valueAxis[this.pointIndex]);
			this.$handle.text(this.labelAxis[this.pointIndex]);
		} else {
			this.$input.val(roundedPercentage);
			this.$handle.text(roundedPercentage);
		}
		this.$input.trigger("change");
	};
	
	var trackHandleMotion = function(event) {
		var currentXPos = event.pageX;
		var startXPos = this.startXPos;
		var startXSize = this.startXSize;
		var startXLeftBnd = this.startXLeftBnd;
		var startXRightBnd = this.startXRightBnd;
		var marginLeft = this.marginLeft;
		var marginRight = this.marginRight;
		
		if(currentXPos > startXRightBnd + marginRight) return;
		if(currentXPos < startXLeftBnd - marginLeft) return;
		
		var offsetXLeftBnd = currentXPos - startXLeftBnd;
		var scale = offsetXLeftBnd / startXSize;
		if(scale > 1) scale = 1;
		else if(scale < 0) scale = 0;
		setPositionByPercentage.call(this, scale * 100);
	};
		
	var startTrackingHandleMotion = function(event) {
		if(this.locked) return;
		var that = this;
		if(that.locked) return;
		var startXSize = this.startXSize = this.$body.width();
		var startXLeftBnd = this.startXLeftBnd = this.$body.offset().left;
		$(document).on("mousemove.handle", function(event) { trackHandleMotion.call(that, event); });
	};
		
	var stopTrackingHandleMotion = function(event) {
		if(this.locked) return;
		$(document).off("mousemove.handle");
		if(this.valueAxis === undefined) {
			var currentInputValue = parseInt(this.$input.val());
			if(currentInputValue === 100) this.onMaximized();
			else if(currentInputValue === 0) this.onMinimized();
		} else {
			var currentIndex = this.currentIndex;
			if(currentIndex === this.valueAxis.length - 1) this.onMaximized();
			else if(currentIndex === 0) this.onMinimized();
		}
	};
	
	var lockAtMax = function() {
		unlock.call(this);
		maximize.call(this);
		lock.call(this);
	};
	
	var lockAtMin = function() {
		unlock.call(this);
		minimize.call(this);
		lock.call(this);
	};
	
	var maximize = function() {
		setPositionByPercentage.call(this, 100);
	};
	
	var minimize = function() {
		setPositionByPercentage.call(this, 0);
	};
	
	var lock = function() {
		if(this.locked) return;
		this.locked = true;
		pushStyles.call(this);
	};
	
	var unlock = function() {
		if(!this.locked) return;
		this.locked = false;
		pushStyles.call(this);
	};
	
	var inputChanged = function() {
		var percentage = this.pointIndex === undefined ? this.$input.val() : this.percentageAxis[this.pointIndex];
		this.$bar.css("width", percentage+"%");
		var leftOffset = this.$body.width() * (percentage / 100) - this.marginLeft;
		var $handle = this.$handle;
		if(percentage == 0) {
			$handle.css("background-color", this.minColor);
		} else if(percentage == 100) {
			$handle.css("background-color", this.maxColor);
		} else $handle.css("background-color", this.handleColor);
		$handle.css("left", leftOffset+"px");
	};
	
	var pushStyles = function() {
		if(this.locked) pushLockedStyle.call(this);
		else pushUnlockedStyle.call(this);
	};
	
	var pushLockedStyle = function() {
		this.$bar.attr('class', this.barInactiveStyle);
		this.$handle.attr('class', this.handleInactiveStyle);
		this.$body.attr('class', this.seekbarInactiveStyle);		
	};
	
	var pushUnlockedStyle = function() {
		this.$bar.attr('class', this.barActiveStyle);
		this.$handle.attr('class', this.handleActiveStyle);
		this.$body.attr('class', this.seekbarActiveStyle);
	};
	
	var createPercentageAxis = function(points) {
		if(points.length < 2) return [];
		var percentageAxis = [];
		var pointsSize = points.length;
		var percentageDistance = 100 / (pointsSize - 1);
		percentageAxis[0] = 0;
		for(var i = 1; i < pointsSize - 1; i++) {
			percentageAxis[i] = i * percentageDistance;
		}
		percentageAxis[pointsSize - 1] = 100;
		return percentageAxis;
	};

	$.fn.gslider = function() {
	
		if(typeof arguments[0] == 'string') {
			var action = arguments[0];
			var fnToCall = undefined;
			switch(action) {
				case "setPositionByPercentage":
				fnToCall = setPositionByPercentage;
				break;
				case "setPositionByValue":
				fnToCall = setPositionByValue;
				break;
				case "lock":
				fnToCall = lock;
				break;
				case "unlock":
				fnToCall = unlock;
				break;
				case "lockAtMax":
				fnToCall = lockAtMax;
				break;
				case "lockAtMin":
				fnToCall = lockAtMin;
				break;
				default:
				break;
			}
			var fnargs = Array.prototype.slice(arguments, 1);
			var slider = $(this).data('gslider');
			fnToCall.apply(slider, fnargs);
			return this;
		};
		
		var settings = $.extend({
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
		}, arguments[0]);
	
		var pushData = function() {
			this.locked = settings.locked;
			this.minColor = settings.minColor;
			this.maxColor = settings.maxColor;
			this.handleColor = settings.handleColor;
			this.onMaximized = settings.onMaximized;
			this.onMinimized = settings.onMinimized;
			if(settings.labelAxis.length > 0 && settings.valueAxis.length > 0) {
				this.labelAxis = settings.labelAxis;
				this.valueAxis = settings.valueAxis;
				if(this.labelAxis.length != this.valueAxis.length) {
					throw "Number of values does not match number of labels for them";
				}
				this.pointIndex = 0;
				this.percentageAxis = createPercentageAxis(this.valueAxis);
			}			
			this.barActiveStyle = settings.barActiveStyle;
			this.handleActiveStyle = settings.handleActiveStyle;
			this.barInactiveStyle = settings.barInactiveStyle;
			this.handleInactiveStyle = settings.handleInactiveStyle;
			this.seekbarActiveStyle = settings.seekbarActiveStyle;
			this.seekbarInactiveStyle = settings.seekbarInactiveStyle;
		};
		
		var computeDimensions = function() {
			this.marginLeft = this.$handle.width() / 2 - 5;
			this.marginRight = this.$handle.width() / 2;
		};
	
		var Slider = function Slider(body) {
			var $body = this.$body = $(body);
			var $handle = this.$handle = $body.find("div[name=handle]");
			var $bar = this.$bar = $body.find("div[name=bar]");
			var $input = this.$input = $body.find("input");
		};	
		
		var grabbedHandle = undefined;
		
		return this.each(function() {
			var slider = new Slider(this);
			pushData.call(slider);
			pushStyles.call(slider);
			computeDimensions.call(slider);
			$(this).data('gslider', slider);
			slider.$input.change(function() { 
				inputChanged.apply(slider, arguments); 
			});
			slider.$handle.mousedown(function(e) {
				grabbedHandle = slider;
				settings.onHandleGrab();
				$("body").css("cursor", "move");				
				startTrackingHandleMotion.apply(slider, arguments); 
			});
			$(document).mouseup(function(e) {
				if(grabbedHandle !== slider) return;
				grabbedHandle = undefined;
				settings.onHandleDrop();
				$("body").css("cursor", "default");
				stopTrackingHandleMotion.apply(slider, arguments); 
			});
			if(settings.defaultValue !== undefined) {
				setPosition.call(slider, settings.defaultValue);
			} else {
				setPosition.call(slider, slider.$input.val());
			}
			return this;
		});
		
	};

})(jQuery);
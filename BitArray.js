/** @constructor */
function BitArray(length) {
	this.uint8 = new Uint8Array(length);
	this.size = 0;

}

BitArray.prototype.add = function(value, length, startFromLeft){
	if (typeof(value) == "number") {
		arr = makeLengthByAppendingZeros(toBin(value), 1);
		if (length) {
			if (startFromLeft) {
				value = leftMostBits(value, length);
			}
			else {
				value = rightMostBits(value, length);
			}
		}
		else { length = arr.length; }
		for (i = 0; i < length; i++) {
			console.log(arr[i]);
			this.uint8[(this.size/8)|0] += arr[i] * Math.pow(2, 7-(this.size%8));
			this.size++;
		}
	}
	else if (typeof(value) == "string") {
		for (i = 0; i < value.length; i++) {
			var bleh = makeLengthByPrependingZeros(toBin(value.charCodeAt(i)));
			this.add(bleh);
		}
	}
	else if (typeof(value) == "object") { //it'd better be an array
		value.forEach(function(v) { this.add(v); });
	}
		
};

BitArray.prototype.get = function(start, stop){
	stop = stop|this.size
	start = start|0
	
	arr = []
	for (i = start; i < stop; i++) {
		arr.push(getBit(this.uint8[(i/8)|0], 8-(i%8)));
	}
			
	return arr;
};


BitArray.prototype.toString = function(){
	str = ""
	for (i = 0; i < (this.size/8)|0; i++) {
		str += chr(this.uint8[i]);
	}

	if (this.size%8 != 0) {
		last = this.uint8[ (this.size/8)|0 + 1 ];
		last = fromBin(makeLengthByAppendingZeros(toBin(last), 8));
		str += chr(last);
	}
	return str;
	
};


BitArray.prototype.toArr = BitArray.prototype.get;










/** @constructor */
function StringStream(length) {
	this.num = 0;
	this.ch = '';
	this.size = 0;
}

StringStream.prototype.add= function(number) {

	this.num += number * Math.pow(2, 7-(this.size%8));
	this.size++;
	if (this.size == 8) {
		this.ch = chr(this.num);
	}
};

StringStream.prototype.get = function(force) {
	if (force) {
		if (this.size == 0) { return ''; }
		return chr(this.num);
	}

	if (this.ch != '') {
		this.num = 0;
		this.size = 0;
	}
	var t = this.ch;
	this.ch = '';
	return t;
};




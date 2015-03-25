
function rightMostBits(num, amount) {
    return (num % Math.pow(2,amount))|0
}

function fromBin(arr) {
	var num = 0, mult = 1;
	for (var i = arr.length-1; i >= 0; i--) {
		num += mult * arr[i];
		mult *= 2;
	}
	return num;
}

function toBin(num) {
	arr = [];
	while (num > 0) {
		arr.push(num%2);
		num = (num/2) | 0;
	}
	arr.reverse();
	return arr;
}
		

function esc(ch) {
	if (ch == '\\') {
       		ch = "\\\\"
	}
	if (ch == chr(0)) {
        	ch = "\\" + chr(0);
	}
   	return ch
}

function chr(num) {
	return String.fromCharCode(num);
}



function range(str) {
	var lowest = -1, highest = -1;
	for (i in str) {
		code = str.charCodeAt(i);
		if (code == 32) { continue; }
		if (code < lowest || lowest == -1) { lowest = code; }
		if (code > highest || highest == -1) { highest = code; }
	}

	return [highest, lowest];
}

function makeLengthByPrependingZeros(arr, length) {
	while (arr.length < length) {
		arr.splice(0, 0, 0);
	}
	return arr;
}

function makeLengthByAppendingZeros(arr, length) {
	while (arr.length < length) {
		arr.push(0);
	}
	return arr;
}

function getNumberOfBits(num) {
    if (num < 0) {
        console.log("getNumberOfBits(num, amount) doesn't work with neg num");
        return;
    }
    bits = 0;
    while (num > 0) {
	num = (num/2)|0;
	bits++;
    }
    return bits;
}

function NumberOfBits(num) {
	return getNumberOfBits(num);
}


function leftMostBits(num, amount, left) {
    if (num == 0) { return 0; }
    if (num < 0) {
        console.log("leftMostBits(num, amount) doesn't work with neg num");
        return;
    }

    length = left || getNumberOfBits(num);
    
    if (length - amount < 0) { return num; }
    return (num / Math.pow(2, (length - amount)))|0
}

function getBit(num, bit) {
	return ((num%Math.pow(2, bit)) / Math.pow(2, bit-1)) | 0;
}

function longestChain(numbers, start) {

    longest = []

    if (typeof numbers[start] === "string") {
        while (start < numbers.length && typeof numbers[start] === "string") {
            longest.push(numbers[start]);
            start++;
	}
        return longest;
    }

    for (n in numbers[start]) {
	number = numbers[start][n];
        current = number;
        arr = [];
        for (var i = start; i < numbers.length; i++) {
            if (numbers[i] instanceof Array && numbers[i].indexOf(current) != -1) {
                arr.push(current);
                current += 1;
	    }
            else { break; }
	}
        if (arr.length > longest.length) {
            longest = arr;
	}
    }
    return longest;
}


function getB4Locations(b4_words) {
	locations = {};
	
	for (i in b4_words) {
	    b4_word = b4_words[i];
	    if (locations[b4_word] != undefined) {
		locations[b4_word].push(parseInt(i));
	    }
	    else {
		locations[b4_word] = [parseInt(i)];
	    }
	}
	return locations;
}


function getBits(str, startBits, bits) {

	//console.log([str, startBits, bits]);
		

	loc = (startBits / 8) | 0;
	startBits = startBits % 8;
	a = [];


	while (bits > 0) {
		var amount = Math.min(bits, 8-startBits);

		if (loc >= str.length) {
			return -1;
		}

		right = rightMostBits(str.charCodeAt(loc), 8 - startBits);
		left = leftMostBits(right, amount, 8-startBits);


		//console.log("right: " + toBin(right));
		//console.log("left: " + toBin(left));
		
		
		n = makeLengthByPrependingZeros(toBin(left), amount);
		for (i in n) { a.push(n[i]); }

		bits -= amount;
		startBits = 0;
		loc++;
	}

	return a;
	
}

function string2bits(str) {
	var arr = [];
	for (s in str) {
		arr.push.apply(arr, makeLengthByPrependingZeros(toBin(str[s].charCodeAt(0)), 8));
	}
	return arr;
}

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
		this.ch += chr(this.num);
		this.size = 0;
		this.num = 0;
	}
};

StringStream.prototype.addArr= function(arr) {

	for (i in arr) {
		this.add(arr[i]);
	}

};

StringStream.prototype.get = function(force) {
	if (force) {
		if (this.size == 0 && this.num == 0) { return this.ch; }

		var c = this.ch + chr(this.num);
		this.num = 0;
		this.ch = '';
		this.size = 0;
		return c;
	}

	var t = this.ch;
	this.ch = '';
	return t;
};




function condense(after_words, lookup) {
	converted = []

	for (i in after_words) {
	    after_word = after_words[i];
	    if (lookup[after_word] != undefined) {
       		converted.push(lookup[after_word]);
	    }
    	    else {
        	converted.push(after_word);
	    }
	}

	return converted;
}

function expand(condensed, b4_words) {
	result = "";
	for (i in condensed) {
		c = condensed[i];
		if (c instanceof Array) {
			result += b4_words[c[0]] + " ";
		}
		else {
			result += c + " ";
		}
	}
	return result.substring(0, result.length-1);
}


function pack1(condensed) {
	start = 0;
	super_condensed = [];

	while (start < condensed.length) {
	    longest = longestChain(condensed, start)

	    if (longest.length == 0) {
		console.log("longest is 0, that's a problem");
		break;	    
	    }

	    start += longest.length;

	    if (typeof longest[0] === "string") {
		super_condensed.push(longest.join(' '));
	    }
	    else {
		super_condensed.push([longest[0], longest[longest.length-1]])
	    }
	}
	return super_condensed;
}

function unpack1(packed) {
	unpacked = []
	for (i in packed) {
		p = packed[i];
		if (p instanceof Array) {
			for (var n = p[0]; n <= p[1]; n++) {
				unpacked.push([n]);
			}
		}
		else {
			words = p.split(' ');
			for (word in words) {
				unpacked.push(words[word]);
			}
		}
	}
	return unpacked;
}





function pack2(unpacked) {

	console.log(unpacked);
	packed = "";
	
	s = new StringStream();
	var pos = -1	
		
	var size = 0;
	var largest = -1;


	var mod = 0;

	var toConvert = [];

	for (i in unpacked) {
		var p = unpacked[i];
		if (p instanceof Array) {
			if (pos != p[0]) {
				diff = p[0] - pos;
				
				if (diff > 0) {
					
					diff--;
					if (diff > 0) {
						console.log("D" + diff);
						toConvert.push([[1, 0], false]) // delete
						toConvert.push([toBin(pos + 1 + mod), true]);
						toConvert.push([toBin(diff), true]);

						var m = NumberOfBits(Math.max(pos+1+mod, diff));
						if (m > size) { size = m; }	

						mod -= diff;
					}
				}
				else {
					diff--;
					console.log("A" + diff);
					var length = 1 + p[1] - pos;


					toConvert.push([[0, 1], false]) // additionn
					toConvert.push([toBin(pos+1+mod), true]);
					toConvert.push([toBin(p[0]), true]);
					toConvert.push([toBin(-diff), true]);

					var m = NumberOfBits(Math.max(pos+1+mod, p[0]+mod, length));
					if (m > size) { size = m; }	

					mod -= diff;	
				}			
			}

			pos = p[1];
			if (pos > largest) { largest = pos; }
		}
		else {

			toConvert.push([[1, 1], false]) // adding string
			toConvert.push([toBin(pos+1 + mod), true]);
			toConvert.push([toBin(p.length), true, true, p]);
			
			mod += p.split(' ').length;
		}
	}


	packed = chr(size);
	for (var i = 0; i < toConvert.length; i++) {
		toC = toConvert[i];
		if (toC[1]) {
			s.addArr(makeLengthByPrependingZeros(toC[0], size));
			packed += s.get(toC[2]);
			if (toC[2]) { packed += toC[3]; }
		}
		else {
			s.addArr(toC[0]);
			packed += s.get(toC[2]);
		}	
	}

	packed += s.get(true);	
	packed += chr(largest+1);
	return packed;
}


function unpack2(packed, b4) {
    console.log(b4.length);
    toR = b4.slice();
    size = packed.charCodeAt(0);

    var totalLen = packed.charCodeAt(packed.length-1);
    packed = packed.slice(0, packed.length-1);

    toR = toR.slice(0, totalLen);

    for (var i = 8; i < (packed.length) * 8;) {
        
	var mode = fromBin(getBits(packed, i, 2));
	i += 2;

	console.log("mode: " + mode);
	if (mode == 1) { // add from origin


		var insertAt = fromBin(getBits(packed, i, size));
		i += size;
		var pos = fromBin(getBits(packed, i, size));
		i += size;
		var length = fromBin(getBits(packed, i, size));
		i += size;

		console.log("pos: " + pos + " length: " + length);

		toR = toR.slice(0,insertAt).concat(b4.slice(pos, pos+length)).concat(toR.slice(insertAt));

	}

	if (mode == 2) { //delete
	    	var pos = fromBin(getBits(packed, i, size));
		i += size;
		console.log("bits: " + getBits(packed, i, size)); 
		var diff = fromBin(getBits(packed, i, size));
		i += size;

		console.log(pos + " " + diff + " deleting: " + toR.splice(pos, diff));

	}

	if (mode == 3) { // add string
		var pos = fromBin(getBits(packed, i, size));
		i += size;
		var length = fromBin(getBits(packed, i, size));
		i += size;
		
		i += (8 - (i % 8)) % 8; // round up to the nearest multiple of 8
		
		string = packed.slice(i/8, i/8 + length)

		console.log('inserting: ' + string);

		toR = toR.slice(0,pos).concat(string.split(' ')).concat(toR.slice(pos));		
		i += length*8;
	}

    }
    return toR.join(' ');   
}


function zipString(str) {
	var arr = [];
	var r = range(str);
	var drop = r[1] - 1;
	var ran = 1 + r[0] - r[1];
	var bits = NumberOfBits(ran);
	var codes = [];
	for (i in str) {
		code = str.charCodeAt(i);
		if (code == 32) { code = 0; }
		else { code -= drop; }
		
		codes.push(code);
	}
	console.log('-----------------------------------------------------');
	console.log(codes);
	
	
	frequencies = {}

	for (c in codes) {
		code = codes[c];
		if (frequencies[code] == undefined) { frequencies[code] = 1; }
		else { frequencies[code]++; }
	}

	tree = []
	for (f in frequencies) {
		tree.push([parseInt(frequencies[f]), parseInt(f)]);
	}

	while (tree.length > 1) {
		tree.sort(function(a, b) { return b[0] - a[0]; });


		bottom = tree.splice(tree.length-2);
		n = [bottom[0][0] + bottom[1][0], []]

		
		n[1].push(bottom[0]);
		n[1].push(bottom[1]);

		tree.push(n);

	}
	
	tree = tree[0];

	var num = 0;
	t = tree;
	while (t[1].length > 0 && typeof(t[1][0]) == "object") {
		t = t[1][0];
		num++;
	}

	var pos = [];
	for (var o = 0; o < num; o++) { pos.push(0); }


	getNode = function(tree, pos) {
		t = tree;
		for (p in pos) {
			t = t[1][pos[p]];
		}
		return t;
	}

	var writePossibilities = [];

	recorder = function(tree, pos, arr) {
		node = getNode(tree, pos);

		if (typeof(node[1]) == "number") {
			writePossibilities.push(pos.slice());
			return;
		}
		
		arr.add(0);

		var cpy = pos.slice();



		cpy.push(0);
		test = JSON.stringify(cpy);
		recorder(tree, cpy, arr);

		cpy[cpy.length-1] = 1;
		arr.add(1);
		arr.add(0);

		recorder(tree, cpy, arr);

		arr.add(1);
	}

	message = new BitArray(1000);
	recorder(tree, [], message);
	arr = message.toArr();
	
	s = new StringStream();
	var block = chr(drop);
	for (a in arr) {
		s.add(arr[a]);
		block += s.get(false);
	}


	var SortedCodes = [];
	codesCopy = Object.keys(frequencies);
	codesCopy.sort(function(a, b) { return frequencies[b] - frequencies[a]; });

	console.log("codesCopy: " + JSON.stringify(codesCopy));	
	console.log("freq: " + JSON.stringify(frequencies));	

	var last;
	for (c in codesCopy) {
		if (last != codesCopy[c]) { SortedCodes.push(codesCopy[c]); }
		last = codesCopy[c];
	}

	var map = {};
	for (i in SortedCodes) {
		map[SortedCodes[i]] = i;
	}

	bitSize = bits;
	
	console.log(JSON.stringify(SortedCodes));
	for (c in SortedCodes) {
		var a = makeLengthByPrependingZeros(toBin(SortedCodes[c]), bitSize);
		for (i in a) {
			s.add(a[i]);
			block += s.get(false);
		}
	}
	
	

	for (c in codes) {
		var a = writePossibilities[ map[codes[c]] ];
		for (i in a) { s.add(a[i]); block += s.get(false); }	

	}

	var data = bitSize * Math.pow(2, 5); // bitSize is 3 bits, shift it right 5
	data += ((8 - s.size) % 8) * Math.pow(2, 2); // is 0-7 (3 bits), shifted right 2
	
	block += s.get(true);
	block += chr(data);
	console.log("---------------------------------------------");
	return block;
}



function unzipString(str) {

	end = str.charCodeAt(str.length-1);
	start = str.charCodeAt(0);

	var bitSize = leftMostBits(end, 3);
	var cutOff = rightMostBits( leftMostBits(end, 6), 3);

	str = str.substring(1, str.length-1);

	var arr = [];
	for (i in str) {
		arr.push.apply(arr, makeLengthByPrependingZeros(toBin(str[i].charCodeAt(0)), 8));
	}

	arr.splice(arr.length - cutOff, cutOff); // delete cutOff amount of bits from the end

	var d = 'l', currentSide = 'l', last = 0, t = [], bits = [], b = 0;
	while (b < arr.length) {	
		bit = arr[b];
		if (bit == 0) {
			t.push(d == 'l' ? 0 : 1);
			d = 'l';
		}
		else {
			if (last == 0) {
				bits.push(t.slice()); // copy of t
			}
			
			t.pop();
			if (t.length == 0) {
				if (currentSide == 'l') { currentSide = 'r'; }
				else { break; }
			}
			d = 'r';
		}
		last = bit;
		b++;
	}
	b++;


	var i = b, writes = [];
	for (times = 0; i < arr.length && times < bits.length; i+= bitSize, times++) {
		var a = [];
		for (var n = i; n < i+bitSize; n++) {
			a.push(arr[n]);
		}
		writes.push(fromBin(a));
	}

	console.log(JSON.stringify(writes));
	console.log(JSON.stringify(arr.slice(i)));

	bitsNumerical = [];
	for (bit in bits) {
		bitsNumerical.push([fromBin(bits[bit]), bits[bit].length]);
	}
	console.log(JSON.stringify(bitsNumerical));

	var num = 0, length = 0, ch = "";
	while (i < arr.length) {
		num = num*2 + arr[i];
		length++;

		var index = -1;
		for (var n in bitsNumerical) { 
			if (bitsNumerical[n][0] == num && bitsNumerical[n][1] == length) { index = n; break; }
		}

		if  (index != -1) {
			console.log(index + ", " +writes[index]);
			ch += ""+ writes[index] == 0 ? " " : chr(writes[index] + start);
			num = 0;
			length = 0;
		}
		i++;
	}
	
	return ch;
}


/** @constructor */
function Minifier(b4, after) {
	this.b4 = b4;
	this.after = after;

	this.b4_words = b4.split(' ');
	this.after_words = after.split(' ');

	this.level = 0;
	this.data = b4;
}

Minifier.prototype.condense = function(){
	
	if (this.level >= 2) { return; }


	if (this.level == 0) {
		this.data = getB4Locations(this.b4_words);
		this.data = condense(this.after_words, this.data);
	}
	if (this.level == 1) {
		this.data = pack2(pack1(this.data));
	}
	
	this.level++;
	return this.data;
};


Minifier.prototype.uncondense = function(){
	
	if (this.level <= 0) { return; }

	if (this.level == 1) {
		thing = "";
		for (i in this.data) {
			if (typeof this.data[i] == "string") {
				thing += this.data[i];
			}
			else {
				thing += this.b4_words[this.data[i]];
			}
			if (i < this.data.length-1) { thing += " "; }
		}
		this.level = 0;
		this.data = thing;
		return thing;
		
	}
	if (this.level == 2) {
		this.data = unpack2(this.data, this.b4_words);
	}
	
	this.level--;
	return this.data;
};


Minifier.prototype.getData = function(){
	return this.data;
};

Minifier.prototype.canCompressMore = function(){
	return this.level < 2;
};

Minifier.prototype.canUncompressMore = function(){
	return this.level > 0;
};



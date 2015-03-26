
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

	console.log("C: " + JSON.stringify(condensed));

	while (start < condensed.length) {
	    longest = longestChain(condensed, start)

	    if (longest.length == 0) {
		console.log("longest is 0, that's a problem");
		break;	    
	    }
	    console.log(longest);

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

	packed = "";
	
	s = new StringStream();
	var pos = -1	
		
	var size = 0;
	var largest = -1;


	var mod = 0;

	var toConvert = [];
	var arrayInARow = false;

	for (i in unpacked) {
		var p = unpacked[i];
		if (p instanceof Array) {
			if (arrayInARow) {
				diff = p[0] - pos;
				


				if (diff > 0) {
					
					diff--;
					if (diff > 0) {
						console.log("D" + diff);
						toConvert.push([[1, 0], false, false]) // delete
						toConvert.push([toBin(pos + 1 + mod), true, false]);
						toConvert.push([toBin(diff), true, false]);

						var m = NumberOfBits(Math.max(pos+1+mod, diff));
						if (m > size) { size = m; }	

						mod -= diff;
					}
				}
				else {
					diff--;
					if (diff < 0) {
						console.log("A" + diff);

						toConvert.push([[0, 1], false, false]) // additionn
						toConvert.push([toBin(pos+1+mod), true, false]);
						toConvert.push([toBin(p[0]), true, false]);
						toConvert.push([toBin(-diff), true, false]);

						var m = NumberOfBits(Math.max(pos+1+mod, p[0], -diff));
						if (m > size) { size = m; }	

						mod -= diff;
					}
				}			
			}

			pos = p[1];
			if (pos > largest) { largest = pos; }
			arrayInARow = true;
		}
		else {

			console.log("A" + p);

			toConvert.push([[1, 1], false, false]) // adding string
			toConvert.push([toBin(pos+1 + mod), true, false]);
			toConvert.push([toBin(p.length), true, true, p]);

			var m = NumberOfBits(Math.max(pos+1+mod, p.length));
			if (m > size) { size = m; }
			
			mod += p.split(' ').length;
			arrayInARow = false;
		}
	}


	console.log("size: " + size);
	size = size;
	packed = chr(size);
	console.log(JSON.stringify(toConvert));
	for (var i = 0; i < toConvert.length; i++) {
		toC = toConvert[i];
		if (toC[1]) {
			s.addArr(makeLengthByPrependingZeros(toC[0], size));
			packed += s.get(toC[2]);
			if (toC[2]) { packed += toC[3]; }
					}
		else {
			s.addArr(toC[0]);
			packed += s.get();
		}
	}

	packed += s.get(true);	
	packed += chr(largest+1);
	return packed;
}


function unpack2(packed, b4) {
    toR = b4.slice();
    size = packed.charCodeAt(0);

    var totalLen = packed.charCodeAt(packed.length-1);
    packed = packed.slice(0, packed.length-1);

    console.log("tot len: " + totalLen);

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
		
		console.log("adding (" + pos + ", " + size + ") at " + insertAt + ": " + b4.slice(pos, pos+length));

		toR = toR.slice(0,insertAt).concat(b4.slice(pos, pos+length)).concat(toR.slice(insertAt));

	}

	if (mode == 2) { //delete
	    	var pos = fromBin(getBits(packed, i, size));
		i += size;
		var diff = fromBin(getBits(packed, i, size));
		i += size;

		console.log("pos: " + pos + " length: " + diff + " deleting: " + toR.splice(pos, diff));

	}

	if (mode == 3) { // add string
		
		var pos = fromBin(getBits(packed, i, size));
		i += size;
		var length = fromBin(getBits(packed, i, size));
		i += size;
		
		i += (8 - (i % 8)) % 8; // round up to the nearest multiple of 8
		
		var string = packed.slice(i/8, i/8 + length)

		console.log("adding string: " + string);

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



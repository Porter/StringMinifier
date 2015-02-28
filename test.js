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

function pack2(unpacked) {
	packed = "";
	for (i in unpacked) {
		p = unpacked[i];
		if (p instanceof Array) {
			for (n in p) {
				start = p[n];
				num = 128
              			bitsLeft = 7


                		chrs = ""


				while (getNumberOfBits(start) >= bitsLeft) {

				    num += rightMostBits(start, bitsLeft)

				    start = (start /Math.pow(2,bitsLeft)) | 0

				    bitsLeft = 8

				    chrs += esc(chr(num))
				    num = 0
				}

				num += start
				if (num != 0) { chrs += esc(chr(num)); }

				packed += chrs + chr(0)
			}
		}
		else {
			packed += chr(127);
			for (part in p) {
				packed += esc(p[part]);
			}
			packed += chr(0);
		}
	}
	return packed;
}


function unpack2(packed) {
    i = 0
    l = []
    nums = []
    while (i < packed.length) {
        c = packed[i]

        if (c == chr(0)) {
		
            indicator = nums[0]/128
            nums[0] %= 128

	    if (indicator|0 == 1) {
		    multiplier = 1
		    num = 0
		    for (n in nums) {
			num += nums[n] * multiplier
			if (multiplier == 1) { multiplier = 128 }
			else { multiplier *= 256 }
		    }

		    l.push(num)
	     }
	     else {
		str = "";
		for (var a = 1; a < nums.length; a++) {
			num = nums[a];
			str += chr(num);
		}
		l.push(str);
	      }
	     nums = []
	}
        else {
            if (c == '\\') {
                i += 1
                if (i >= packed.length) {
                    console.log("Error, string ends in escape \\");
                    break;
		}
                c = packed[i];
	    }

            num = c.charCodeAt(0)
            nums.push(num)
	}

        i++;
    }
    fin = []
    for (var i = 0; i < l.length; i++) {
	if (typeof l[i] === "string") {
		fin.push(l[i]);
	}
	else {
		fin.push([ l[i], l[i+1] ]);
		i++;
    	}
    }
    return fin;
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


function zipString(str) {
	var arr = [];
	var r = range(str);
	var drop = r[1] - 1;
	var ran = 1 + r[0] - r[1];
	var bits = NumberOfBits(ran);
	var block = "";
	if (ran < 64) {
		block += chr(128 + ran);
		block += chr(drop);
		for (i in str) {
			code = str.charCodeAt(i);
			//console.log(code);
			if (code == 32) { code = 0; }
			else { code -= drop; }
			bin = makeLengthByPrependingZeros(toBin(code), bits);
			
			//arr.push(1);
console.log(bin.length);
			for (b in bin) { arr.push(bin[b]); }
		}
	}
	console.log('-----------------------------------------------------');
	console.log(arr);
	console.log(arr.length);
	console.log(bits);
	
	var slice = arr.splice(0, 8);
	while (slice.length > 0) {
		block += chr(fromBin(makeLengthByAppendingZeros(slice, 8)))

		console.log(makeLengthByAppendingZeros(slice, 8));

		slice = arr.splice(0, 8);
	}

var d;
bit = 16;
	//while ((d = getBits(block, bit, 8)) != -1) {
	//	console.log(d);
	//	bit += 8;
		
	//}


	while ((d = getBits(block, bit, bits)) != -1) {
		console.log(d);
		console.log(chr(fromBin(d) + drop));
		bit += bits;		
	}

	return block;
}



function unzipString(str) {
	return '';
	var arr = [];

	var drop = str.charCodeAt(1);
	
	var bit = 0;
	var d;
	while ((d = getBits(str, bit, 4)) != -1) {
		//console.log( getBits(str, bit, bits));
		bit += 4;
		
	}

	a = "";
	return a;	

}

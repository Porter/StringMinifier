
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



function zipString(str) {
	var arr = [];
	var r = range(str);
	var drop = r[1] - 1;
	var ran = 1 + r[0] - r[1];
	var bits = NumberOfBits(ran);
	var block = "";
	var codes = [];
	if (ran < 64) {
		block += chr(128 + ran);
		block += chr(drop);
		for (i in str) {
			code = str.charCodeAt(i);
			//console.log(code);
			if (code == 32) { code = 0; }
			else { code -= drop; }
			
			codes.push(code);
		}
	}
	console.log('-----------------------------------------------------');
	
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

	recorder = function(tree, pos, arr) {
		node = getNode(tree, pos);

		if (typeof(node[1]) == "number") {
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
	console.log(arr);
	
	s = new StringStream();
	block = "";
	for (a in arr) {
		s.add(arr[a]);
		block += s.get(false);
	}


	var SortedCodes = [];
	codes.sort(function(a, b) { return frequencies[b] - frequencies[a]; });	

	var last;
	for (c in codes) {
		if (last != codes[c]) { SortedCodes.push(codes[c]); }
		last = codes[c];
	}

	bitSize = 4;
	
	for (c in SortedCodes) {
		var a = makeLengthByPrependingZeros(toBin(SortedCodes[c]), bitSize);
		for (i in a) {
			s.add(a[i]);
			block += s.get(false);
		}
	}

	block += s.get(true);
	console.log("---------------------------------------------");
	return block;
}



function unzipString(str) {

	bitSize = 4;
	var arr = [];
	for (i in str) {
		console.log(str[i].charCodeAt(0));
		arr.push.apply(arr, makeLengthByPrependingZeros(toBin(str[i].charCodeAt(0)), 8));
	}

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

	for (var i = b, times = 0; i < arr.length && times < bits.length; i+= bitSize, times++) {
		var a = [];
		for (var n = i; n < i+bitSize; n++) {
			//console.log(n);
			a.push(arr[n]);
		}
		console.log(fromBin(a));
	}



	console.log(JSON.stringify(bits));

}



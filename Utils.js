
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

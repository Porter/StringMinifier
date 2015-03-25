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



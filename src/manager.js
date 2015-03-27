/** @constructor */
function Minifier(b4, after) {
	this.b4 = b4 || "";
	this.after = after || "";

	this.b4_words = this.b4.split(' ');
	this.after_words = this.after.split(' ');

	this.level = 0;
	this.data = b4;
}

Minifier.prototype.condense = function(){
	
	this.data = getB4Locations(this.b4_words);
	this.data = condense(this.after_words, this.data);
	this.data = pack1(this.data);
	console.log(this.data);

	this.data = pack2(this.data);
	
	return this.data;
};


Minifier.prototype.uncondense = function(Data, source){

	this.data = Data || this.data;
	if (source) {
		this.b4 = source;
		this.b4_words = source.split(' ');
	}
	
	this.data = unpack2(this.data, this.b4_words);

	return this.data;
};


Minifier.prototype.getData = function(){
	return this.data;
};


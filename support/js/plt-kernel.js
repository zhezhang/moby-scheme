

// Core classes
// Struct: implemented by all structures
// Equatable: implemented by things that can be compared by equal?



// Fixme: figure out how to do packages properly.
var org = {};
org.plt = {};



//////////////////////////////////////////////////////////////////////
// Kernel
org.plt.Kernel = {
  Struct: function () {
  },
  
  struct_question_: function(thing) {
    return thing instanceof this.Struct;
  },

  equal_question_ : function(x, y) {
    if ("isEqual" in x) {
      return x.isEqual(y);
    } else if ("isEqual" in y) {
      return y.isEqual(x);
    } else {
      return x == y;
    }
  },

  
  identity : function (x){
    return x;
  },

  _equal_ : function(x, y, args) {
    // FIXME: check against other args too.
    return org.plt.types.NumberTower.equal(x, y);
  },
  
  sub1 : function(x) {
    return org.plt.types.NumberTower.subtract(x, org.plt.types.Rational.ONE);
  },


  _plus_ : function(args) {
    var i, sum = org.plt.types.Rational.ZERO;
    for(i = 0; i < args.length; i++) {
      sum = org.plt.types.NumberTower.add(sum, args[i]);
    }
    return sum;
  },


  _star_ : function(args) {
    var i, prod = org.plt.types.Rational.ONE;
    for(i = 0; i < args.length; i++) {
      prod = org.plt.types.NumberTower.multiply(prod, args[i]);
    }
    return prod;    
  }
};




//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Types

org.plt.types = {};

(function() {
   function gcd(a, b) {
     var t;
     while (b != 0) {
       t = a;
       a = b;
       b = t % b;
     }
     return a;
   }


   // Rationals

   org.plt.types.Rational = function(n, d) {
     var divisor = gcd(n, d);
     this.n = n / divisor;
     this.d = d / divisor;
   };

   org.plt.types.Rational.prototype.toString = function() {
     if (this.d == 1) {
       return this.n + "";
     } else {
       return this.n + "/" + this.d;
     }
   };

   org.plt.types.Rational.prototype.isEqual = function(other) {
     return other instanceof org.plt.types.Rational &&
       this.n == other.n &&
       this.d == other.d;
   };

   org.plt.types.Rational.prototype.add = function(other) {
     return org.plt.types.Rational.makeInstance(this.n * other.d + this.d * other.n,
						this.d * other.d);
   };

   org.plt.types.Rational.prototype.subtract = function(other) {
     return org.plt.types.Rational.makeInstance((this.n * other.d) - 
						(this.d * other.n),
						(this.d * other.d));
   };

   org.plt.types.Rational.prototype.multiply = function(other) {
     return org.plt.types.Rational.makeInstance(this.n * other.n,
						this.d * other.d);
   };

   org.plt.types.Rational.prototype.divide = function(other) {
     return org.plt.types.Rational.makeInstance(this.n * other.d,
						this.d * other.n);
   };


    org.plt.types.Rational.prototype.toInteger = function(other) {
	if (this.n >= 0)
	    return Math.floor(this.n / this.d);
	else
	    return Math.ceil(this.n / this.d);
	
    }


   org.plt.types.Rational.makeInstance = function(n, d) {
     if (d == 1 && n < org.plt.types.Rational._cache.length)
       return org.plt.types.Rational._cache[n];
     if (n == -1 && d == 1) {
       return org.plt.types.Rational.NEGATIVE_ONE;
     }
     return new org.plt.types.Rational(n, d);
   };

   org.plt.types.Rational.NEGATIVE_ONE = new org.plt.types.Rational(-1, 1);

   org.plt.types.Rational._cache = [];
   (function() {
      var i;
      for(i = 0; i < 100; i++)
	org.plt.types.Rational._cache.push(
	  new org.plt.types.Rational(i, 1));
    })();
   
   org.plt.types.Rational.ZERO = org.plt.types.Rational._cache[0];
   org.plt.types.Rational.ONE = org.plt.types.Rational._cache[1];

 })();




//////////////////////////////////////////////////////////////////////
// NumberTower.
// 
// FIXME: hardcoded to handle rationals only.
// We must do the numeric tower.
org.plt.types.NumberTower = {};
org.plt.types.NumberTower.add = function(x, y) {
  return x.add(y);
};

org.plt.types.NumberTower.subtract = function(x, y) {
  return x.subtract(y);
};

org.plt.types.NumberTower.multiply = function(x, y) {
  return x.multiply(y);
};

org.plt.types.NumberTower.divide = function(x, y) {
  return x.divide(y);
};
org.plt.types.NumberTower.equal = function(x, y) {
  return x.isEqual(y);
};

org.plt.types.NumberTower.toInteger = function(num) {
    return x.toInteger();
}


//////////////////////////////////////////////////////////////////////

// World 




//////////////////////////////////////////////////////////////////////
// Platform-specific stuff.
org.plt.platform = {};

(function() {
   
 })();
org.plt.platform.getInstance = function() {
  return JavascriptPlatform;
};

JavascriptPlatform = {};

JavascriptPlatform.getLocationService = function() {
  return JavascriptLocationService;
};

JavascriptPlatform.getTiltService = function() {
  return JavascriptTiltService;
};

JavascriptLocationService = { 
  startService : function() {
    // fill me in.
  },
  shutdownService : function() {
    // fill me in.
  },

  addLocationListener : function(listener) {
    // fill me in.

  }
};

JavascriptTiltService = { 
  startService : function() {
    // fill me in.
  },
  shutdownService : function() {
    // fill me in.
  },

  addOrientationChangeListener : function(listener) {
    // fill me in.

  },
  addAccelerationChangeListener : function(listener) {
  // fill me in.
  }
};



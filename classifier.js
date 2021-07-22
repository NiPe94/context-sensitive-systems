var SVC = function(nClasses, nRows, vectors, coefficients, intercepts, weights, kernel, gamma, coef0, degree) {

    this.nClasses = nClasses;
    this.classes = ['Jumping', 'Walking', 'Resting'];
    this.nRows = nRows;
    this.vectors = vectors;
    this.coefficients = coefficients;
    this.intercepts = intercepts;
    this.weights = weights;
    this.kernel = kernel.toUpperCase();
    this.gamma = gamma;
    this.coef0 = coef0;
    this.degree = degree;

    this.predict = function(features) {
    
        var kernels = new Array(vectors.length);
        var kernel;
        switch (this.kernel) {
            case 'LINEAR':
                // <x,x'>
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += this.vectors[i][j] * features[j];
                    }
                    kernels[i] = kernel;
                }
                break;
            case 'POLY':
                // (y<x,x'>+r)^d
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += this.vectors[i][j] * features[j];
                    }
                    kernels[i] = Math.pow((this.gamma * kernel) + this.coef0, this.degree);
                }
                break;
            case 'RBF':
                // exp(-y|x-x'|^2)
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += Math.pow(this.vectors[i][j] - features[j], 2);
                    }
                    kernels[i] = Math.exp(-this.gamma * kernel);
                }
                break;
            case 'SIGMOID':
                // tanh(y<x,x'>+r)
                for (var i = 0; i < this.vectors.length; i++) {
                    kernel = 0.;
                    for (var j = 0; j < this.vectors[i].length; j++) {
                        kernel += this.vectors[i][j] * features[j];
                    }
                    kernels[i] = Math.tanh((this.gamma * kernel) + this.coef0);
                }
                break;
        }
    
        var starts = new Array(this.nRows);
        for (var i = 0; i < this.nRows; i++) {
            if (i != 0) {
                var start = 0;
                for (var j = 0; j < i; j++) {
                    start += this.weights[j];
                }
                starts[i] = start;
            } else {
                starts[0] = 0;
            }
        }
    
        var ends = new Array(this.nRows);
        for (var i = 0; i < this.nRows; i++) {
            ends[i] = this.weights[i] + starts[i];
        }
    
        if (this.nClasses == 2) {
    
            for (var i = 0; i < kernels.length; i++) {
                kernels[i] = -kernels[i];
            }
    
            var decision = 0.;
            for (var k = starts[1]; k < ends[1]; k++) {
                decision += kernels[k] * this.coefficients[0][k];
            }
            for (var k = starts[0]; k < ends[0]; k++) {
                decision += kernels[k] * this.coefficients[0][k];
            }
            decision += this.intercepts[0];
    
            if (decision > 0) {
                return 0;
            }
            return 1;
    
        }
    
        var decisions = new Array(this.intercepts.length);
        for (var i = 0, d = 0, l = this.nRows; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                var tmp = 0.;
                for (var k = starts[j]; k < ends[j]; k++) {
                    tmp += this.coefficients[i][k] * kernels[k];
                }
                for (var k = starts[i]; k < ends[i]; k++) {
                    tmp += this.coefficients[j - 1][k] * kernels[k];
                }
                decisions[d] = tmp + this.intercepts[d];
                d++;
            }
        }
    
        var votes = new Array(this.intercepts.length);
        for (var i = 0, d = 0, l = this.nRows; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                votes[d] = decisions[d] > 0 ? i : j;
                d++;
            }
        }
    
        var amounts = new Array(this.nClasses).fill(0);
        for (var i = 0, l = votes.length; i < l; i++) {
            amounts[votes[i]] += 1;
        }
    
        var classVal = -1, classIdx = -1;
        for (var i = 0, l = amounts.length; i < l; i++) {
            if (amounts[i] > classVal) {
                classVal = amounts[i];
                classIdx= i;
            }
        }
        return this.classes[classIdx];
    
    }

};

if (true) {
    if (true) {

        // Features:
        var features = [0,0,0];

        // Parameters:
        var vectors = [[0.08838808536529541, 5740.572678865149, 30.766142631554832], [-19.423746073246, 15239.485859499626, 6.374608115156644], [12.227634400874376, 10811.544452462145, 13.57745301817697], [2.615536257624626, 3843.0700593015413, 130.66361796547054], [-7.205116865038872, 9977.893619598719, 7.0733536140911255], [3.5664734870195387, 40.085794202482745, 0.9562156315686405], [-1.587270355038345, 3.0622507280324416, 0.267057386386216]];
        var coefficients = [[0.006451085279989141, 0.0048591284111716496, 0.0021220563777031654, 0.0, -0.013432270068863937, -0.0, -1.3547675057645985e-07], [0.0, 0.0, 0.0, 1.3547675057645985e-07, 0.0, 0.0014308415538899532, -0.0014308415538899532]];
        var intercepts = [-6.8250957528521266, -1.001596892456539, -1.1507807034225115];
        var weights = [4, 2, 1];

        // Prediction:
        var clf = new SVC(3, 3, vectors, coefficients, intercepts, weights, "linear", "auto_deprecated", 0.0, 3);
        var prediction = clf.predict(features);
        console.log(prediction);

    }
}
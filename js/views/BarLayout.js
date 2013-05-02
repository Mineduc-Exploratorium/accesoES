define([
  'underscore',
  'd3',
	], function(_, d3){

		var BarLayout = function() {
			var layout = {};
			var size = [1,1];
			var width = 0;
			var category = "";
			var valueAttribute = "estudiantes";
			var nodes = [];

			layout.size = function(_) {
				if (!arguments.length) return size;
				size = _;
				return layout;
			}

			layout.category = function(_) {
				if (!arguments.length) return category;
				category = _;
				return layout;
			}

			layout.nodes = function(_arg_) {
				if (!arguments.length) return nodes;
				data = _arg_;

				var width = size[0];
				var height = size[1];

				var groupedObject = groupData(data);
				var groupedArray = d3.entries(groupedObject);
				var sortedArray = _.sortBy(groupedArray, function(d) {return d.key});

				var totalsize = totalize(data);

				var nextX = 0; //valor de posición X del siguiente nodo
				nodes = sortedArray.map(function(d) {
						d.value = totalize(d.value);
						d.dx=width*d.value/totalsize;
						d.dy=height;
						d.x=nextX;
						d.y=0;
						nextX=d.x+d.dx;
						return d}
					);

				

				return nodes;
			}

			totalize = function(data) {
				var result = _.reduce(data, function(memo,d) {
					return memo+parseInt(d[valueAttribute])
				},0);	
				return result;
			}

			groupData = function(data) {
				var result = _.groupBy(data, function(d) {
					return d[category]}
				);

				return result;
			}

			return layout;
		};
  
  return BarLayout;
});


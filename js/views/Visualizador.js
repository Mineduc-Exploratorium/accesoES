// visAccesoEdSup
define([
	'underscore',
	'backbone',
	'jquery',
	'd3',
	'VistaTooltip',
	'VistaEjesXY',
	'views/BarLayout'
	], function(_, Backbone,$, d3, VistaTooltip, VistaEjesXY, BarLayout){

	var Visualizador = Backbone.View.extend(
		/** @lends Visualizador.prototype */
		{

		/**
		* @class VistaPrincipal vista que despliega visualizacion de ingresos vs costos de carreras
		*
		* @augments Backbone.View
		* @constructs
		*
		* @param {object} options parametros de incializacion
		* @param {array} options.data arreglo con datos (cada dato es un objeto con atributos)
		* @param {d3.select()} options.svg elemento SVG utilizado como contenedor del gráfico
		* @param {Backbone.View} options.tooltip vista utilizada como tooltip
		* Visualizador Inicia parametros de configuración y llamada a datos
		*/
		initialize: function() {
			//this.svg = this.options && this.options.svg ? this.options.svg : document.createElementNS('http://www.w3.org/2000/svg', "g");
			this.data = this.options && this.options.data ? this.options.data : [];
			this.tooltip = this.options && this.options.tooltip ? this.options.tooltip : new VistaTooltip();

			// Binding de this (esta vista) al contexto de las funciones indicadas
			_.bindAll(this,"render", "tootipMessage")

			// Alias a this para ser utilizado en callback functions
			var self = this; 
			
			// Configuración de espacio de despliegue de contenido en pantalla
			this.margin = {top: 20, right: 20, bottom: 30, left: 20},
	    	this.width = 1000 - this.margin.left - this.margin.right,
	    	this.height = 400 - this.margin.top - this.margin.bottom;

	   		this.color = d3.scale.category20c();

			this.tooltip = new VistaTooltip();
	  		// Reescribe función generadora del mensaje en tooltip
			this.tooltip.message = this.tootipMessage;

			// Limpia Data
			// ===========
			// Limpia datos de entrada (P.Ej. Cambiar duración de semestres a años)
			this.data = _.map(this.data, function(d,i) {
				d.id = i;
				return d;
			})

			// Genera nodos para gráfico de barras con distribución de estudiantes según categorías
			var nodesEgreso = BarLayout()
				.size([this.width,50])
				.category("año_egreso")
				.nodes(this.data);

			var nodesDependencia = BarLayout()
				.size([this.width,50])
				.category("dependencia")
				.nodes(this.data);

			var nodesPSU = BarLayout()
				.size([this.width,50])
				.category("psu")
				.nodes(this.data);

			var nodesNEM = BarLayout()
				.size([this.width,50])
				.category("nem")
				.nodes(this.data);

			var nodesTipoIE = BarLayout()
				.size([this.width,50])
				.category("tipo_ie")
				.nodes(this.data);

			var nodesRanking10 = BarLayout()
				.size([this.width,50])
				.category("ranking_10")
				.nodes(this.data);

			var nodesRanking75 = BarLayout()
				.size([this.width,50])
				.category("ranking_75")
				.nodes(this.data);

			var nodesQuintil = BarLayout()
				.size([this.width,50])
				.category("QUINTIL")
				.nodes(this.data);

			this.groups = [
				{titulo: "Año de egreso de Ed. Media", nodes : nodesEgreso },
				{titulo: "Dependencia del establecimiento de egreso", nodes : nodesDependencia },
				{titulo: "Puntaje PSU (promedio Lenguaje/Matemática)", nodes : nodesPSU },
				{titulo: "Nota Educación Media", nodes : nodesNEM },
				{titulo: "Tipo de Institución Superior en que se matricula", nodes : nodesTipoIE },
				{titulo: "Pertenece al 10% de mejores egresados", nodes : nodesRanking10 },
				{titulo: "Pertenece al 7.5% de mejores egresados", nodes : nodesRanking75 },
				{titulo: "Quintil Socioeconómico", nodes : nodesQuintil }
			];

			//ranking_10	ranking_75	QUINTIL

			this.render();
	 
		},

		/**
		* Reescribe función generador de mensajes utilizado en herramienta de tooltip
		* tooltip.tooltipMessage(data) 	
		*
		* @param {object} data objeto con atributos (Ej: {nombre: "Juan", Edad: 18}) utilizados en la creación del mensaje a desplegar por tooltip
		* @returns {string} Mensaje (html) a ser utilizado por tooltip
		*/
		tootipMessage : function(d) {
		
			var formatMiles = d3.format(",d");
			var formatDecimal = d3.format('.2f')

			msg = "<strong>"+d.key+"</strong>";
			msg += "<br>"+formatMiles(d.value)+" estudiantes";
			
			return msg;
		}, 

		/**
		* Despliegue inicial de elementos gráficos.
		*/
		render: function() {
			var self = this; // Auxiliar para referirse a this en funciones callback


			this.groupDivs = d3.select(this.el).selectAll("div.group")
				.data(this.groups)
				.enter()
					.append("div")
					.attr("class", "group")
					.style("position", "relative")
			    	.style("height", 70 + "px")
			    	.style("width", self.width + "px")
			    	.style("left", self.margin.left + "px")

			// Despliegue de los nodos de carreras
			
			this.groupDivs
				.append("h5")
		  		.attr("class", "etiqueta")
				.text(function(d) { return d.titulo; })
					
			this.groupDivs.selectAll(".label")
				.data(function(d) {return d.nodes})
				.enter()
					.append("div")
			  		.attr("class", "node")
					.style("position", "absolute")
					.call(position)
					.style("background", function(d) { return self.color(d.key) })
					.text(function(d) { return d.key; })
					.on("mouseenter", function(d) {
							self.tooltip.show(d)}
							)
					.on("mouseout", function(d) {self.tooltip.hide()})
					

			function position() {
			  this.style("left", function(d) { return d.x + "px"; })
			      .style("top", function(d) { return d.y +20 + "px"; })
			      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
			      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
			}

		}

	});
  
  return Visualizador;
});


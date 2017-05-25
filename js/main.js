function ShimmeringCircle(svgEl, radius) {

  this.colours = {
    background: '#222222',
    glow: '#ff0d00'
  };
  this.tmplData = [];
  this.slices = null;
  this.arcDims = d3.svg.arc()
    .innerRadius(radius - (0.2 * radius))
    .outerRadius(radius);

  var self = this;
  self.radius = radius;
  self.segmentCount = 120;
  self.svgEl = svgEl;
  self.tau = 2 * Math.PI;
  self.tauInDegrees = 360;
  self.timing = 3000;
  self.cycleTime = self.timing * 0.5;
  self.maxActiveArcs = 3;

    self.edge = (self.radius + ( 0.1* self.radius )) * 2;

  svgEl.attr('width', self.edge);
  svgEl.attr('height', self.edge);
  svgEl.attr('viewBox', -(self.edge/2) + " " + -(self.edge/2) + " " + self.edge + " " + self.edge );
  svgEl.style('background-color', self.colours.background);
};

ShimmeringCircle.prototype = {

  init: function () {
    this.build();
    this.updateSlices();
  },

  build: function () {
    var self = this;

    self.tmplData = d3.range(0, this.segmentCount, 1);

    self.arcs = self.tmplData.map(function (d, i) {
      return {
        startAngle: (i/self.segmentCount) * self.tau,
        endAngle: ((i + 1)/self.segmentCount) * self.tau
      }
    });

    // self.activateArcs();

    self.slices = self.svgEl.selectAll('path').data(self.arcs).enter().append('path')
      .style('fill', self.colours.background)
      .attr('stroke', self.colours.background)
      .attr('stroke-width', 1)
      .attr('d', self.arcDims);
  },

  activateArcs: function () {
    var self = this;
    var lightUpchange = self.maxActiveArcs/self.arcs.length;
    self.arcs.forEach(function(arc){
      arc.glow = (Math.random() < lightUpchange) ? self.colours.glow : self.colours.background;
    });
  },

  updateSlices: function () {

    var cycle = function () {
      self.activateArcs();
      self.slices.data(self.arcs).transition()
        .duration(self.timing)
        .ease('quad-in-out')
        .style('fill', function (d){
          return d.glow;
        });
    };

    var self = this;
    cycle();
    window.setInterval(cycle, self.cycleTime);
  }
};


document.addEventListener('DOMContentLoaded', function () {

  var svgs = [
    { svg: d3.select("#shimmering-circle-1")}
  ];

  svgs.forEach(function(map){
    var shimmeringCircle = new ShimmeringCircle(map.svg, 200);
    shimmeringCircle.init();
  });
}, false);

function ShimmeringCircle(svgEl, radius) {

  this.colours = {
    background: '#212121',
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
  self.timing = 5000;
  self.cycleTime = self.timing * 0.66;
  self.maxActiveArcs = 4;

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

    self.activateArcs();

    self.slices = self.svgEl.selectAll('path').data(self.arcs).enter().append('path')
      .style('fill', function(d){
        return d.glow;
      })
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

    var self = this;
    window.setInterval(function () {

      self.activateArcs();
      self.slices.data(self.  arcs).transition()
        .duration(self.timing)
        .style('fill', function (d){
          return d.glow;
        });
    }, self.cycleTime);

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

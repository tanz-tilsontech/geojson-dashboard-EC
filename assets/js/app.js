var config = {
  geojson: "https://web.fulcrumapp.com/shares/fb96b48deb5cfb94.geojson",
  title: "SLC OneFiber Construction",
  layerName: "Segments",
  hoverProperty: "status_title_github",
  sortProperty: "fqnid",
  sortOrder: "ascend"
};

var properties = [{
  value: "fulcrum_id",
  label: "Record ID",
  table: {
    visible: false,
    sortable: true
  },
  filter: {
    type: "string"
  },
  info: false
},
{
  value: "status",
  label: "Status",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "checkbox",
    vertical: true,
    multiple: true,
    operators: ["in", "not_in", "equal", "not_equal"],
    values: []
  }
},
{
  value: "hub",
  label: "Hub",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "checkbox",
    vertical: true,
    multiple: true,
    operators: ["in", "not_in", "equal", "not_equal"],
    values: []
  }
},
{
  value: "site",
  label: "Site",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "checkbox",
    vertical: true,
    multiple: true,
    operators: ["in", "not_in", "equal", "not_equal"],
    values: []
  }
},
{
  value: "wpid",
  label: "WPID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string",
    input: "checkbox",
    vertical: true,
    multiple: true,
    operators: ["in", "not_in", "equal", "not_equal"],
    values: []
  }
},
{
  value: "fqnid",
  label: "FQNID",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string"
  }
},
{
  value: "ntp_date",
  label: "Proposed Start Date",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date"
  }
},
{
  value: "proposed_type",
  label: "Proposed Type",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string"
  }
},
{
  value: "proposed_product",
  label: "Proposed Product",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string"
  }
},
{
  value: "proposed_footage",
  label: "Proposed Footage",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
  }
},
{
  value: "construction_type_cx_final",
  label: "Construction Type",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string"
  }
},
{
  value: "construction_start_date_cx_final",
  label: "Construction Start Date",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date"
  }
},
{
  value: "construction_complete_date_cx_final",
  label: "Construction Complete Date",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date"
  }
},
{
  value: "construction_pass_date_qc_final",
  label: "Construction QC Pass Date",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date"
  }
},
{
  value: "construction_footage_cx_final",
  label: "Construction Total Footage",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
  }
},
{
  value: "cable_placement_type_final",
  label: "Cable Placement Type",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "string"
  }
},
{
  value: "cable_placement_start_date_cx_final",
  label: "Cable Placement Start Date",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date"
  }
},
{
  value: "cable_placement_complete_date_cx_final",
  label: "Cable Placement Complete Date",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date"
  }
},
{
  value: "cable_placement_pass_date_qc_final",
  label: "Cable Placement QC Pass Date",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "date"
  }
},
{
  value: "cable_placement_total_footage_cx_final",
  label: "Cable Placement Total Footage",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer",
  }
}];



function drawCharts() {
  // HUB COMPLETE
  $(function() {
    var result = alasql("SELECT hub AS label, SUM(COALESCE(cable_placement_total_footage_cx_final::NUMBER / proposed_footage::NUMBER)) AS total FROM ? GROUP BY hub", [features]);
    var columns = $.map(result, function(status) {
      return [[status.label, status.total]];
    });
    var chart = c3.generate({
        bindto: "#hub-complete-chart",
        data: {
          type: "gauge",
          columns: columns
        }
    });
  });

  // HUB FOOTAGE
  $(function() {
    var result = alasql("SELECT hub AS label, SUM(COALESCE(proposed_footage::NUMBER)) AS footage FROM ? GROUP BY hub", [features]);
    var columns = $.map(result, function(hub) {
      return [[hub.label, hub.footage]];
    });
    var chart = c3.generate({
        bindto: "#hub-footage-chart",
        data: {

          type: "bar",
          columns: columns
        }
    });
  });


  // MONTHLY FOOTAGE 
  $(function() {
    var result = alasql("SELECT fqnid AS label, COUNT(*) AS total FROM ? GROUP BY fqnid", [features]);
    var columns = $.map(result, function(fqnid) {
      return [[fqnid.label, fqnid.total]];
    });
    var chart = c3.generate({
        bindto: "#fqnid-chart",
        data: {
          type: "pie",
          columns: columns
        }
    });
  });
}

$(function() {
  $(".title").html(config.title);
  $("#layer-name").html(config.layerName);
  $("#layer-name2").html("SLC HLD Route");
});

function buildConfig() {
  filters = [];
  table = [{
    field: "action",
    title: "<i class='fa fa-gear'></i>&nbsp;Action",
    align: "center",
    valign: "middle",
    width: "75px",
    cardVisible: false,
    switchable: false,
    formatter: function(value, row, index) {
      return [
        '<a class="zoom" href="javascript:void(0)" title="Zoom" style="margin-right: 10px;">',
          '<i class="fa fa-search-plus"></i>',
        '</a>',
        '<a class="identify" href="javascript:void(0)" title="Identify">',
          '<i class="fa fa-info-circle"></i>',
        '</a>'
      ].join("");
    },
    events: {
      "click .zoom": function (e, value, row, index) {
          var layer = featureLayer.getLayer(row.leaflet_stamp);
          map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 18);
          highlightLayer.clearLayers();
          highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
        });
      },
      "click .identify": function (e, value, row, index) {
        identifyFeature(row.leaflet_stamp);
        highlightLayer.clearLayers();
        highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
      }
    }
  }];

  $.each(properties, function(index, value) {
    // Filter config
    if (value.filter) {
      var id;
      if (value.filter.type == "integer") {
        id = "cast(properties->"+ value.value +" as int)";
      }
      else if (value.filter.type == "double") {
        id = "cast(properties->"+ value.value +" as double)";
      }
      else {
        id = "properties->" + value.value;
      }
      filters.push({
        id: id,
        label: value.label
      });
      $.each(value.filter, function(key, val) {
        if (filters[index]) {
          // If values array is empty, fetch all distinct values
          if (key == "values" && val.length === 0) {
            alasql("SELECT DISTINCT(properties->"+value.value+") AS field FROM ? ORDER BY field ASC", [geojson.features], function(results){
              distinctValues = [];
              $.each(results, function(index, value) {
                distinctValues.push(value.field);
              });
            });
            filters[index].values = distinctValues;
          } else {
            filters[index][key] = val;
          }
        }
      });
    }
    // Table config
    if (value.table) {
      table.push({
        field: value.value,
        title: value.label
      });
      $.each(value.table, function(key, val) {
        if (table[index+1]) {
          table[index+1][key] = val;
        }
      });
    }
  });

  buildFilters();
  buildTable();
}

// Basemap Layers
var mapboxOSM = L.tileLayer('http://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZWNvdHJ1c3QiLCJhIjoibGo4TG5nOCJ9.QJnT2dgjL4_4EA7WlK8Zkw', {
    maxZoom: 19
});


var mapboxSat = L.tileLayer('https://api.mapbox.com/v4/cfritz1387.573ca1ee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2ZyaXR6MTM4NyIsImEiOiJjaWphZTZ0eHkwMDVwdWlseGx5aWhhbXlwIn0._lgb3vbGMSx1-jdZCufdgg', {
    maxZoom: 19
});


var SLCHLDRoute = L.tileLayer('https://ttm-tileify-proxy.herokuapp.com/tiles/{z}/{x}/{y}?url=https%3A%2F%2Ftilsonweb.3-gislive.com%2Farcgis%2Frest%2Fservices%2FSLC%2FTilsonslc%2FMapServer&transparent=true&layers=show%3A1%2C3%2C4%2C9%2C43%2C48', {
    maxZoom: 19
});


var highlightLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 5,
      color: "#FFF",
      weight: 2,
      opacity: 1,
      fillColor: "#00FFFF",
      fillOpacity: 1,
      clickable: false
    });
  },
  style: function (feature) {
    return {
      color: "#00FFFF",
      weight: 2,
      opacity: 1,
      fillColor: "#00FFFF",
      fillOpacity: 0.5,
      clickable: false
    };
  }
});


var featureLayer = L.geoJson(null, {
  filter: function(feature, layer) {
    return feature.geometry.coordinates[0] !== 0 && feature.geometry.coordinates[1] !== 0;
  },
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      title: feature.properties["status_title_github"],
      riseOnHover: true,
      icon: L.icon({
        iconUrl: "assets/pictures/markers/cb0d0c.png",
        iconSize: [30, 40],
        iconAnchor: [15, 32]
      })
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.on({
        click: function (e) {
          identifyFeature(L.stamp(layer));
          highlightLayer.clearLayers();
          highlightLayer.addData(featureLayer.getLayer(L.stamp(layer)).toGeoJSON());
        },
        mouseover: function (e) {
          if (config.hoverProperty) {
            $(".info-control").html(feature.properties[config.hoverProperty]);
            $(".info-control").show();
          }
        },
        mouseout: function (e) {
          $(".info-control").hide();
        }
      });
      if (feature.properties["marker-color"]) {
        layer.setIcon(
          L.icon({
            iconUrl: "assets/pictures/markers/" + feature.properties["marker-color"].replace("#",'').toLowerCase() + ".png",
            iconSize: [30, 40],
            iconAnchor: [15, 32]
          })
        );
      }
    }
  }
});

// Fetch the GeoJSON file

$.getJSON(config.geojson, function (data) {
  geojson = data;
  legendItems = {};
  features = $.map(geojson.features, function(feature) {
    return feature.properties;
  });
  featureLayer.addData(data);
  buildConfig();
  $("#loading-mask").hide();
});

var map = L.map("map", {
  layers: [mapboxOSM, SLCHLDRoute, featureLayer, highlightLayer]
}).fitWorld();

// ESRI geocoder
var searchControl = L.esri.Geocoding.Controls.geosearch({
  useMapBounds: 17
}).addTo(map);

// Info control
var info = L.control({
  position: "bottomleft"
});

// Custom info hover control
info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info-control");
  this.update();
  return this._div;
};
info.update = function (props) {
  this._div.innerHTML = "";
};
info.addTo(map);
$(".info-control").hide();

// Larger screens get expanded layer control
if (document.body.clientWidth <= 767) {
  isCollapsed = true;
} else {
  isCollapsed = false;
}
var baseLayers = {
  "Street Map": mapboxOSM,
  "Satellite Map": mapboxSat,
  "SLC HLD Route": SLCHLDRoute,
};
var overlayLayers = {
  "<span id='layer-name'>GeoJSON Layer</span>": featureLayer,
  "<span id='layer-name2'>GeoJSON Layer</span>": SLCHLDRoute,
};


var layerControl = L.control.layers(baseLayers, overlayLayers, {
  collapsed: isCollapsed
}).addTo(map);

// Filter table to only show features in current map bounds
map.on("moveend", function (e) {
  syncTable();
});

map.on("click", function(e) {
  highlightLayer.clearLayers();
});

// Table formatter to make links clickable
function urlFormatter (value, row, index) {
  if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
    return "<a href='"+value+"' target='_blank'>"+value+"</a>";
  }
}

function buildFilters() {
  $("#query-builder").queryBuilder({
    allow_empty: true,
    filters: filters
  });
}


function dateFilter() {
  var rules_widgets = {
    condition: 'OR',
    rules: [{
      id: 'date',
      operator: 'equal',
      value: '1991/11/17'
    }]
  };
$('#query-builder').queryBuilder({
    plugins: ['bt-tooltip-errors'],
    filters: [{
      id: 'date',
      label: 'Datepicker',
      type: 'date',
      validation: {
        format: 'YYYY/MM/DD'
      },
      plugin: 'datepicker',
      plugin_config: {
        format: 'yyyy/mm/dd',
        todayBtn: 'linked',
        todayHighlight: true,
        autoclose: true
      }
    }],
  });
  rules: rules_widgets
}


function applyFilter() {
  var query = "SELECT * FROM ?";
  var sql = $("#query-builder").queryBuilder("getSQL", false, false).sql;
  if (sql.length > 0) {
    query += " WHERE " + sql;
  }
  alasql(query, [geojson.features], function(features){
    featureLayer.clearLayers();
    featureLayer.addData(features);
    syncTable();
  });
}

function buildTable() {
  $("#table").bootstrapTable({
    cache: false,
    height: $("#table-container").height(),
    undefinedText: "",
    striped: false,
    pagination: false,
    minimumCountColumns: 1,
    sortName: config.sortProperty,
    sortOrder: config.sortOrder,
    toolbar: "#toolbar",
    search: true,
    trimOnSearch: false,
    showColumns: true,
    showToggle: true,
    columns: table,
    onClickRow: function (row) {
      identifyFeature();
    },
    onDblClickRow: function (row) {
      // do something!
    }
  });

  map.fitBounds(featureLayer.getBounds());

  $(window).resize(function () {
    $("#table").bootstrapTable("resetView", {
      height: $("#table-container").height()
    });
  });
}

function syncTable() {
  tableFeatures = [];
  featureLayer.eachLayer(function (layer) {
    layer.feature.properties.leaflet_stamp = L.stamp(layer);
    if (map.hasLayer(featureLayer)) {
      featureLayer.getLayer()
      layer.feature.geometry.type === "Point"
      if (map.getBounds().contains(layer.getLatLng())) {
        tableFeatures.push(layer.feature.properties);
      }
    }
  });
  $("#table").bootstrapTable("load", JSON.parse(JSON.stringify(tableFeatures)));
  var featureCount = $("#table").bootstrapTable("getData").length;
  if (featureCount == 1) {
    $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible feature");
  } else {
    $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible features");
  }
}

function identifyFeature(id) {
  var featureProperties = featureLayer.getLayer(id).feature.properties;
  var content = "<table class='table table-striped table-bordered table-condensed'>";
  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
      value = "<a href='" + value + "' target='_blank'>" + value + "</a>";
    }
    $.each(properties, function(index, property) {
      if (key == property.value) {
        if (property.info !== false) {
          content += "<tr><th>" + property.label + "</th><td>" + value + "</td></tr>";
        }
      }
    });
  });
  content += "<table>";
  $("#feature-info").html(content);
  $("#featureModal").modal("show");
}

function switchView(view) {
  if (view == "split") {
    $("#view").html("Split View");
    location.hash = "#split";
    $("#table-container").show();
    $("#table-container").css("height", "55%");
    $("#map-container").show();
    $("#map-container").css("height", "45%");
    $(window).resize();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "map") {
    $("#view").html("Map View");
    location.hash = "#map";
    $("#map-container").show();
    $("#map-container").css("height", "100%");
    $("#table-container").hide();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "table") {
    $("#view").html("Table View");
    location.hash = "#table";
    $("#table-container").show();
    $("#table-container").css("height", "100%");
    $("#map-container").hide();
    $(window).resize();
  }
}

$("[name='view']").click(function() {
  $(".in,.open").removeClass("in open");
  if (this.id === "map-graph") {
    switchView("split");
    return false;
  } else if (this.id === "map-only") {
    switchView("map");
    return false;
  } else if (this.id === "graph-only") {
    switchView("table");
    return false;
  }
});

L.easyPrint({
  title: 'My awesome print button',
  elementsToHide: 'p, h2, .gitButton'
}).addTo(map)


$("#refresh-btn").click(function() {
  featureLayer.clearLayers();
  map.setView([40.5912,-111.837],9)
  $.getJSON(config.geojson, function (data) {
    geojson = data;
    legendItems = {};
    features = $.map(geojson.features, function(feature) {
      return feature.properties;
    });
    featureLayer.addData(data);
    buildConfig();
    $("#loading-mask").hide();
  });
  syncTable();
  buildTable();
  buildFilters();
  map.fitBounds(featureLayer.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#filter-btn").click(function() {
  $("#filterModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#chart-btn").click(function() {
  $("#chartModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#view-sql-btn").click(function() {
  alert($("#query-builder").queryBuilder("getSQL", false, false).sql);
});

$("#apply-filter-btn").click(function() {
  applyFilter();
});

$("#reset-filter-btn").click(function() {
  $("#query-builder").queryBuilder("reset");
  applyFilter();
});

$("#extent-btn").click(function() {
  map.fitBounds(featureLayer.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#download-csv-btn").click(function() {
  $("#table").tableExport({
    type: "csv",
    ignoreColumn: [0],
    fileName: "data"
  });
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#download-excel-btn").click(function() {
  $("#table").tableExport({
    type: "excel",
    ignoreColumn: [0],
    fileName: "data"
  });
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#download-pdf-btn").click(function() {
  $("#table").tableExport({
    type: "pdf",
    ignoreColumn: [0],
    fileName: "data",
    jspdf: {
      format: "bestfit",
      margins: {
        left: 20,
        right: 10,
        top: 20,
        bottom: 20
      },
      autotable: {
        extendWidth: false,
        overflow: "linebreak"
      }
    }
  });
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#chartModal").on("shown.bs.modal", function (e) {
  drawCharts();
});

import { Style } from 'ol/style';

var key = 'pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q';

var mapa = {
    view: {
        // projection: 'EPSG:4326',
        projectionCenter: 'EPSG:4326',
        center: [-3.0, 41.0],
        zoom: 6
    },
    layers: [

        {
            title: 'Open Street Map',
            type: 'Tile',
            source: {
                type: 'OSM'
            }
        },

        {
            title: 'Bing Group',
            type: 'OlTsLayerScale',
            openInLayerSwitcher: false,
            layers: [
                {
                    title: 'Bing - Aerial',
                    type: 'Tile',
                    name: 'BingAerial',
                    thumbnail: 'assets/img/layers/bases/BingMapsAerial-100.png',
                    source: {
                        type: 'BingMaps',
                        key: 'AqEzZNMoyO2z_wL8ap0J8uhZvqMG29GsSenOtFDqDXB0tOuqbBOQswe0jUrt5u1p',
                        imagerySet: 'Aerial'
                    },
                    minZoom: 15,
                    maxZoom: 20
                },
                {
                    title: 'Bing - Road',
                    type: 'Tile',
                    name: 'BingRoad',
                    thumbnail: 'assets/img/layers/bases/BingMapsRoad-100.png',
                    source: {
                        type: 'BingMaps',
                        key: 'AqEzZNMoyO2z_wL8ap0J8uhZvqMG29GsSenOtFDqDXB0tOuqbBOQswe0jUrt5u1p',
                        imagerySet: 'Road'
                    },
                    minZoom: 1,
                    maxZoom: 15
                }
            ]
        },

        {
            title: 'MiMapBox2',
            type: 'Tile',
            source: {
                type: 'TileJSON',
                url: 'https://api.tiles.mapbox.com/v4/mapbox.world-borders-light.json?secure&access_token=' + key,
                crossOrigin: 'anonymous'
            }
        },

        {
            title: 'Bioenergy Crops Suitability',
            type: 'Tile',
            visible: false,
            sourceSelect: 'siHr_sfl',
            sources: [{
                name: 'siHr_whe',
                type: 'XYZ',
                title: 'Wheat - High - (r)',
                title2: 'Wheat - High - (rain-fed)',
                url: 'https://mbtiles.agrisatwebgis.com/suitability-crops-1981-2010/suitability-1981-2010H-siHr_whe/{z}/{x}/{y}.png'
            }, {
                name: 'siHr_sfl',
                type: 'XYZ',
                title: 'Sunflower - High - (r)',
                title2: 'Sunflower - High - (rain-fed)',
                url: 'https://mbtiles.agrisatwebgis.com/suitability-crops-1981-2010/suitability-1981-2010H-siHr_sfl/{z}/{x}/{y}.png'
            }, {
                name: 'siHr_sub',
                type: 'XYZ',
                title: 'Sugar beet - High - (r)',
                title2: 'Sugar beet - High - (rain-fed)',
                url: 'https://mbtiles.agrisatwebgis.com/suitability-crops-1981-2010/suitability-1981-2010H-siHr_sub/{z}/{x}/{y}.png'
            }, {
                name: 'siHr_rsd',
                type: 'XYZ',
                title: 'Rapeseed - High - (r)',
                title2: 'Rapeseed - High - (rain-fed)',
                url: 'https://mbtiles.agrisatwebgis.com/suitability-crops-1981-2010/suitability-1981-2010H-siHr_rsd/{z}/{x}/{y}.png'
            }, {
                name: 'siHr_srg',
                type: 'XYZ',
                title: 'Sorghum - High - (r)',
                title2: 'Sorghum - High - (rain-fed)',
                url: 'https://mbtiles.agrisatwebgis.com/suitability-crops-1981-2010/suitability-1981-2010H-siHr_srg/{z}/{x}/{y}.png'
            }, {
                name: 'siHr_mis',
                type: 'XYZ',
                title: 'Miscanthus - High - (r)',
                title2: 'Miscanthus - High - (rain-fed)',
                url: 'https://mbtiles.agrisatwebgis.com/suitability-crops-1981-2010/suitability-1981-2010H-siHr_mis/{z}/{x}/{y}.png'
            }, {
                name: 'siHr_swg',
                type: 'XYZ',
                title: 'Switchgrass - High - (r)',
                title2: 'Switchgrass - High - (rain-fed)',
                url: 'https://mbtiles.agrisatwebgis.com/suitability-crops-1981-2010/suitability-1981-2010H-siHr_swg/{z}/{x}/{y}.png'
            }]
        },

        {
            title: 'Capa LayerVector - Polígonos',
            type: 'OlTsLayerVector',
            visible: true,
            editable: true,
            geometryType: 'Polygon', // [Point, LineString, Polygon, Circle]
            source: {
                type: 'Vector',
                // url: '/examples/json/MUC_AB_FIELDS.geojson',
                url: 'https://openlayers.org/en/v5.3.0/examples/data/geojson/countries.geojson',
                format: {
                    type: 'GeoJSON'
                }
            },
            style: {
                type: 'classifyByValue',
                field: 'name',
                domain: {
                    Spain: { fill: { color: 'rgba(250,50,50,0.3)' } },
                    France: { fill: { color: 'rgba(250,20,200,0.4)' } }
                },
                default: {
                    fill: {
                        color: 'rgba(0, 0, 255, 0.1)'
                    },
                    stroke: {
                        color: '#0f0f00',
                        width: 1
                    },
                    text: {
                        font: '12px Calibri,sans-serif',
                        fill: {
                            color: '#000'
                        },
                        stroke: {
                            color: '#fff',
                            width: 3
                        }
                    }
                }
            },
            // styleFunction: 'pepe',
            labels: {
                visible: true,
                field: 'name'
            }
        },
        {
            title: 'Capa LayerVector - Lineas',
            type: 'OlTsLayerVector',
            visible: true,
            editable: true,
            geometryType: 'LineString', // [Point, LineString, Polygon, Circle]
            source: {
                type: 'Vector',
                // url: '/examples/json/MUC_AB_FIELDS.geojson',
                url: 'capalineas.geojson',
                format: {
                    type: 'GeoJSON'
                }
            },
            labels: {
                visible: true,
                field: 'linea'
            }
        },

        {
            title: 'Centros de Tratamiento',
            type: 'OlTsLayerVector',
            visible: false,
            editable: false,
            geometryType: 'Point',
            source: {
                type: 'Cluster',
                distance: 50,
                source: {
                    type: 'Vector',
                    // url: '/examples/geojson/DE_fabriken_GCS.geojson',
                    url: 'DE_fabriken_GCS.geojson',
                    format: {
                        type: 'GeoJSON'
                    }
                }
            },
            style: {
                image: {
                    type: 'Circle',
                    radius: 20,
                    stroke: {
                        color: '#0f0'
                    },
                    fill: {
                        color: '#afa'
                    }
                },
                text: {
                    stroke: {
                        width: 1,
                        color: '#333'
                    },
                    fill: {
                        color: '#000'
                    }
                }
            },
            labels: {
                visible: true,
                fields: [
                    ['count'],
                    ['media', 'electrical', 2]
                ], // sum, media
                template: '(count)\nelectrical'
            }
        },

        {
            title: 'Capa LayerVector - Puntos',
            type: 'OlTsLayerVector',
            visible: true,
            editable: true,
            geometryType: 'Point', // [Point, LineString, Polygon, Circle]
            source: {
                type: 'Vector',
                // url: '/examples/geojson/MUC_AB_FIELDS.geojson',
                url: 'capapuntos.geojson',
                format: {
                    type: 'GeoJSON'
                }
            },
            style: {
                image: {
                    type: 'Circle',
                    radius: 12,
                    fill: {
                        color: 'rgba(0, 0, 255, 1)'
                    },
                    stroke: {
                        color: '#0f0f00',
                        width: 2
                    }
                }
            },
            labels: {
                visible: false,
                field: 'linea'
            }
        },

        {
            title: 'Capa de Ruteo',
            type: 'OlTsLayerGroupORS',
            visible: true,
            openInLayerSwitcher: false,
            layers: [
                {
                    title: 'Puntos',
                    type: 'OlTsLayerVector',
                    geometryType: 'Point',
                    name: 'layerPointsORS',
                    editable: true,
                    style: {
                        image: {
                            type: 'Circle',
                            radius: 6,
                            fill: {
                                color: 'rgba(0, 255, 255, 1)'
                            },
                            stroke: {
                                color: '#0fff00',
                                width: 2
                            }
                        }
                    }
                },
                {
                    title: 'Rutas',
                    type: 'OlTsLayerORS',
                    geometryType: 'LineString',
                    name: 'layerRoutesORS',
                    editable: true,
                    apiKey: '5b3ce3597851110001cf62486b021facde2941b896fc9294427c1095',
                    style: {
                        stroke: {
                            color: '#0FFF00',
                            width: 4
                        }
                    }
                }
            ]
        }
    ]
};

window.olTsigStyle = {};
window.pepe = function(feature, resolution) {
    console.log('pepe');
    console.log(resolution, feature);
    return new Style();
};

export default mapa;


import OlFormatGeoJSON from 'ol/format/GeoJSON';
import OlTsLayerVector from './OlTsLayerVector';

// Constructor
class OlTsLayerORS extends OlTsLayerVector {
    constructor(optOptions) {
        const options = optOptions || {};
        super(options);
        this.apiKey = options.apiKey;
        this.getSource().on('addfeature', (ft) => {
            if (!ft.feature.ruta) {
                this.addRoute(ft.feature);
            }
        });
    }

    addRoute(feature) {
        const self = this;
        const ftemp = feature;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.openrouteservice.org/v2/directions/driving-car/geojson');
        xhr.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', this.apiKey);

        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    // console.log('Status:', this.status);
                    // console.log('Headers:', this.getAllResponseHeaders());
                    // console.log('JSON: ', JSON.parse(this.response));
                    const src = self.getSource();
                    src.removeFeature(ftemp);
                    const fts = new OlFormatGeoJSON({
                        featureProjection: 'EPSG:3857'
                    }).readFeatures(JSON.parse(this.response));
                    for (let i = 0; i < fts.length; i++) {
                        fts[i].ruta = true;
                    }
                    src.addFeatures(fts);
                } else {
                    self.dispatchEvent({
                        type: 'error',
                        status: this.status,
                        statusText: this.statusText,
                        jqXHR: this
                    });
                }
            }
        };
        const body = {
            coordinates: ftemp.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
        };
        xhr.send(JSON.stringify(body));
    }
}

// ========================================================

export default OlTsLayerORS;

// ========================================================

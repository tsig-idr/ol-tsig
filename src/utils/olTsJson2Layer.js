import * as olLayers from 'ol/layer';
import * as olTsLayers from '../layer';
import olTsJson2Source from '../utils/olTsJson2Source';
import olTsJson2Style from '../utils/olTsJson2Style';

// ------------------------------------------------------------------

function layersClass() {
    return {
        ...olLayers,
        ...olTsLayers
    };
}

// ------------------------------------------------------------------

function json2Layer(layer) {
    const ly = JSON.parse(JSON.stringify(layer));
    if (ly.sources) {
        ly.source = olTsJson2Source.json2sources(ly);
    } else if (ly.source) {
        ly.source = olTsJson2Source.json2source(ly.source);
    }
    if (ly.style) {
        ly.style = olTsJson2Style.json2Style(ly.style);
    }
    const l = new (layersClass())[ly.type](ly);
    if (ly.styleFunction) {
        l.defaultStyle = l.getStyle();
        l.setStyle(window[ly.styleFunction]);
    }
    return l;
}

function json2Layers(layers) {
    const l = [];
    for (let i = 0, ii = layers.length; i < ii; ++i) {
        if (layers[i].type) {
            l.push(json2Layer(layers[i]));
        }
    }
    return l;
}

// ------------------------------------------------------------------

const olTsJson2Layer = {
    json2Layer: json2Layer,
    json2Layers: json2Layers
};

export default olTsJson2Layer;

// ------------------------------------------------------------------

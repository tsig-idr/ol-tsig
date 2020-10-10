import {
    getUid as olGetUid
} from 'ol/util';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import {
    transform
} from 'ol/proj';
import OlInteractionSelect from 'ol/interaction/Select';
import {
    pointerMove as olEventsConditionPointerMove
} from 'ol/events/condition';

import OlTsEditionBar from '../control/OlTsEditionBar';
import olTsJson2Layer from '../utils/olTsJson2Layer';
import olTsJson2Style from '../utils/olTsJson2Style';

// ------------------------------------------------------------------------------

/**
 * Sobreescritura de la función privada "applySelectedStyle_" para poder capturar el radio de los puntos de los elementos en el Highlight
 */

OlInteractionSelect.prototype.applySelectedStyle_ = function(feature) {
    const key = olGetUid(feature);
    const f = this.featureLayerAssociation_[key].getStyle();
    if (typeof f === 'function') {
        const s = f(feature);
        const sI = s.getImage && s.getImage();
        let radio = 0;
        if (sI) {
            if (sI.getRadius) {
                radio = sI.getRadius();
            } else if (sI.getSize) {
                radio = Math.max(...sI.getSize()) / 2;
            }
        }
        this.style_.getImage().setRadius(radio);
        const st = (Array.isArray(s)) ? s.slice() : [s];
        st.push(this.style_);
        feature.setStyle(st);
    } else {
        feature.setStyle(f);
    }
};

// ------------------------------------------------------------------------------

class OlTsMap extends OlMap {
    constructor(optOptions) {
        const options = optOptions || {};
        const baseOptions = {
            ...options
        };
        delete baseOptions.layers;
        delete baseOptions.view;
        if (options.view) {
            if (options.view.projectionCenter) {
                options.view.center = transform(options.view.center, options.view.projectionCenter, 'EPSG:3857');
            }
            baseOptions.view = new OlView(options.view);
        }
        baseOptions.layers = olTsJson2Layer.json2Layers(options.layers);
        super(baseOptions);
        this.workLayer = undefined;
        this.editionBar = undefined;
        this.interactionMap = {};
    }

    // -------workLayer ------------------------------------------------ <<<<<

    setWorkLayer(layer) {
        if (this.workLayer) {
            delete this.workLayer.workLayer;
        }
        if (!layer || (this.workLayer === layer)) {
            this.workLayer = undefined;
            return undefined;
        }
        this.workLayer = layer;
        this.workLayer.workLayer = true;
        return this.workLayer;
    }

    // -------workLayer ------------------------------------------------ >>>>>
    // -------Interacciones -------------------------------------------- <<<<<

    activateInteraction(action) {
        this._eraseInteractionMap('highlight');
        if (action === 'highlight') {
            this._createInteractionHighlight();
        }
    }

    activateBar(bar, activate, layer) {
        if (bar === 'editionBar') {
            if (activate) {
                this._eraseInteractionMap('highlight');
                if (this.editionBar && layer !== this.editionBar.getLayer()) {
                    this.editionBar.saveChanges();
                    this.editionBar.destroy();
                    this.editionBar = undefined;
                }
                if (!this.editionBar) {
                    if (layer.editable) {
                        this.editionBar = new OlTsEditionBar({
                            map: this,
                            layer: layer
                        });
                    }
                }
            } else {
                if (this.editionBar) {
                    this.editionBar.saveChanges();
                    this.editionBar.destroy();
                    this.editionBar = undefined;
                }
                this._createInteractionHighlight();
            }
        }
    }

    isEditionBarActivated() {
        return !!this.editionBar;
    }

    _eraseInteractionMap(action) {
        if (this.interactionMap[action]) {
            if (this.interactionMap[action].getFeatures) {
                this.interactionMap[action].getFeatures().clear();
            }
            this.removeInteraction(this.interactionMap[action]);
        }
        this.interactionMap[action] = undefined;
    }

    _createInteractionHighlight() {
        if (!this.interactionMap.highlight) {
            this.interactionMap.highlight = new OlInteractionSelect({
                condition: olEventsConditionPointerMove,
                style: olTsJson2Style.styleSelect(),
                layers: (lyr) => {
                    if (this.workLayer) {
                        if (lyr === this.workLayer) {
                            this._layerPaint = lyr;
                            return true;
                        }
                        this._layerPaint = false;
                        return false;
                    }
                    if (lyr.get('noHighlight')) {
                        this._layerPaint = false;
                        return false;
                    }
                    this._layerPaint = lyr;
                    return true;
                }
            });
            this.addInteraction(this.interactionMap.highlight);
        }
    }

    // -------Interacciones -------------------------------------------- >>>>>
    // -------Otras funciones ------------------------------------------ <<<<<

    captureMap(opt) {
        var oriView = this.getView();
        var size = opt.size || this.getSize();
        var bb = opt.bbox || oriView.calculateExtent(this.getSize());
        var captureTransform = (opt.size || opt.bbox);

        if (captureTransform) {
            var newView = new OlView({
                center: oriView.getCenter(),
                zoom: oriView.getZoom()
            });
            this.setView(newView);
            var divCp = document.createElement('div');
            divCp.setAttribute('id', '_divCpMap');
            divCp.setAttribute('style', 'position:absolute;right:100%;width:' + size[0] + 'px;height:' + size[1] + 'px;');
            document.body.appendChild(divCp);
            var oriTarget = this.getTarget();
            this.setTarget('_divCpMap');
        }
        this.once('rendercomplete', () => {
            if(opt.canvasElementById){
                var mapCanvas = document.getElementById(opt.canvasElementById)
            }else{
                var mapCanvas = document.createElement('canvas');
            }
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            var mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
                document.querySelectorAll('.ol-layer canvas'),
                (canvas) => {
                    if (canvas.width > 0) {
                        var opacity = canvas.parentNode.style.opacity;
                        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                        var transform = canvas.style.transform;
                        // eslint-disable-next-line no-useless-escape
                        var matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
                        CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
                        mapContext.drawImage(canvas, 0, 0);
                    }
                }
            );
            if (captureTransform) {
                this.setTarget(oriTarget);
                this.setView(oriView);
                divCp.parentNode.removeChild(divCp);
            }
            try{
                var dataURL = mapCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
                document.getElementById(opt.target).src = dataURL;
            }catch (e){
                throw e;
            }
        });
        if (captureTransform) {
            newView.fit(bb, { padding: [10, 10, 10, 10] });
        } else {
            this.renderSync();
        }
    }
}

export default OlTsMap;

import 'ol/ol.css';
import './external_Modules/layerSwitcher/LayerSwitcher.css';
import './css/main.css';

import mapa from './json/capas.js';
import OlExtControlLayerSwitcher from './external_Modules/layerSwitcher/LayerSwitcher';
import OlTsMap from '../../src/map/OlTsMap';

import { Control } from 'ol/control';

const CaptureMap = (function(Control) {
    function CaptureMap(optOptions) {
        var options = optOptions || {};

        var button = document.createElement('button');
        button.innerHTML = 'C';

        var element = document.createElement('div');
        element.className = 'buttonCaptureMap ol-unselectable ol-control';
        element.appendChild(button);

        Control.call(this, {
            element: element,
            target: options.target
        });

        button.addEventListener('click', this.clickCaptureMap.bind(this), false);
    }

    /* jshint proto: false */
    // if (Control) CaptureMap.__proto__ = Control;
    if (Control) Object.setPrototypeOf(CaptureMap, Control);
    CaptureMap.prototype = Object.create(Control && Control.prototype);
    CaptureMap.prototype.constructor = CaptureMap;

    CaptureMap.prototype.clickCaptureMap = function() {
        var divMP = document.getElementById('divCaptureMap');
        if (!divMP) {
            var divCp = document.createElement('div');
            divCp.id = 'divCaptureMap';
            document.body.appendChild(divCp);
            var imgCp = document.createElement('img');
            imgCp.id = 'imgCaptureMap';
            divCp.appendChild(imgCp);
            var canvasCp = document.createElement('canvas');
            canvasCp.id = 'canvasCaptureMap';
            divCp.appendChild(canvasCp);
            this.getMap().captureMap({ imageTarget: 'imgCaptureMap', canvasTarget: 'canvasCaptureMap', size: [400, 200] });
        } else {
            divMP.parentNode.removeChild(divMP);
        }
    };

    return CaptureMap;
}(Control));

export default () => {
    mapa.target = 'map';
    const map = new OlTsMap(mapa);

    // Añadimos control de capas dentro del mapa

    const switcher = new OlExtControlLayerSwitcher({
        show_progress: true,
        extent: true,
        trash: true,
        oninfo: (layer) => {
            console.log('modify: ' + layer.get('title'));
        },
        onselect: (layer) => {
            if (map.isEditionBarActivated()) {
                map.activateBar('editionBar', false);
            }
            map.setWorkLayer(layer);
            switcher.drawPanel();
        },
        onedit: (layer) => {
            if (map.workLayer === layer) {
                if (map.isEditionBarActivated()) {
                    map.activateBar('editionBar', false);
                } else {
                    map.activateBar('editionBar', true, layer);
                }
            } else {
                if (map.setWorkLayer(layer)) {
                    map.activateBar('editionBar', true, layer);
                } else {
                    map.activateBar('editionBar', false);
                }
            }
            switcher.drawPanel();
        },
        style: 'workLayer'
    });

    /*
    switcher.on('drawlist', function(e) {
        var layer = e.layer;
        document.createElement('div').innerText('?')// addClass('layerInfo')
          .click(function(){
            alert(layer.get('title'));
          })
          .appendTo($('> .ol-layerswitcher-buttons', e.li));
      });

    */

    map.addControl(switcher);
    map.addControl(new CaptureMap());
    map.activateInteraction('highlight');
    /*
    switcher.on('toggle', function(e) {
        console.log('Collapse layerswitcher', e.collapsed);
    });
    */
};


import OlLayerVector from 'ol/layer/Vector';
import OlFormatGeoJSON from 'ol/format/GeoJSON';
import olTsJson2Source from '../utils/olTsJson2Source';

class OlTsLayerVector extends OlLayerVector {
    constructor(optOptions) {
        const options = optOptions || {};
        if (!options.source) {
            options.source = olTsJson2Source.json2source({
                type: 'Vector'
            });
        }
        super(options);
        this.selectable = options.selectable || false;
        this.editable = options.editable || false;
        this.geometryType = options.geometryType || undefined;
        if (options.labels && options.style) {
            const labels = options.labels;
            const _style = this.getStyle();
            if (labels.fields) {
                this.setStyle((feature) => {
                    const st = _style.clone();
                    const tx = st.getText();
                    if (tx && labels.visible) {
                        if (labels.template) {
                            let t = labels.template;
                            for (let i = 0; i < labels.fields.length; i++) {
                                t = etiquetaCluster[labels.fields[i][0]](t, feature, labels.fields[i]);
                            }
                            tx.setText(t);
                        } else {
                            if (labels.content) {
                                tx.setText(labels.content(feature, labels.fields));
                            }
                        }
                    }
                    return st;
                });
            } else {
                this.setStyle((feature) => {
                    const st = _style.clone();
                    const tx = st.getText();
                    tx && tx.setText((labels.visible) ? feature.get(labels.field) : undefined);
                    return st;
                });
            }
        }
        // console.log(options);
        // console.log(this);
    }

    save(features) {
        if (this.saveJSON) {
            const jsAdd = [];
            const jsMod = [];
            const idDel = []; // Se presupone que los elementos a borrar tienen ID
            const edited = {};
            if (features) {
                for (const fea of Object.keys(features)) {
                    if (features[fea].type === 'addfeature') {
                        jsAdd.push(features[fea].feature);
                    } else if (features[fea].type === 'changefeature') {
                        jsMod.push(features[fea].feature);
                    } else if (features[fea].type === 'removefeature') {
                        idDel.push(features[fea].feature.getId());
                    }
                }
                if (jsAdd.length) {
                    edited.addfeatures = (new OlFormatGeoJSON({})).writeFeaturesObject(jsAdd);
                }
                if (jsMod.length) {
                    edited.changefeature = (new OlFormatGeoJSON({})).writeFeaturesObject(jsMod);
                }
                if (idDel.length) {
                    edited.removefeature = idDel;
                }
            }
            return this.saveJSON(edited);
        }
        return false;
    }
}

// ==================================================

const etiquetaCluster = {
    count: function(txt, feature, field) {
        var f = feature.get('features');
        var c = 0;
        for (var j = f.length - 1; j >= 0; --j) {
            c += (f[j].get(field[0]) || 1) * 1;
        }
        return txt.replace(field[0], c);
    },
    sum: function(txt, feature, field) {
        const f = feature.get('features');
        let s = 0;
        for (let j = f.length - 1; j >= 0; --j) {
            s += (f[j].get(field[1]) || 0) * 1;
        }
        if (field[2] !== undefined) {
            s = s.toFixed(field[2]);
        }
        return txt.replace(field[1], s);
    },
    media: function(txt, feature, field) {
        let s = 0;
        let n = 0;
        const f = feature.get('features');
        for (let j = f.length - 1; j >= 0; --j) {
            const v = f[j].get(field[1]);
            if (v !== undefined) {
                s += v * 1;
                n += 1;
            }
        }
        if (n) {
            s = s / n;
            if (field[2] !== undefined) {
                s = s.toFixed(field[2]);
            }
        } else {
            s = '-';
        }
        return txt.replace(field[1], s);
    }
};

// ==================================================

export { OlTsLayerVector };
export default OlTsLayerVector;

// ==================================================

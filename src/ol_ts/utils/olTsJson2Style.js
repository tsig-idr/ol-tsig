import * as olStyle from 'ol/style';

// ------------------------------------------------------------------

var styleName = {
    fill: 'Fill',
    image: 'Image',
    stroke: 'Stroke',
    text: 'Text'
    // Utilizados con type dentro de image: 'Icon', 'Circle', 'RegularShape'
};

var styleSelection = {
    image: {
        type: 'Circle',
        radius: 6,
        fill: {
            color: 'rgba(250,250,250,0.1)'
        },
        stroke: {
            color: '#F00',
            width: 2
        }
    },
    stroke: {
        color: '#F00',
        width: 2
    },
    fill: {
        color: 'rgba(250,250,250,0.1)'
    },
    zIndex: 1
};

/*
    new ol_Style({
        image: new ol_Circle({
            radius: 6,
            fill: new ol_Fill({ color: 'rgba(250,250,250,0.1)' }),
            stroke: new ol_Stroke({ color: '#F00', width: 2 })
        }),
        stroke: new ol_Stroke({
            color: '#f00',
            width: 2
        }),
        fill: new ol_Fill({
            color: 'rgba(250,250,250,0.1)'
        }),
        zIndex: 1
    })
 */

var styleEdition = {
    image: {
        type: 'Circle',
        radius: 6,
        fill: {
            color: 'rgba(0,153,255,1)'
        },
        stroke: {
            color: '#FFF',
            width: 1.25
        }
    },
    stroke: {
        color: '#09F',
        width: 3
    },
    fill: {
        color: 'rgba(250,250,250,0.1)'
    },
    zIndex: 1
};

/*
    style: new OlStyle({
        image: new OlCircle({
            radius: 6,
            fill: new OlFill({ color: [0, 153, 255, 1] }),
            stroke: new OlStroke({ color: '#FFF', width: 1.25 })
        }),
        stroke: new OlStroke({
            color: '#09F',
            width: 3
        }),
        fill: new OlFill({
            color: 'rgba(250,250,250,0.1)'
        }),
        zIndex: 1
    }),
*/

// ------------------------------------------------------------------

function simpleStyle(style) {
    const sty = {};
    for (const key of Object.keys(style)) {
        if (typeof style[key] === 'object') {
            sty[key] = new olStyle[style[key].type || styleName[key]](simpleStyle(style[key]));
            if (style[key].type) {
                sty[key].type = style[key].type;
            }
        } else {
            sty[key] = style[key];
        }
    }
    return sty;
}

function json2Style(style) {
    if (Array.isArray(style)) {
        var l = [];
        for (let i = 0, ii = style.length; i < ii; i++) {
            l.push(json2Style(style[i]));
        }
        return l;
    }
    return new olStyle.Style(simpleStyle(style));
}

function styleSelect(objJSON) {
    return json2Style(objJSON || styleSelection);
}

function styleEdit(objJSON) {
    return json2Style(objJSON || styleEdition);
}

// ------------------------------------------------------------------

const olTsUtilsJSON2Style = {
    json2Style: json2Style,
    styleSelect: styleSelect,
    styleEdit: styleEdit
};

export {
    olTsUtilsJSON2Style
};

// ------------------------------------------------------------------

//let CUSTOM_MAP = [];
let CREATE_TEXT_ELEMENT = function(t, n, x, y, w, a = "left", c = "#CC0000") {
    t[n] = new createjs.Text("000", "16px 'subset_2019_06_10'", c);
    t[n].parent = t;
    t[n].name = n;
    t[n].lineHeight = 0x1a;
    t[n].setTransform(x, y, 1, 1);
    t[n].lineWidth = w;
    t[n].textAlign = a;
    t.mg.addChild(t[n]);
};
let START_SUM = 0;
let BOARD_SUM = 0;
let SUM_STRING = function() {
    return `Start: ${START_SUM}        Sum: ${BOARD_SUM}`
}
let REUSE_COMBINATIONS = [
    [{1: 2}],
    [{2: 1, 1: 1}, {1: 3}],
    [{3: 1, 1: 1}, {2: 2}, {2: 1, 1: 2}, {1: 4}],
];
let SMALLNUM_COMBINATIONS = [
    {1: 1, 4: 1, 5: 1},
    {2: 1, 3: 1, 5: 1},
    {2: 1, 4: 2},
    {3: 2, 4: 1},
    {1: 2, 3: 1, 5: 1},
    {1: 2, 4: 2},
    {1: 1, 2: 2, 5: 1},
    {1: 1, 2: 1, 3: 1, 4: 1},
    {1: 1, 3: 3},
    {2: 3, 4: 1},
    {2: 2, 3: 2},
    {1: 3, 2: 1, 5: 1},
    {1: 3, 3: 1, 4: 1},
    {1: 2, 2: 2, 4: 1},
    {1: 2, 2: 1, 3: 2},
    {1: 1, 2: 3, 3: 1},
    {2: 5},
    {1: 5, 5: 1},
    {1: 4, 2: 1, 4: 1},
    {1: 4, 3: 2},
    {1: 3, 2: 2, 3: 1},
    {1: 2, 2: 4},
    {1: 6, 4: 1},
    {1: 5, 2: 1, 3: 1},
    {1: 7, 3: 1},
    {1: 6, 2: 2},
    {1: 8, 2: 1},
    {1: 10},
    {5: 2},
];
let MAX_STRINGS = function(mg) {
    let leftover = {5: 0};
    let dead = [];

    for (let i = 9; i >= 6; i--) {
        let nine = 0;
        let one = 0;
        for (let kk = 1; kk <= 170; kk++) {
            if (mg[`mk${kk}`].flDroped) continue;
            
            let n = mg[`mk${kk}`].nu;
            if (n == i) nine++;
            if (n == 10 - i) one++;
        }
        console.log(`count ${i} => ${nine}, ${10 - i} => ${one}`);
        let u = one - nine;

        leftover[10 - i] = Math.max(0, u);

        if (i <= 8) {
            while (u < 0) {
                let res = false;
                for (const v of REUSE_COMBINATIONS[8 - i]) {
                    let can = true;
                    for (const [vk, vv] of Object.entries(v)) {
                        if (leftover[vk] < vv) {
                            can = false;
                            break;
                        }
                    }
                    if (can) {
                        res = true;
                        for (const [vk, vv] of Object.entries(v)) {
                            leftover[vk] -= vv;
                        }
                        u += 1;
                    }
                }
                if (res == false) {
                    break;
                }
            }
        }

        dead.push(Math.max(0, -u));

        console.log(`leftover => ${JSON.stringify(leftover)}`);
        console.log(`dead after ${i} => ${dead}`);
    }

    for (let kk = 1; kk <= 170; kk++) {
        if (mg[`mk${kk}`].flDroped) continue;

        let n = mg[`mk${kk}`].nu;
        if (n == 5) leftover[5]++;
    }
    
    let max = 0;
    for (const [vk, vv] of Object.entries(leftover)) {
        max += vv;
    }

    let known = [];
    let best = 0;

    let explore = function(node, apples = 0) {
        best = Math.max(best, apples);

        for (const v of SMALLNUM_COMBINATIONS) {
            let can = true;
            for (const [vk, vv] of Object.entries(v)) {
                if (node[vk] < vv) {
                    can = false;
                    break;
                }
            }
            if (!can) continue;

            let next = {};
            let s = 0;
            for (const [vk, vv] of Object.entries(node)) {
                next[vk] = vv;
            }
            for (const [vk, vv] of Object.entries(v)) {
                next[vk] -= vv;
                s += vv;
            }
            let str = `${next[1]} ${next[2]} ${next[3]} ${next[4]} ${next[5]}`;
            if (known.includes(str)) continue;

            known.push(str);
            explore(next, apples + s);
        }
    };
    
    console.log(`your leftover task is ${JSON.stringify(leftover)}`);

    explore(leftover);
    console.log(`max = ${max}, best = ${best}`);

    return [
        `Dead: ${dead.join(' ')}`,
        `Max: ${170 - dead.reduce((a, b) => a + b, 0) - max + best}`
    ]
}
let APS_STRING = function(a, tot, r) {
    return `${(a / (tot - Math.max(r, 0)) || 0).toFixed(2)} APS`;
}
let ELAPSED_STRING = function(r) {
    let date = new Date(0, 0);
    date.setMilliseconds(Math.max(r, 0) * 1000);
    return `${date.getMinutes()}:${String(date.getSeconds()).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`
}
let ELAPSED_COLOR = function(r) {
    const blue = "#0000CC";
    const red = "#CC0000";
    if (r >= 10) return blue;
    else return r % 1 >= 0.5? red : blue;
}
var _0xee13 = ['instance_1', 'AgsA7IAJgFIAHgEQANgLAJgPQAHgOACgVIgdAAIgMARQgGAJgHAGIgZgPIALgIIAJgMIAIgLIAFgLIAEgLIADgJIABgJIAeAGIgDAHIgDAHIgCAFIgCAEIBBAAIAIAAIAJgBIAAAaIgKAAIgHAAIgUAAQgCAegMAWQgMAWgWAOgAAkgyIgHgMIAPgGIAFAHIAEAIIAEAHIgQAHIgFgLgAA4g6IgHgMIAPgFIAEAHIAFAHIAEAHIgPAHIgGgLg', 'Ag7CwIhkiNQgHgDAAgKQAAgHAHgFIAaglQAFgIAEAAQAGAAAGAIIA+BXICnjlQAFgGAFAAQAGAAADAGIAcAnQADAGAAAJQAAAEgDAIIjLEXg', 'formxstaスタートボタン', 'instance', 'compositions', 'shape_4', 'height', 'frame', 'shape_8', 'mzBtMoreGames', 'AggBMQgSgKgKgUQgLgTAAgbQAAgZALgUQAKgTASgKQARgLATAAQAWAAAPAKQAQAKAHASQAIASAAAXIAAAKIgCAIIhkAAQADAUAMALQAMAKASAAQAKAAAJgDQAJgDAIgFIAPAaQgMAIgPAFQgPAFgPAAQgWAAgTgKgAAjgPQAAgRgHgKQgIgJgQgBQgMAAgKAJQgKAKgCASIBBAAIAAAAg', 'titleEnglish', 'Cl_mm', 'shape_17', 'resize', 'width', 'prototype', 'AgCBGIABgHIAAgIIAAgIIAAgwIgaALQgNAFgOADIgNgWQAOgDAOgFQANgEAMgFIAUgLIAQgMIAOgNIALgMIAVATIgUASIgWAQIAAA/IAAAIIAAAIIABAHg', 'parent', 'bootstrapListeners', 'flLightColor', 'shape_2', 'mm_base', 'AhKANIAAgZICVAAIAAAZg', 'mode', 'funLightColor', 'ray', 'AAxA6IAAhBQAAgLgDgFQgDgEgHAAQgEAAgFACIgJAIIAABLIgjAAIAAhBQAAgLgDgFQgEgEgGAAQgEAAgFACIgJAIIAABLIgkAAIAAhxIAdAAIADAPIAAAAQAHgHAIgFQAJgFALAAQAMAAAGAEQAIAFAEAJQAHgHAJgGQAJgFALAAQASAAAJAMQAJAMgBAWIAABFg', '#55AA33', 'cookie', '#FFFFFF', 'Text', 'background', 'Rectangle', 'mess', '354517nekmBj', 'beginFill', 'mzCheckLightColor', 'Ticker', '_off', 'formesで使用1', 'formm_base', 'soundVolume=', 'shape_14', 'AAMAwIAAgoQAAgHgDgDQgCgDgFAAQgDAAgDACQgDACgEADIAAAuIgRAAIAAhfIARAAIAAAZIAAAMIAJgHQAEgDAHAAQAKAAAFAHQAFAIAAALIAAAqg', 'mksb', '{}.constructor(\x22return\x20this\x22)(\x20)', 'pressmove', 'Cl_mk', 'alpha', 'images/apple_shadownormal.png', 'AgqBoQgUgIgQgQIAYgdQAMALAPAGQAOAHAOAAQAQAAAJgHQAJgGAAgMQAAgIgEgFQgEgFgHgEIgRgHIgcgNQgLgEgLgGQgKgJgGgKQgGgMAAgPQAAgTAKgOQAJgNARgJQAQgIAWAAQASAAASAHQASAHANAOIgWAbQgKgJgLgFQgLgEgNAAQgOAAgIAGQgJAGABAKQgBAIAFAFQAFAFAHAEIAQAHIAcAMQAVAIALAMQAMAPAAAWQAAATgKAOQgJAPgSAJQgRAJgZAAQgVAAgVgIg', 'AgxAyIAAhjIBjAAIAABjg', 'min', '1334MoCCJT', 'shape', 'AgaA0QgNgHgIgNQgIgNAAgTQAAgSAIgNQAIgOANgHQAMgHAOAAQAPAAAMAHQANAHAIAOQAIANAAASQAAATgIANQgIANgNAHQgMAHgPABQgOgBgMgHgAgOgWQgEAJAAANQAAAOAEAIQAFAJAJAAQAKAAAFgJQAEgIAAgOQAAgNgEgJQgFgIgKAAQgJAAgFAIg', 'setChildIndex', 'AsfBVIAAipIY/AAIAACpg', 'tickOnUpdate', 'getNumChildren', 'mksa', 'constructor', 'textBaseline', 'shape_7', 'style', 'ode', 'slice', 'getComposition', 'AldAAIK7gxIAABjg', 'getTimelinePosition', 'nominalBounds', 'shape_6', 'play', 'formzSlSoundRangeBar', 'graphics', 'Time:\x20', 'apple_shadowselected', 'AgNApQgKgFgFgLQgGgKAAgPQAAgOAGgJQAGgLAJgFQAKgGAKAAQAFAAAFABQAFACAEADIAHAFIgJAMIgIgGQgEgCgFAAQgGABgFADQgFAEgDAGQgDAHgBAJQAAAOAHAJQAGAHAKABQAFAAAFgDQAEgCAEgEIAJALQgFAGgHAEQgHADgJAAQgKAAgJgFg', 'rgba(238,255,255,0.031)', 'AgRBTIAAhxIAjAAIAABxgAgOgzQgFgFAAgIQAAgIAFgFQAGgFAIAAQAJAAAGAFQAFAFAAAIQAAAIgFAFQgGAFgJAAQgIAAgGgFg', 'shape_1', 'AgOBEQgLgCgFgGQgGgHAAgKQAAgLAFgHQAGgJAIgGQAIgGAJgEQAAAAgBAAQAAgBAAAAQgBAAgBgBQAAAAgBAAIgEAAQgHAAgGACQgGADgFAEIgHAIIgHAKIgVgQQALgJAJgJQAIgLAGgLIgIAAIgJAAIgJgBIAAgWIAJABIAKABIAJAAIAGAAIACgKIABgIIAYADIgBAGIgBAIIAVgBIAVgDIgBAWIgQACIgRABIgRABIgDAGIgDAGIAFgBIAGgBIAEgBQAHABAFADQAGADADAFIAJgEIAIgEIAKgFIAKgEIAKAWIgHACIgIADIgHACIgKAEIgMAEIAAAPIABAMIgXAAIAAgHIABgJQgHAFgDADQgEAFAAAEQAAAFAFADQAEACAKAAIAPgBIAQgCIAPgCIgBAZIgMABIgRABIgQABQgMgBgKgCg', 'right', 'clear', 'formksa', 'rax', 'shape_19', 'AgZBEQgQgIgKgRQgKgRAAgZQAAgSAGgOQAGgPAKgKQAKgKANgFQANgFAOAAQALAAAJACQAJADAHAEQAHAFAFAFIgTAXQgFgFgHgEQgGgDgJAAQgMAAgHAGQgIAFgFALQgFAKAAAOQAAAWAKAMQAKAMAUAAIAHgBIAHgCIAAgZIgYAAIAAgcIA4AAIAABFQgIAIgNAFQgNAFgQAAQgUAAgRgJg', 'funTileDrop', 'Ag8AyIACgGIAAgGIAAhTIAAgLIgCgJIAfAAIgCAKIAAAKIAABOIATgIIAVgLIAUgOQAKgJAIgJIAOAVQgLANgPALQgPALgQAIQgQAJgTAGIgEACIgHADg', 'AvnH0IAAvnIfPAAIAAPng', 'mousedown', 'AgbBMQgSgKgKgTQgKgUAAgbQAAgaALgTQAMgTASgLQAUgKAVAAQAPAAAMAFQAMAFAIAIIgUAcQgGgFgGgDQgGgDgHAAQgTABgKANQgMAOAAAWQAAAYAMANQAKAOARAAQAKAAAIgEQAHgDAIgGIAQAcQgLAKgOAFQgPAFgNAAQgWAAgSgKg', 'mzSlSoundRangeBar', 'timeline', '338486zeYhgk', 'replace', 'AD6BkInzAAIAAjHIHzAAg', 'flBGM', 'formzBtPlayAgainもう一度プレイ', 'AgoBOIgIgCIAHgbIADABIAFABQAIAAAEgEQAFgEABgFIACgHIgshtIAkAAIAPAvIAFAQIADAQIABAAIAEgPIAEgRIANgvIAiAAIgnBxQgGAPgGAJQgHAKgIAFQgJAFgOAAIgJgBg', '#FF0000', '73px\x20\x27subset_2019_06_10\x27', 'name', 'innerWidth', 'AnMovieClip', 'formes', 'AgiXcMAAAgu3IBFAAMAAAAu3g', 'txScoreEnd', 'Tween', 'paused', 'startPosition', 'shape_18', 'funShuffleSort', 'flDroped', 'mzCheckBGM', 'href', 'AAwpJQBJgKBFgDQDbgJBnBDQB3BNAyB7QAqBoAACfQAAEfjUDMQhnBjh/AtQh3AqicAAQibAAh8gqQiHguhmhiQjUjMAAkfQAAiaAvhtQA1h4B1hQQBhhEDSAKQBTAEBIAM', 'fps', 'mouseY', '#FF6655', 'mzSlSound', 'AArA8IgEgJIgXACIgYACIgYAEIgTABIgIACIgIABIgEgdIAJAAIAKAAIACAAIAHgUIAIgXIAGgVIAGgQIACgLIABgKIAeAGIgEAJIgDALIgFAPIgGAUIgHAUIgGASIAZgDIAZgDIgIgPIgIgLIAZgKIAJAPIAKASIAJASIAHAPIgaAMIgEgIg', 'AghA3QgHgFgEgIQgEgHAAgKQgBgSAQgJQAPgKAggEQgBgHgEgEQgEgDgHAAQgHAAgHACQgIADgIAFIgNgYQAMgHAMgEQAMgEAMAAQAXAAALANQAMANAAAaIAABAIgdAAIgCgMIgBAAQgHAHgIAEQgHADgKABQgKgBgIgEgAgIAMQgHAEAAAGQABAFADADQADACAGAAQAEAAAEgCQAEgDAEgEIAAgSQgQACgGAFg', 'AgVAiIAAhBIAPAAIABALIAAAAQAFgGADgEQAFgDAFAAIAFAAIADABIgCAPIgEgBIgDAAQgEAAgFADQgDADgDAIIAAAmg', 'Ag7AzQAQgDAMgGQALgGAJgGQAIgIAGgIQAHgJAEgKQAFgLABgJIhFAAIgMAAIgJAAIAAgbIAGABIAIAAIAHAAIBFAAIAGAAIAGAAIAAgBIAAgBQAAgGACgFQADgEAFgDQAEgDAGAAQAFAAAFADQAEADADAEQACAFAAAGQAAAFgCAEQgDAEgEADQgFADgFAAIgBADIgBAEIgFARIgHAUQgFALgHAJQgLAPgPALQgRAMgVAHgAAug7QgDABAAAFQAAADADACQACACAEABQADgBADgCQACgCAAgDQAAgFgCgBQgDgDgDAAQgEAAgCADg', 'actionFrames', 'mes', '#ff9900', 'AgRAwQgHgDgDgEQgEgDAAgGQAAgFACgDQADgEAEgCIAAgBIgEgEQgCgDAAgEQAAgEACgCIAGgFIAAgBQgEgCgCgFQgDgFAAgFQAAgJAEgFQADgGAHgCQAGgDAHAAIAEAAIAFACIAYAAIAAANIgLAAIACAEIABAGQAAAIgEAEQgDAFgGADQgGACgGAAIgEAAIgFgBIgCACIgBADQAAABAAAAQABABAAAAQAAABABAAQAAABABAAQACABAGAAIAKAAQANABAGAEQAGAEAAAIQAAAHgEAGQgFAFgIADQgIADgKAAQgIAAgGgBgAgPAZIgCAEQAAAFAFABQAEADAHAAQAHAAAFgDQAEgCABgEQAAgFgDgBQgDgBgGAAIgHAAIgFAAIgEAAIgDADgAgKggQgCACgBAHQABAGACADQADADAFAAQADAAADgDQADgDAAgGQAAgHgDgCQgCgEgEAAQgFAAgDAEg', '236ppdhys', 'point', 'wait', 'mzTimeBarS', 'forEach', 'mzGreenButtonColor', 'formzTimeBar残り時間バー', 'formzSlSoundRange', 'bootcompsLoaded', 'AgmA6IAAhxIAdAAIACAUIABAAQAGgLAIgGQAJgFAIAAIAIAAIAGACIgGAfIgGgCIgGAAQgHAAgGAEQgHAFgEALIAABAg', 'funPlayBGM', '1365832sFUayd', 'return\x20(function()\x20', 'AgLA4QgLAAgGgCQgHgCgDgFQgCgFAAgIIAAgtIgDACIgCACIgFgFIgGgFIAPgMQAHgGAFgHIAIgNIAPADIgBADIgCADIAWAAIADgBIAJAGIgEAJIgGAIIAgAAIAAAtIgPAAIAAgFIg6AAIAAARIABAGQABACAEABIAJAAIAnAAIAIgBQADgBACgDIACgKIAEACIAFACIAFABQgCAJgCAFQgDAFgGADQgFACgKAAgAAJAEIAXAAIAAgPIgXAAgAgaAEIAWAAIAAgPIgWAAgAgWgdIgEAFIAaAAIACgFIADgFIgXAAIgEAFg', 'titleJapanese', 'mzTitle', 'lineHeight', 'AgDAsQgFgEgDgGQgCgGAAgIIAAgfIgLAAIAAgPIAMgBIACgTIAPAAIAAATIASAAIAAAQIgSAAIAAAfQAAAGACADQADADAFAAIADgBIAEgBIADAOIgHACIgIABQgJAAgEgDg', 'Ag7AzQAQgDALgGQAMgGAJgGQAIgIAGgIQAHgJAEgKQAFgLABgKIhFAAIgMABIgJAAIAAgbIAGAAIAIABIAHAAIBFAAIAGAAIAGgBIAAgBIAAgBQAAgFACgFQADgEAFgDQAEgDAGAAQAFAAAFADQAEADADAEQACAFAAAFQAAAFgCAFQgDAEgEADQgFADgFAAIgBADIgBAEIgFARIgIAUQgEAKgHAKQgLAOgPAMQgRAMgVAHgAAug8QgDADAAADQAAADADADQACACAEAAQADAAADgCQACgDAAgDQAAgDgCgDQgDgCgDAAQgEAAgCACg', '#CCFFCC', 'framerate', 'formzTextLightColor', 'funEnterFrameTileDrop', 'mzSlSoundRange', 'AmoDlQivheAAiHQAAiGCvhfQCwhfD4AAQD4AACwBfQCwBfAACGQAACHiwBeQiwBgj4AAQj4AAiwhgg', 'mksac', 'round', 'Ag5BMIAAhNIgEAEIgEAEIgDgHIgFgJIgEgHQAHgHAGgKIAMgUQAGgKAEgMIAWAHIgHAQIgIAQIAAAWIASgHIAAgjIAXAAIAAAaIAKgEIAAgoIAXAAIAAAfIAKgEIADgCIAFgDIAPAGIgBADIAAAiIgBARQABAGgDAEQgCAEgEACQgEACgGABIgKAAIAAgGIgBgIIgCgGIAAAeIgXAAIAAgvIgKAEIAAAwIAAAHQABAAAAABQAAAAAAABQABAAAAAAQABABAAAAIAIABIAbAAQAFAAACgCQADgCABgEIACgOIAGAEIAHADIAIACQgCANgDAHQgDAHgHADQgFAEgMgBIgfAAQgNABgGgDQgHgDgCgHQgEgHAAgMIAAgoIgKAEIgIgRIAABXgAAngTIAAAZIAEAAIADAAIADAAIABgDIAAgHIAAgTg', 'Sound', 'formesで使用2', '#ff0000', 'beginStroke', 'AARA6IAAhBQAAgLgEgFQgDgEgHAAQgEAAgFADQgFACgEAFIAABLIgkAAIAAhxIAdAAIACAPIABAAQAHgHAJgFQAIgFAMAAQASAAAJAMQAIAMAAAWIAABFg', 'AAGAAIgLAB', 'AA9APIgIAAIgHAAIhTAAIgKAAIgKAAIgIAAIAAgdIAIAAIAKABIAKAAIBTAAIALgBIAJAAIAAAdIgFAAg', 'formzCheckBGM', 'formks', 'Shape', 'LightColor=', 'mks', 'AggAsIAAhYIAdAAQAJAAAHACQAHACAEAFQAFAFAAAJIgCAHIgEAHQgDADgEACIAAABQAHABAGAEQAEAFAAAJQAAAKgEAFQgFAGgIADQgIADgJgBgAgOAfIAMAAQAIAAAFgEQAFgDAAgHQAAgGgFgDQgFgDgIAAIgMAAgAgOgHIAKAAQAIAAADgDQAFgDgBgGQAAgFgEgDQgEgDgHAAIgKAAg', 'Stage', 'off', 'frame_9', 'mouseChildren', 'soundVolume', 'AgLBNQgHgGgDgJQgDgIAAgMIAAh7IAjAAIAAB8QAAAGACACQAAAAABAAQAAABAAAAQABAAAAAAQABAAAAAAIACAAIADAAIAEAaIgIACIgKABQgLAAgHgEg', 'shape_12', 'AirBfIACgQIAEgxIAJgIQAtgnBKgiQBIgiA8gJQAbgEAaAGQAXAEABAFQACAHgKAQQgMAVgUASQgtAlhKAjQhJAig8AJQgRADgOAAQgMAAgIgCg', 'lineWidth', '7475C6A158E3BF4B8C03C4B79FFD5BA3', 'formzCheckLightColorで使用', 'random', 'MovieClip', 'Ag3BKIAAiUIA0AAQAQAAAOAFQANAFAIAKQAIALAAASQAAASgIAKQgIALgNAGQgNAFgPAAIgSAAIAAAxgAgTgCIAPAAQANAAAGgGQAGgGAAgLQABgLgIgFQgGgEgNAAIgOAAg', 'mzTextLightColor', 'pmmk', 'update', 'AsfCvIAAldIY/AAIAAFdg', 'Ag8AyIACgGIAAgGIAAhTIgBgLIgBgJIAfAAIgCAKIAAAKIAABOIATgIIAVgLIAUgPQAKgIAIgJIAOAVQgLANgPALQgOAKgSAJQgQAJgSAGIgEABIgHAEg', 'init', '29falpWK', 'enable', 'enableMouseOver', 'pointer', 'formksac', '#999999', 'true', '#00CC00', 'split', 'formzBtMoreGames他のゲームをプレイ', 'AhpBdQgsgvAAhAQAAhUA0gcQAYgQAzAMQAPAEANAFIABAAIAbgIQAwgKAVAPIAAABQAdARALAhQAHAVAAAmQAABAgrAvQgsAvg/AAQg+AAgrgvg', 'Bitmap', 'AAmBIQgLgDgKgEQgMAEgLACQgNAEgOABIgCgHIgEgHIgEgFIAUgCIASgEIgIgHIgHgIIAIgDIgXAAIAAgSIBTAAIAEgBIAPAIQgFAJgGAIQgGAGgIAGIARAEIASACIgFAFIgFAHIgEAHQgNgBgMgDgAAKAmIAHAEIAIgDIAHgGIgdAAIAHAFgAg+BGIgHgEIgHgEQAFgJADgKIAEgVIACgVIABgSIAAgsIA4AAIAAgPIAXAAIAAAPIA4AAIAAAUIhxAAIAAAYIgBAVIgCAZQgCANgEALQgDANgGAJIgFgFgAgRALIAAgXIgTAAIAAgSIATAAIAAgJIAVAAIAAAJIAYAAIAAgJIAXAAIAAAJIAWAAIAAASIgWAAIAAAXgAAEgFIAYAAIAAgHIgYAAg', 'handleSoundStreamOnTick', '#990000', 'value', 'loop', 'mzBtReset', 'drawRect', 'AgNAiQgIgFgFgIQgFgJAAgMQAAgLAFgIQAFgJAHgFQAIgEAIAAQAKAAAHAEQAGAFAEAHQADAIAAALIAAAEIgBADIgrAAQABAJAFAFQAFAEAIAAIAIgBIAIgEIAHAMQgGAEgGACQgHACgHAAQgJAAgIgEgAAQgGQAAgIgDgEQgEgFgHAAQgFAAgEAEQgEAFgCAIIAdAAIAAAAg', 'floor', 'AgWAVQABgIAEgIQAGgKAJgHIAEgGQACgCADgCQAEgCAEAAQAFAAABACQABABAAAAQABAAAAABQAAAAAAABQAAABgBAAIgJAJQgHAGgEAIQgDAIgBAIIgMAEIgIgEg', 'shape_13', 'scaleX', 'scaleY', 'AAPAwIgSgkIgOAAIAAAkIgTAAIAAhfIAiAAQAJAAAIADQAIACAFAHQAFAGAAALQAAALgFAHQgFAGgJADIAXAngAgRgCIANAAQAIAAAFgEQAFgEAAgIQAAgIgFgDQgFgDgIAAIgNAAg', 'rgba(255,255,255,0.008)', 'shape_11', 'BGM=', 'addEventListener', 'images/titleEnglish.png', 'isSingleFrame', 'textAlign', '14811EmYpBF', 'rgba(0,255,51,0.012)', 'txTimeUpTime1', 'http://www.gamesaien.com', 'shape_10', 'shape_5', 'bootstrapCallback', '#2299cc', '33SwjWuC', 'syncStreamSounds', 'center', 'AkSIuQiHguhlhiQjTjMAAkfQgBiaAwhtQA0h4B1hQQBghEDTAKQBUAEBHAMIAiAHIAugIIALgCQBIgKBGgDQDcgJBmBDQB3BNAyB7QApBoAACfQAAEfjTDMQhnBjh/AtQh3AqibAAQicAAh9gqg', 'shape_15', 'initialize', 'AgOApQgKgFgFgKQgGgLAAgPQAAgNAGgLQAGgKAJgFQAKgGALAAQAGAAAFABQAGACADADIAHAFIgJALIgHgEQgFgCgGgBQgHAAgFAEQgFAEgDAGQgEAHAAAJQAAAPAHAIQAHAHAMABIAGgBIAFgDIAAgRIgQAAIAAgNIAgAAIAAAmQgFAFgHADQgIADgJAAQgLAAgKgFg', 'Ag5BYQgJgJAFgLQABgEADgDQAGgGAHgDQAQgJAUAJIACiDIAAgPQAAgHAHAEIAWAXIAWAWQAMANAFASQAEAOgFALIgEAIQgGALgJAGIgJAFIgJgCQgCgFAEgDIAGgHQAIgLACgNQAAgDgBgCQgLgVgVgMIAAB3IgDAKIgSAKQgKAFgJAAQgPAAgLgLg', 'AgEApIAIgBIAHgBQAJgDAIgFQAIgGAEgIQAEgIAAgJQAAgQgHgKQgHgKgOgEIgEAUIgGAVQgEAQgGALQgFAMgJAHQgHAHgKAAQgKAAgHgHQgIgGgFgLQgEgLAAgOQAAgNAFgNQAGgMAKgKQAKgJAOgGQAOgFAOAAQAVAAAPAIQAPAJAHAOQAIAOAAASQABAQgHAOQgHANgOAJQgNAJgUADgAgdgdQgIAIgDAIQgEAJgBAHQABAKADAFQADAGAEAAQAEAAAFgHQAEgHADgNIAFgSIAEgSQgMADgIAHg', 'totalFrames', 'AgyB/IAIhTQAGhbAFgjQABgRACgGQAFgQANgIQAOgHARAEQAQADAJAOQAHAOgDAPIgCAKIAAACIgHBLIgEAxIgCAQIgFA8IguAIIgigHg', '#339900', 'rgba(66,66,66,0.008)', '16px\x20\x27subset_2019_06_10\x27', 'call', 'forme終了画面', 'reversed', 'BGM', '#BB5555', 'addChild', 'formzCheckLightColor', 'formd', 'text', '11zvPBcn', 'innerHeight', 'txTimeUpTime2', 'alphabetic', 'labels', 'EhyIBNMMAAAiaXMDkRAAAMAAACaXgEg09gf7MAAAA/FQAAEOEgAAMBldAAAQEgAAAAkOMAAAg/FQAAkPkgAAMhldAAAQkgAAAAEPg', 'gotoAndPlay', 'attribute', 'formksb', 'item', 'rgba(68,68,68,0.008)', 'Time:\x20000.0', 'lisFunEnterFrameTileDrop', '[wpUuwrfBIBhDqlMIABMPlfDWThBFvyAW]', 'gotoAndStop', '#993300', 'frame_1', 'りんごのふち', 'images/titleJapanese.png', 'charCodeAt', 'txPoint', 'AhXBMQglgoAAg2QAAhDAogXQARgLAmAJQAPAEANAFIAHACIAJgDIAYgGQAkgIAPAKQAVAMAIAZQAGASAAAhQAAA2glAoQgkAng0AAQgzAAgkgng', 'log', 'AgWA0QgNgHgIgNQgHgNgBgTQAAgSAIgNQAIgNAMgIQAMgHANAAQARAAAKAHQAMAIAFAMQAGAMAAAQIgBAIIgCAGIhBAAQADAMAHAFQAGAFALAAIAMgBIANgGIALAWQgJAGgKADQgMAEgJAAQgQgBgNgHgAAVgMQAAgJgEgFQgEgFgKgBQgGAAgGAFQgFAFgCAKIAlAAIAAAAg', 'volume', 'AgNAhQgHgDgFgEIAIgLIAJAFQAEACAEAAQAFAAACgCQADgCAAgDQAAAAAAgBQAAgBgBAAQAAgBAAAAQgBgBAAAAIgGgDIgFgDIgJgEQgEgBgDgEQgDgEAAgGQAAgGADgEQADgFAGgDQAGgCAGAAQAIAAAFACIAKAGIgIALIgHgEIgHgCQgEAAgCACQgCACAAADQAAAAAAABQAAAAAAABQAAAAABABQAAAAABABIAEACIAGADIAJAEQAEABADAEQADAEAAAGQAAAGgDAFQgDAFgGADQgGACgIAAQgGAAgHgCg', 'AgaAsIAAhYIASAAIAABKIAjAAIAAAOg', 'synched', 'properties', 'mouseX', 'getChildAt', '#FF3300', 'formb', '_renderFirstFrame', 'shape_9', 'bold\x2016px\x20\x27subset_2019_06_10\x27', 'AgsXmMAAAgvLIBZAAMAAAAvLgAgiXcIBFAAMAAAgu3IhFAAg', 'AgDBGIABgGIABgJIAAgIIAAgvIgaAKQgNAFgNAEIgOgXQAOgDANgEIAagKQAMgGAHgGIAQgLIAPgMQAGgHAFgGIAVATIgUASIgXAQIAAA/IABAIIABAJIABAGg', 'seek', 'formzBtResetリセットボタン', 'frame_6', 'LightColor', 'addTween', 'AAMAyIgDgFIAGAAIAEAAIACgBIABgBIAAgJIgXAAIAFAFIADADIgIAJIgGgGIgIgGIAEgFIgLAAIAAgLIAsAAIAAgEIgmAAIAAgeIAYAAIAAgEIgdAAIAAgEIgIAKIgGgFIgGgDIgIgFIAJgJIAGADIAHAEIAGAEIAAgFIAdAAIAAgHIAGAAIAAgEIgZAAIAAAHIgOAAIAAgHIgbAAIAAgMIAbAAIAAgHIAOAAIAAAHIAZAAIAAgHIAOAAIAAAHIAaAAIAAAMIgNAAIAFADIAFADIgEAFIAGAAIAAAKIgfAAIAAAEIAaAAIAAAeIgNAAIAAAEIAUAAIAAALIgUAAIAAAJIgBAHQgBADgDABQgDABgEABIgKAAIgBgGgAAWAMIAMAAIAAgGIgMAAgAgDAMIALAAIAAgGIgLAAgAAWAAIAMAAIAAgEIgMAAgAgDAAIALAAIAAgEIgLAAgAAogZIgFgDIgEgDIAEgFIgHAAIAAAHIgGAAIAAAEIASAAIAAAAgAg0AvIAGgJIAHgKIAFgKIALAIIgIAOIgJAPgAgnAIIgIgFIgHgDIAIgJIAIAEIAHADIAFAEIgIAKIgFgEg', 'messs', 'AgOAjQgIgDgFgEIAIgMIAKAGQAFACAEAAQAFAAADgCQACgCAAgEQAAgDgCgCIgGgDIgGgDIgJgEQgFgCgDgEQgDgEAAgGQAAgHAEgFQADgFAGgDQAGgCAHAAQAIAAAGACQAHADAEAEIgIALIgIgEQgEgCgEAAQgEAAgCACQgDACAAADQAAAAAAABQAAABABAAQAAABAAAAQABABAAAAQACACADABIAHADIAKAEQAEACADAEQADAEAAAHQAAAHgDAFQgDAFgHADQgGADgJAAQgHAAgHgDg', 'globalToLocal', 'listener', 'apply', 'removeChild', 'formzTimeBarS', 'rgba(255,255,255,0.122)', 'flPerfectScore', 'setTransform', 'shape_3', 'mzBtPlay', 'get', 'abs', 'removeAllEventListeners', 'formg', 'forチェックボックスで使用', 'AgfBPQgLgDgGgGQgHgGAAgLQAAgHAEgFQAEgGAIgEIAAgBQgEgDgDgFQgDgEAAgIQAAgGADgEQAEgGAFgEIAAgBQgGgEgEgHQgFgIAAgKQAAgOAHgJQAHgJAKgFQALgEANAAIAIAAIAJACIApAAIAAAaIgSAAIADAGIABAIQAAANgGAJQgGAIgLAEQgKAEgLAAIgGAAIgIgCQAAABgBAAQAAAAgBABQAAAAAAABQAAAAAAAAIgBAEQAAAEADACQAEACAKAAIARAAQAUAAALAHQAMAHAAAPQAAAMgHAJQgIAKgPAFQgPAFgSAAQgOAAgKgDgAgZAqQgBADAAADQAAAGAHADQAGADAMAAQAKAAAGgEQAHgDAAgGQAAgFgEgBQgFgCgHAAIgKAAIgKAAIgGgBIgFAEgAgPg1QgEAEAAAJQAAAJAEAEQAEAFAHAAQAFAAAEgFQAEgEAAgJQAAgJgEgEQgEgFgFAAQgHAAgEAFg', 'apple_shadownormal', 'images/frame.png', 'mzTimeBar', '#33FF99', 'stage', 'tickEnabled', 'shape_16', 'AiNBpQg6grAAg+QAAg+A6grQA7gsBSAAQBUAAA5AsQA7ArAAA+QAAA+g7ArQg5AthUAAQhSAAg7gtg', 'arC', '30px\x20\x27subset_2019_06_10\x27', 'lisFunEnterFrame', 'AgjAvQAUgCAPgFQANgFAIgIQAHgIAAgLQAAgEgCgEQgCgDgFgCQgEgDgHAAQgIAAgIACIgNADIgKADIgIACIgJADIgHgaIAKgBIAJgCIAVgFQANgCANAAQANAAAKAFQAKAFAGAJQAGAJAAAMQAAARgKANQgKANgRAIQgSAIgWADgAAVgoIgUgCIgTgCIgQgDIAEgXIARADIATACIAUACIAQAAIgEAYIgRgBg', '883fnZjpw', 'AgPAfQgHgEgFgIQgEgIAAgLQAAgKAEgIQAFgIAHgEQAHgEAIAAQAIAAAIAEQAHAEAEAIQAFAIAAAKQAAALgFAIQgEAIgHAEQgIAEgIAAQgIAAgHgEgAgKgOQgDAGAAAIQAAAKADAFQAEAGAGAAQAHAAADgGQAEgFAAgKQAAgIgEgGQgDgGgHAAQgGAAgEAGg', 'AAeBKIgIgiIgrAAIgJAiIgkAAIAuiUIAqAAIAuCUgAAPAMIgDgMIgGgXIgGgYIAAAAIgGAYIgFAXIgEAMIAeAAg', 'formzGreenButtonColor', 'max', '32507jXFQAe', 'cursor', 'AgmBMQgRgKgMgTQgLgUABgbQgBgaALgTQAMgTARgLQASgKAUAAQAVAAASAKQARALALATQALATAAAaQAAAbgLAUQgLATgRAKQgSAKgVAAQgUAAgSgKgAgZgkQgJAOAAAWQAAAYAJANQAJAOAQAAQARAAAIgOQAJgNAAgYQAAgWgJgOQgIgNgRgBQgQABgJANg', 'AAYAsIAAgkIAAgJIABgKIABgKIAAAAIgHAVIgOAkIgJAAIgOgkIgHgVIgBAAIABAKIABAKIABAJIAAAkIgQAAIAAhYIATAAIAPAqIADAIIACAJIAAAAIADgJIADgIIAPgqIATAAIAABYg', 'formzTitle', 'formzSlSound', 'AgfAoQgFgFgFgJQgEgKgBgQIgBgKIgBgMIAAgJIAAgGIgBgGIATAAIgBAFIgBAFIAAAFIAAAMIABANIACAOQACAGACAEQADAEAEAAQAAAAABAAQAAgBABAAQAAAAABgBQAAAAABgBIADgFIADgIIACgIIALAPQgEAKgDAGQgDAGgFADQgEADgFAAQgGAAgGgEgAAgAKIgEgQIgGgQQgEgIgFgFIAPgFIAIANIAHAPIAEAQIADAQIgQAGIgCgQg', 'push', 'length', 'cache', 'indexOf', 'kkk', 'timeUpTime', 'makeResponsive', 'http://en.gamesaien.com', 'txNu', 'fro', 'rotation', 'frame_0', 'compositionLoaded', 'currentFrame', '#C9FFC9', 'visible', '000', 'tick', 'mzBtPlayAgain', 'click', 'stop'];
var _0x12dd = function(_0x256294, _0x1f9f68) {
    _0x256294 = _0x256294 - 0x7b;
    var _0x49d87e = _0xee13[_0x256294];
    return _0x49d87e;
};
(function(_0x210dbb, _0x2b1b2c) {
    var _0x64a9ef = _0x12dd;
    while (!![]) {
        try {
            var _0x475f23 = -parseInt(_0x64a9ef(0x10b)) * parseInt(_0x64a9ef(0x158)) + -parseInt(_0x64a9ef(0x135)) + parseInt(_0x64a9ef(0xb8)) * parseInt(_0x64a9ef(0x1d5)) + -parseInt(_0x64a9ef(0x1b6)) * parseInt(_0x64a9ef(0x195)) + parseInt(_0x64a9ef(0x1be)) * -parseInt(_0x64a9ef(0xb3)) + -parseInt(_0x64a9ef(0xf8)) + parseInt(_0x64a9ef(0x163));
            if (_0x475f23 === _0x2b1b2c)
                break;
            else
                _0x210dbb['push'](_0x210dbb['shift']());
        } catch (_0x7b66f5) {
            _0x210dbb['push'](_0x210dbb['shift']());
        }
    }
}(_0xee13, 0x3eb9c),
function(_0x417268, _0x470bf3) {
    var _0x182e50 = _0x12dd, _0x1f9ec9 = function() {
        var _0x5ac2ac = !![];
        return function(_0x1759ab, _0x53c596) {
            var _0xe46dba = _0x5ac2ac ? function() {
                var _0x3e30c3 = _0x12dd;
                if (_0x53c596) {
                    var _0x39a67c = _0x53c596[_0x3e30c3(0x99)](_0x1759ab, arguments);
                    return _0x53c596 = null,
                    _0x39a67c;
                }
            }
            : function() {}
            ;
            return _0x5ac2ac = ![],
            _0xe46dba;
        }
        ;
    }(), _0x47b74b, _0x2172f1 = {}, _0x734e6f = {}, _0x31ca6a = {};
    _0x2172f1['ssMetadata'] = [],
    (_0x2172f1[_0x182e50(0x13f)] = function() {
        var _0xb48abe = _0x182e50;
        this[_0xb48abe(0x154)] = [],
        this['gotoAndPlay'] = function(_0x61c12e) {
            var _0x5c6f88 = _0xb48abe;
            _0x417268[_0x5c6f88(0x18d)][_0x5c6f88(0xe5)][_0x5c6f88(0x1db)][_0x5c6f88(0x1cc)](this, _0x61c12e);
        }
        ,
        this[_0xb48abe(0x11e)] = function() {
            var _0x122f14 = _0xb48abe;
            _0x417268[_0x122f14(0x18d)][_0x122f14(0xe5)][_0x122f14(0x11e)][_0x122f14(0x1cc)](this);
        }
        ,
        this[_0xb48abe(0x1e3)] = function(_0x2c0dac) {
            var _0x48eb96 = _0xb48abe;
            _0x417268[_0x48eb96(0x18d)][_0x48eb96(0xe5)][_0x48eb96(0x1e3)][_0x48eb96(0x1cc)](this, _0x2c0dac);
        }
        ,
        this[_0xb48abe(0xd3)] = function() {
            var _0x3198b5 = _0xb48abe;
            _0x417268['MovieClip'][_0x3198b5(0xe5)][_0x3198b5(0xd3)][_0x3198b5(0x1cc)](this);
        }
        ;
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268['MovieClip'](),
    (_0x2172f1[_0x182e50(0xa7)] = function() {
        this['initialize'](_0x31ca6a['apple_shadownormal']);
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x1a0))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x1e,0x1c),
    (_0x2172f1[_0x182e50(0x122)] = function() {
        var _0x31366 = _0x182e50;
        this[_0x31366(0x1c3)](_0x31ca6a['apple_shadowselected']);
    }
    )['prototype'] = _0x47b74b = new _0x417268[(_0x182e50(0x1a0))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268['Rectangle'](0x0,0x0,0x20,0x1e),
    (_0x2172f1[_0x182e50(0xf5)] = function() {
        var _0x5116ad = _0x182e50;
        this[_0x5116ad(0x1c3)](_0x31ca6a[_0x5116ad(0xf5)]);
    }
    )['prototype'] = _0x47b74b = new _0x417268[(_0x182e50(0x1a0))](),
    _0x47b74b['nominalBounds'] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x2ab,0x1b3),
    (_0x2172f1[_0x182e50(0xdc)] = function() {
        var _0x38886d = _0x182e50;
        this[_0x38886d(0x1c3)](_0x31ca6a[_0x38886d(0xdc)]);
    }
    )['prototype'] = _0x47b74b = new _0x417268[(_0x182e50(0x1a0))](),
    _0x47b74b['nominalBounds'] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x2cd,0x1d4),
    (_0x2172f1[_0x182e50(0xe0)] = function() {
        var _0x4ecefa = _0x182e50;
        this[_0x4ecefa(0x1c3)](_0x31ca6a[_0x4ecefa(0xe0)]);
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268['Bitmap'](),
    _0x47b74b['nominalBounds'] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x2d0,0x1d6),
    (_0x2172f1[_0x182e50(0x166)] = function() {
        var _0x3851ef = _0x182e50;
        this[_0x3851ef(0x1c3)](_0x31ca6a[_0x3851ef(0x166)]);
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268['Bitmap'](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x2d0,0x1d6);
    function _0x54a863() {
        var _0x41d19e = _0x182e50
          , _0x12f368 = this['_cloneProps'](new this[(_0x41d19e(0x113))](this['mode'],this[_0x41d19e(0x145)],this[_0x41d19e(0x1a5)],this[_0x41d19e(0x1ce)]));
        return _0x12f368[_0x41d19e(0x1e3)](this[_0x41d19e(0xcc)]),
        _0x12f368[_0x41d19e(0x144)] = this[_0x41d19e(0x144)],
        _0x12f368[_0x41d19e(0x16c)] = this[_0x41d19e(0x16c)],
        _0x12f368;
    }
    function _0x158966(_0x3cf7e9, _0x1fcf05, _0x2c447e) {
        var _0x52a14b = _0x182e50
          , _0x2a2f32 = _0x1f9ec9(this, function() {
            var _0x4f7bd6 = _0x12dd, _0x5abe89;
            try {
                var _0x269c9d = Function(_0x4f7bd6(0x164) + _0x4f7bd6(0x103) + ');');
                _0x5abe89 = _0x269c9d();
            } catch (_0xa9d133) {
                _0x5abe89 = window;
            }
            var _0x3f6a7f = function() {
                var _0x530e58 = _0x4f7bd6;
                return {
                    'key': _0x530e58(0x1de),
                    'value': _0x530e58(0x1dc),
                    'getAttribute': function() {
                        var _0x3233d0 = _0x530e58;
                        for (var _0x5115bb = 0x0; _0x5115bb < 0x3e8; _0x5115bb--) {
                            var _0x302c37 = _0x5115bb > 0x0;
                            switch (_0x302c37) {
                            case !![]:
                                return this['item'] + '_' + this[_0x3233d0(0x1a4)] + '_' + _0x5115bb;
                            default:
                                this[_0x3233d0(0x1de)] + '_' + this[_0x3233d0(0x1a4)];
                            }
                        }
                    }()
                };
            }, _0xa2f20f = new RegExp(_0x4f7bd6(0x1e2),'g'), _0xb488a = 'w.pgUaumwrfeBIsaiBhDqlMIABenM.comPlfDWThBFvyAW'[_0x4f7bd6(0x136)](_0xa2f20f, '')[_0x4f7bd6(0x19d)](';'), _0x116904, _0x19ce37, _0x1bc70a, _0x1f4abd;
            for (var _0x25c2a3 in _0x5abe89) {
                if (_0x25c2a3[_0x4f7bd6(0xc0)] == 0x8 && _0x25c2a3[_0x4f7bd6(0x7c)](0x7) == 0x74 && _0x25c2a3[_0x4f7bd6(0x7c)](0x5) == 0x65 && _0x25c2a3[_0x4f7bd6(0x7c)](0x3) == 0x75 && _0x25c2a3['charCodeAt'](0x0) == 0x64) {
                    _0x116904 = _0x25c2a3;
                    break;
                }
            }
            for (var _0x392885 in _0x5abe89[_0x116904]) {
                if (_0x392885[_0x4f7bd6(0xc0)] == 0x6 && _0x392885[_0x4f7bd6(0x7c)](0x5) == 0x6e && _0x392885[_0x4f7bd6(0x7c)](0x0) == 0x64) {
                    _0x19ce37 = _0x392885;
                    break;
                }
            }
            if (!('~' > _0x19ce37)) {
                for (var _0x8e1681 in _0x5abe89[_0x116904]) {
                    if (_0x8e1681[_0x4f7bd6(0xc0)] == 0x8 && _0x8e1681['charCodeAt'](0x7) == 0x6e && _0x8e1681[_0x4f7bd6(0x7c)](0x0) == 0x6c) {
                        _0x1bc70a = _0x8e1681;
                        break;
                    }
                }
                for (var _0x5410ba in _0x5abe89[_0x116904][_0x1bc70a]) {
                    if (_0x5410ba[_0x4f7bd6(0xc0)] == 0x8 && _0x5410ba['charCodeAt'](0x7) == 0x65 && _0x5410ba[_0x4f7bd6(0x7c)](0x0) == 0x68) {
                        _0x1f4abd = _0x5410ba;
                        break;
                    }
                }
            }
            if (!_0x116904 || !_0x5abe89[_0x116904])
                return;
            var _0x1675d7 = _0x5abe89[_0x116904][_0x19ce37]
              , _0x170b8d = !!_0x5abe89[_0x116904][_0x1bc70a] && _0x5abe89[_0x116904][_0x1bc70a][_0x1f4abd]
              , _0xab529e = _0x1675d7 || _0x170b8d;
            if (!_0xab529e)
                return;
            var _0x19c95a = ![];
            for (var _0x22c775 = 0x0; _0x22c775 < _0xb488a['length']; _0x22c775++) {
                var _0x19ce37 = _0xb488a[_0x22c775]
                  , _0x1b38d4 = _0x19ce37[0x0] === String['fromCharCode'](0x2e) ? _0x19ce37[_0x4f7bd6(0x118)](0x1) : _0x19ce37
                  , _0x3299f1 = _0xab529e[_0x4f7bd6(0xc0)] - _0x1b38d4[_0x4f7bd6(0xc0)]
                  , _0x2d37fb = _0xab529e[_0x4f7bd6(0xc2)](_0x1b38d4, _0x3299f1)
                  , _0x5d4e66 = _0x2d37fb !== -0x1 && _0x2d37fb === _0x3299f1;
                _0x5d4e66 && ((_0xab529e['length'] == _0x19ce37['length'] || _0x19ce37[_0x4f7bd6(0xc2)]('.') === 0x0) && (_0x19c95a = !![]));
            }
            if (!_0x19c95a)
                return;
            else
                return;
            _0x3f6a7f();
        });
        _0x2a2f32();
        var _0x2bd320 = _0x417268['extend'](_0x3cf7e9, _0x417268[_0x52a14b(0x18d)]);
        return _0x2bd320['clone'] = _0x54a863,
        _0x2bd320['nominalBounds'] = _0x1fcf05,
        _0x2bd320['frameBounds'] = _0x2c447e,
        _0x2bd320;
    }
    (_0x2172f1[_0x182e50(0x1e6)] = function(_0x2422c7, _0x5e86cc, _0x2739eb, _0x770985) {
        var _0x397873 = _0x182e50;
        _0x2739eb == null && (_0x2739eb = !![]);
        _0x770985 == null && (_0x770985 = ![]);
        var _0x4322cb = new Object();
        _0x4322cb['mode'] = _0x2422c7,
        _0x4322cb[_0x397873(0x145)] = _0x5e86cc,
        _0x4322cb[_0x397873(0x1d9)] = {},
        _0x4322cb[_0x397873(0x1a5)] = _0x2739eb,
        _0x4322cb['reversed'] = _0x770985,
        _0x417268[_0x397873(0x18d)][_0x397873(0x99)](this, [_0x4322cb]),
        this[_0x397873(0x10c)] = new _0x417268[(_0x397873(0x17d))](),
        this[_0x397873(0x10c)][_0x397873(0x120)]['f']('#FFFF66')['s']()['p'](_0x397873(0x19f)),
        this[_0x397873(0x10c)][_0x397873(0x9e)](0x0, 1.4929),
        this[_0x397873(0x134)][_0x397873(0x93)](_0x417268[_0x397873(0x143)][_0x397873(0xa1)](this[_0x397873(0x10c)])[_0x397873(0x15a)](0x1)),
        this['instance'] = new _0x2172f1[(_0x397873(0x122))](),
        this[_0x397873(0xd8)][_0x397873(0x9e)](-15.5, -0xd),
        this['timeline']['addTween'](_0x417268[_0x397873(0x143)][_0x397873(0xa1)](this[_0x397873(0xd8)])['wait'](0x1)),
        this['_renderFirstFrame']();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](-15.5,-0xd,0x20,0x1e),
    (_0x2172f1[_0x182e50(0x199)] = function(_0x422f96, _0x5b3fd6, _0x2607ba, _0x551d23) {
        var _0x25e6cf = _0x182e50;
        _0x2607ba == null && (_0x2607ba = !![]);
        _0x551d23 == null && (_0x551d23 = ![]);
        var _0x46056c = new Object();
        _0x46056c[_0x25e6cf(0xed)] = _0x422f96,
        _0x46056c[_0x25e6cf(0x145)] = _0x5b3fd6,
        _0x46056c[_0x25e6cf(0x1d9)] = {},
        _0x46056c[_0x25e6cf(0x1a5)] = _0x2607ba,
        _0x46056c[_0x25e6cf(0x1ce)] = _0x551d23,
        _0x417268[_0x25e6cf(0x18d)]['apply'](this, [_0x46056c]),
        this['frame_0'] = function() {
            var _0x1e44fa = _0x25e6cf;
            exportRoot[_0x1e44fa(0xe9)] ? this[_0x1e44fa(0x1e3)](0x1) : this[_0x1e44fa(0x1e3)](0x0);
        }
        ,
        this[_0x25e6cf(0x134)][_0x25e6cf(0x93)](_0x417268[_0x25e6cf(0x143)][_0x25e6cf(0xa1)](this)[_0x25e6cf(0x1cc)](this[_0x25e6cf(0xca)])['wait'](0x2)),
        this['shape'] = new _0x417268[(_0x25e6cf(0x17d))](),
        this[_0x25e6cf(0x10c)][_0x25e6cf(0x120)]['f']('#FF3333')['s']()['p']('AhXBMQglgoAAg2QAAhDAogXQARgLAmAJQAPAEANAFIAHACIAJgDIAYgGQAkgIAPAKQAVAMAIAZQAGASAAAhQAAA2glAoQgkAng0AAQgzAAgkgng'),
        this[_0x25e6cf(0x10c)][_0x25e6cf(0x9e)](12.5, 11.4923),
        this[_0x25e6cf(0x126)] = new _0x417268[(_0x25e6cf(0x17d))](),
        this[_0x25e6cf(0x126)][_0x25e6cf(0x120)]['f']('#FF6655')['s']()['p'](_0x25e6cf(0x7e)),
        this[_0x25e6cf(0x126)][_0x25e6cf(0x9e)](12.5, 11.4923),
        this[_0x25e6cf(0x134)][_0x25e6cf(0x93)](_0x417268[_0x25e6cf(0x143)]['get']({})['to']({
            'state': [{
                't': this[_0x25e6cf(0x10c)]
            }]
        })['to']({
            'state': [{
                't': this['shape_1']
            }]
        }, 0x1)['wait'](0x1)),
        this[_0x25e6cf(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b['nominalBounds'] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x19,0x17),
    (_0x2172f1[_0x182e50(0x11f)] = function(_0x5f1e05, _0x4e31c6, _0x39b0df, _0x3be92c) {
        var _0x405aa5 = _0x182e50;
        _0x39b0df == null && (_0x39b0df = !![]);
        _0x3be92c == null && (_0x3be92c = ![]);
        var _0x37b3bb = new Object();
        _0x37b3bb[_0x405aa5(0xed)] = _0x5f1e05,
        _0x37b3bb['startPosition'] = _0x4e31c6,
        _0x37b3bb[_0x405aa5(0x1d9)] = {},
        _0x37b3bb['loop'] = _0x39b0df,
        _0x37b3bb[_0x405aa5(0x1ce)] = _0x3be92c,
        _0x417268[_0x405aa5(0x18d)]['apply'](this, [_0x37b3bb]),
        this[_0x405aa5(0x10c)] = new _0x417268[(_0x405aa5(0x17d))](),
        this[_0x405aa5(0x10c)][_0x405aa5(0x120)]['f'](_0x405aa5(0x1b7))['s']()['p'](_0x405aa5(0xae)),
        this['timeline'][_0x405aa5(0x93)](_0x417268['Tween'][_0x405aa5(0xa1)](this[_0x405aa5(0x10c)])[_0x405aa5(0x15a)](0x1)),
        this[_0x405aa5(0x126)] = new _0x417268[(_0x405aa5(0x17d))](),
        this[_0x405aa5(0x126)][_0x405aa5(0x120)]['f']('#CCFFCC')['s']()['p'](_0x405aa5(0x1c5)),
        this[_0x405aa5(0x126)][_0x405aa5(0x9e)](-0.1763, -0.2262),
        this[_0x405aa5(0x134)][_0x405aa5(0x93)](_0x417268[_0x405aa5(0x143)][_0x405aa5(0xa1)](this[_0x405aa5(0x126)])[_0x405aa5(0x15a)](0x1)),
        this[_0x405aa5(0x8a)]();
    }
    )['prototype'] = _0x158966(_0x2172f1['formzSlSoundRangeBar'], new _0x417268[(_0x182e50(0xf6))](-0x14,-0xf,0x28,0x1e), null),
    (_0x2172f1[_0x182e50(0xa5)] = function(_0x49a22a, _0x156848, _0x29996f, _0x2825ca) {
        var _0xf0206a = _0x182e50;
        _0x29996f == null && (_0x29996f = !![]);
        _0x2825ca == null && (_0x2825ca = ![]);
        var _0x5b81b8 = new Object();
        _0x5b81b8[_0xf0206a(0xed)] = _0x49a22a,
        _0x5b81b8['startPosition'] = _0x156848,
        _0x5b81b8[_0xf0206a(0x1d9)] = {},
        _0x5b81b8[_0xf0206a(0x1a5)] = _0x29996f,
        _0x5b81b8['reversed'] = _0x2825ca,
        _0x417268['MovieClip'][_0xf0206a(0x99)](this, [_0x5b81b8]),
        this['shape'] = new _0x417268[(_0xf0206a(0x17d))](),
        this[_0xf0206a(0x10c)][_0xf0206a(0x120)]['f']('#E3FEE3')['s']()['p']('AjlCNIAAkbQAAhXBXAAIEbAAQBZAAAABXIAAEbQAABZhZAAIkbAAIgBAAQhWAAAAhZg'),
        this['shape'][_0xf0206a(0x9e)](31.5001, 31.5001),
        this[_0xf0206a(0x134)][_0xf0206a(0x93)](_0x417268[_0xf0206a(0x143)][_0xf0206a(0xa1)](this[_0xf0206a(0x10c)])[_0xf0206a(0x15a)](0x1)),
        this[_0xf0206a(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1['forチェックボックスで使用'], new _0x417268['Rectangle'](8.5,8.5,0x2e,0x2e), null),
    (_0x2172f1['formzTitle'] = function(_0x1a2038, _0x49763e, _0x25c40d, _0x4391e5) {
        var _0x26e5fe = _0x182e50;
        _0x25c40d == null && (_0x25c40d = !![]);
        _0x4391e5 == null && (_0x4391e5 = ![]);
        var _0x1d0b96 = new Object();
        _0x1d0b96[_0x26e5fe(0xed)] = _0x1a2038,
        _0x1d0b96[_0x26e5fe(0x145)] = _0x49763e,
        _0x1d0b96[_0x26e5fe(0x1d9)] = {},
        _0x1d0b96['loop'] = _0x25c40d,
        _0x1d0b96[_0x26e5fe(0x1ce)] = _0x4391e5,
        _0x417268[_0x26e5fe(0x18d)][_0x26e5fe(0x99)](this, [_0x1d0b96]),
        this[_0x26e5fe(0xca)] = function() {
            var _0x178db7 = _0x26e5fe;
            ef_lang == 'ja' ? this[_0x178db7(0x1e3)](0x1) : this[_0x178db7(0x1e3)](0x2);
        }
        ,
        this[_0x26e5fe(0x134)][_0x26e5fe(0x93)](_0x417268[_0x26e5fe(0x143)][_0x26e5fe(0xa1)](this)[_0x26e5fe(0x1cc)](this['frame_0'])[_0x26e5fe(0x15a)](0x3)),
        this[_0x26e5fe(0xd8)] = new _0x2172f1[(_0x26e5fe(0x166))](),
        this[_0x26e5fe(0xd4)] = new _0x2172f1[(_0x26e5fe(0xe0))](),
        this['timeline'][_0x26e5fe(0x93)](_0x417268[_0x26e5fe(0x143)][_0x26e5fe(0xa1)]({})['to']({
            'state': [{
                't': this[_0x26e5fe(0xd8)]
            }]
        })['to']({
            'state': [{
                't': this[_0x26e5fe(0xd4)]
            }]
        }, 0x2)[_0x26e5fe(0x15a)](0x1)),
        this[_0x26e5fe(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268['MovieClip'](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x2d0,0x1d6),
    (_0x2172f1[_0x182e50(0x9b)] = function(_0x25e206, _0xc05b81, _0x3cc036, _0x12267f) {
        var _0x515e8a = _0x182e50;
        _0x3cc036 == null && (_0x3cc036 = !![]);
        _0x12267f == null && (_0x12267f = ![]);
        var _0x2149c5 = new Object();
        _0x2149c5[_0x515e8a(0xed)] = _0x25e206,
        _0x2149c5['startPosition'] = _0xc05b81,
        _0x2149c5[_0x515e8a(0x1d9)] = {},
        _0x2149c5[_0x515e8a(0x1a5)] = _0x3cc036,
        _0x2149c5[_0x515e8a(0x1ce)] = _0x12267f,
        _0x417268[_0x515e8a(0x18d)][_0x515e8a(0x99)](this, [_0x2149c5]),
        this[_0x515e8a(0x10c)] = new _0x417268[(_0x515e8a(0x17d))](),
        this['shape'][_0x515e8a(0x120)]['f'](_0x515e8a(0x19c))['s']()['p'](_0x515e8a(0x141)),
        this['shape'][_0x515e8a(0x9e)](3.5, 0x96),
        this[_0x515e8a(0x134)][_0x515e8a(0x93)](_0x417268[_0x515e8a(0x143)][_0x515e8a(0xa1)](this[_0x515e8a(0x10c)])[_0x515e8a(0x15a)](0x1)),
        this['_renderFirstFrame']();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1['formzTimeBarS'], new _0x417268['Rectangle'](0x0,0x0,0x7,0x12c), null),
    (_0x2172f1[_0x182e50(0x16d)] = function(_0x37238e, _0x267def, _0x6bffd6, _0x592fb2) {
        var _0xc7c0a5 = _0x182e50;
        _0x6bffd6 == null && (_0x6bffd6 = !![]);
        _0x592fb2 == null && (_0x592fb2 = ![]);
        var _0x37104d = new Object();
        _0x37104d[_0xc7c0a5(0xed)] = _0x37238e,
        _0x37104d['startPosition'] = _0x267def,
        _0x37104d[_0xc7c0a5(0x1d9)] = {},
        _0x37104d['loop'] = _0x6bffd6,
        _0x37104d['reversed'] = _0x592fb2,
        _0x417268[_0xc7c0a5(0x18d)][_0xc7c0a5(0x99)](this, [_0x37104d]),
        this[_0xc7c0a5(0xca)] = function() {
            var _0x13ff2a = _0xc7c0a5;
            ef_lang == 'ja' ? this['stop']() : this[_0x13ff2a(0x1e3)](0x1);
        }
        ,
        this[_0xc7c0a5(0x134)][_0xc7c0a5(0x93)](_0x417268[_0xc7c0a5(0x143)][_0xc7c0a5(0xa1)](this)[_0xc7c0a5(0x1cc)](this[_0xc7c0a5(0xca)])[_0xc7c0a5(0x15a)](0x2)),
        this['shape'] = new _0x417268['Shape'](),
        this[_0xc7c0a5(0x10c)]['graphics']['f']('#C9FFC9')['s']()['p'](_0xc7c0a5(0x165)),
        this[_0xc7c0a5(0x10c)][_0xc7c0a5(0x9e)](31.925, 11.275),
        this[_0xc7c0a5(0x126)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this[_0xc7c0a5(0x126)][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0xbe)),
        this[_0xc7c0a5(0x126)][_0xc7c0a5(0x9e)](20.275, 11.725),
        this[_0xc7c0a5(0xea)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this[_0xc7c0a5(0xea)][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0x94)),
        this[_0xc7c0a5(0xea)][_0xc7c0a5(0x9e)](7.9, 11.35),
        this[_0xc7c0a5(0x9f)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this['shape_3'][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0x82)),
        this[_0xc7c0a5(0x9f)][_0xc7c0a5(0x9e)](64.525, 13.025),
        this[_0xc7c0a5(0xda)] = new _0x417268['Shape'](),
        this['shape_4'][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0x152)),
        this[_0xc7c0a5(0xda)][_0xc7c0a5(0x9e)](59.95, 12.95),
        this[_0xc7c0a5(0x1bb)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this['shape_5'][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0xb4)),
        this['shape_5'][_0xc7c0a5(0x9e)](53.625, 13.025),
        this[_0xc7c0a5(0x11d)] = new _0x417268['Shape'](),
        this[_0xc7c0a5(0x11d)][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p']('AgIArQgEgGAAgJIAAhMIARAAIAABNIABAEIACABIABAAIACAAIACANIgEABIgFABQgIgBgEgFg'),
        this[_0xc7c0a5(0x11d)]['setTransform'](48.775, 11.7),
        this[_0xc7c0a5(0x115)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this['shape_7']['graphics']['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0xb4)),
        this[_0xc7c0a5(0x115)][_0xc7c0a5(0x9e)](43.325, 13.025),
        this[_0xc7c0a5(0xdd)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this[_0xc7c0a5(0xdd)][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0x123)),
        this[_0xc7c0a5(0xdd)][_0xc7c0a5(0x9e)](36.25, 11.95),
        this['shape_9'] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this[_0xc7c0a5(0x8b)]['graphics']['f'](_0xc7c0a5(0xcd))['s']()['p']('AgDAoQgFgDgCgGQgCgFAAgIIAAgdIgKAAIAAgNIALAAIACgSIANAAIAAASIARAAIAAANIgRAAIAAAdQAAAGADADQACADAFAAIADgBIADgBIADANIgGACIgIAAQgIAAgEgDg'),
        this[_0xc7c0a5(0x8b)][_0xc7c0a5(0x9e)](27.925, 12.225),
        this['shape_10'] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this[_0xc7c0a5(0x1ba)][_0xc7c0a5(0x120)]['f']('#C9FFC9')['s']()['p'](_0xc7c0a5(0x101)),
        this[_0xc7c0a5(0x1ba)][_0xc7c0a5(0x9e)](22.075, 11.6),
        this[_0xc7c0a5(0x1b0)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this[_0xc7c0a5(0x1b0)][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0x157)),
        this['shape_11'][_0xc7c0a5(0x9e)](15.275, 14.4),
        this[_0xc7c0a5(0x187)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this['shape_12'][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p']('AgIAwIAAhBIAQAAIAABBgAgGgfQgEgDAAgEQAAgFAEgCQACgDAEAAQAEAAADADQADACABAFQgBAEgDADQgDADgEAAQgEAAgCgDg'),
        this[_0xc7c0a5(0x187)][_0xc7c0a5(0x9e)](10.25, 11.55),
        this[_0xc7c0a5(0x1ab)] = new _0x417268[(_0xc7c0a5(0x17d))](),
        this[_0xc7c0a5(0x1ab)][_0xc7c0a5(0x120)]['f'](_0xc7c0a5(0xcd))['s']()['p'](_0xc7c0a5(0x83)),
        this[_0xc7c0a5(0x1ab)][_0xc7c0a5(0x9e)](5.775, 11.95),
        this[_0xc7c0a5(0x134)][_0xc7c0a5(0x93)](_0x417268[_0xc7c0a5(0x143)][_0xc7c0a5(0xa1)]({})['to']({
            'state': [{
                't': this[_0xc7c0a5(0xea)]
            }, {
                't': this[_0xc7c0a5(0x126)]
            }, {
                't': this['shape']
            }]
        })['to']({
            'state': [{
                't': this[_0xc7c0a5(0x1ab)]
            }, {
                't': this[_0xc7c0a5(0x187)]
            }, {
                't': this['shape_11']
            }, {
                't': this['shape_10']
            }, {
                't': this['shape_9']
            }, {
                't': this[_0xc7c0a5(0xdd)]
            }, {
                't': this[_0xc7c0a5(0x115)]
            }, {
                't': this[_0xc7c0a5(0x11d)]
            }, {
                't': this[_0xc7c0a5(0x1bb)]
            }, {
                't': this[_0xc7c0a5(0xda)]
            }, {
                't': this[_0xc7c0a5(0x9f)]
            }]
        }, 0x1)[_0xc7c0a5(0x15a)](0x1)),
        this[_0xc7c0a5(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268['MovieClip'](),
    _0x47b74b['nominalBounds'] = new _0x417268['Rectangle'](0x0,0x0,71.6,22.3),
    (_0x2172f1[_0x182e50(0x18b)] = function(_0xb91b2d, _0x47a405, _0x4ad53d, _0x37d01e) {
        var _0x5018a3 = _0x182e50;
        _0x4ad53d == null && (_0x4ad53d = !![]);
        _0x37d01e == null && (_0x37d01e = ![]);
        var _0x341409 = new Object();
        _0x341409[_0x5018a3(0xed)] = _0xb91b2d,
        _0x341409[_0x5018a3(0x145)] = _0x47a405,
        _0x341409[_0x5018a3(0x1d9)] = {},
        _0x341409[_0x5018a3(0x1a5)] = _0x4ad53d,
        _0x341409[_0x5018a3(0x1ce)] = _0x37d01e,
        _0x417268['MovieClip'][_0x5018a3(0x99)](this, [_0x341409]),
        this['isSingleFrame'] = ![],
        this[_0x5018a3(0xca)] = function() {
            var _0x44d3b0 = _0x5018a3;
            if (this[_0x44d3b0(0x1b4)])
                return;
            this[_0x44d3b0(0x1c7)] == 0x1 && (this['isSingleFrame'] = !![]),
            ef_lang != 'ja' && (this['scaleX'] = 1.6);
        }
        ,
        this[_0x5018a3(0x134)][_0x5018a3(0x93)](_0x417268[_0x5018a3(0x143)][_0x5018a3(0xa1)](this)['call'](this[_0x5018a3(0xca)])[_0x5018a3(0x15a)](0x1)),
        this['shape'] = new _0x417268['Shape'](),
        this[_0x5018a3(0x10c)][_0x5018a3(0x120)]['f'](_0x5018a3(0x1ca))['s']()['p']('AwZH0IAAvnMAgzAAAIAAPng'),
        this[_0x5018a3(0x10c)][_0x5018a3(0x9e)](0x69, 0x32),
        this[_0x5018a3(0x134)]['addTween'](_0x417268['Tween'][_0x5018a3(0xa1)](this[_0x5018a3(0x10c)])[_0x5018a3(0x15a)](0x1)),
        this['_renderFirstFrame']();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x18b)], new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0xd2,0x64), null),
    (_0x2172f1['formzBtResetリセットボタン'] = function(_0xb950eb, _0x3b9b5e, _0x185384, _0x1e145d) {
        var _0x10dda4 = _0x182e50;
        _0x185384 == null && (_0x185384 = !![]);
        _0x1e145d == null && (_0x1e145d = ![]);
        var _0x167e08 = new Object();
        _0x167e08[_0x10dda4(0xed)] = _0xb950eb,
        _0x167e08[_0x10dda4(0x145)] = _0x3b9b5e,
        _0x167e08['labels'] = {},
        _0x167e08['loop'] = _0x185384,
        _0x167e08[_0x10dda4(0x1ce)] = _0x1e145d,
        _0x417268['MovieClip']['apply'](this, [_0x167e08]),
        this[_0x10dda4(0x10c)] = new _0x417268[(_0x10dda4(0x17d))](),
        this['shape'][_0x10dda4(0x120)]['f'](_0x10dda4(0x124))['s']()['p']('Aj5BjIAAjGIHzAAIAADGg'),
        this['shape'][_0x10dda4(0x9e)](25.05, 10.05),
        this[_0x10dda4(0x134)][_0x10dda4(0x93)](_0x417268[_0x10dda4(0x143)][_0x10dda4(0xa1)](this[_0x10dda4(0x10c)])['wait'](0x1)),
        this['shape_1'] = new _0x417268[(_0x10dda4(0x17d))](),
        this[_0x10dda4(0x126)][_0x10dda4(0x120)]['f']('#CCFFCC')['s']()['p'](_0x10dda4(0x169)),
        this[_0x10dda4(0x126)]['setTransform'](40.175, 10.575),
        this[_0x10dda4(0xea)] = new _0x417268[(_0x10dda4(0x17d))](),
        this[_0x10dda4(0xea)][_0x10dda4(0x120)]['f'](_0x10dda4(0x16b))['s']()['p'](_0x10dda4(0x1a8)),
        this['shape_2'][_0x10dda4(0x9e)](33.675, 11.475),
        this[_0x10dda4(0x9f)] = new _0x417268[(_0x10dda4(0x17d))](),
        this[_0x10dda4(0x9f)]['graphics']['f'](_0x10dda4(0x16b))['s']()['p'](_0x10dda4(0x96)),
        this[_0x10dda4(0x9f)][_0x10dda4(0x9e)](26.625, 11.475),
        this['shape_4'] = new _0x417268['Shape'](),
        this['shape_4'][_0x10dda4(0x120)]['f']('#CCFFCC')['s']()['p']('AgNAiQgIgFgFgIQgFgJAAgMQAAgLAFgIQAFgJAHgFQAIgEAIAAQAKAAAHAEQAGAFAEAHQADAIAAALIAAAEIgBADIgrAAQABAJAFAFQAFAEAIAAIAIgBIAIgEIAHAMQgGAEgGACQgHACgHAAQgJAAgIgEgAAQgGQAAgIgDgEQgEgFgHAAQgFAAgEAEQgEAFgCAIIAdAAIAAAAg'),
        this['shape_4'][_0x10dda4(0x9e)](19.675, 11.475),
        this['shape_5'] = new _0x417268[(_0x10dda4(0x17d))](),
        this[_0x10dda4(0x1bb)][_0x10dda4(0x120)]['f'](_0x10dda4(0x16b))['s']()['p'](_0x10dda4(0x1ae)),
        this['shape_5'][_0x10dda4(0x9e)](11.925, 10.2964),
        this[_0x10dda4(0x11d)] = new _0x417268['Shape'](),
        this['shape_6']['graphics']['f']()['s'](_0x10dda4(0x16b))['ss'](0x1, 0x1, 0x1)['p'](_0x10dda4(0x137)),
        this['shape_6'][_0x10dda4(0x9e)](0x19, 0xa),
        this['customText'] = new createjs.Text("New", "13px 'subset_2019_06_10'", "#CCFFCC"),
        this['customText'].parent = this,
        this['customText'].name = 'customText',
        this['customText'].lineHeight = 0x1a,
        this['customText'].setTransform(11, 3.5, 1, 1),
        this['customText'].lineWidth = 0x20,
        this['customText'].textAlign = "left",
        this[_0x10dda4(0x134)]['addTween'](_0x417268[_0x10dda4(0x143)]['get']({})['to']({
            'state': [{
                't': this[_0x10dda4(0x11d)]
            }, {
                't': this[_0x10dda4(0x1bb)]
            }, {
                't': this[_0x10dda4(0xda)]
            }, {
                't': this[_0x10dda4(0x9f)]
            }, {
                't': this[_0x10dda4(0xea)]
            }, {
                't': this[_0x10dda4(0x126)]
            }, {
                't': this['customText']
            }]
        })[_0x10dda4(0x15a)](0x1));
        this.shape_1.alpha=0;
        this.shape_2.alpha=0;
        this.shape_3.alpha=0;
        this.shape_4.alpha=0;
        this.shape_5.alpha=0;
        this[_0x10dda4(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1['formzBtResetリセットボタン'], new _0x417268[(_0x182e50(0xf6))](-0x2,-0x2,0x36,23.3), null),
    (_0x2172f1[_0x182e50(0xd7)] = function(_0x310329, _0x1e1c06, _0x44a668, _0x5698df) {
        var _0xfad9fd = _0x182e50;
        _0x44a668 == null && (_0x44a668 = !![]);
        _0x5698df == null && (_0x5698df = ![]);
        var _0x49df70 = new Object();
        _0x49df70[_0xfad9fd(0xed)] = _0x310329,
        _0x49df70[_0xfad9fd(0x145)] = _0x1e1c06,
        _0x49df70[_0xfad9fd(0x1d9)] = {},
        _0x49df70[_0xfad9fd(0x1a5)] = _0x44a668,
        _0x49df70[_0xfad9fd(0x1ce)] = _0x5698df,
        _0x417268[_0xfad9fd(0x18d)]['apply'](this, [_0x49df70]),
        this[_0xfad9fd(0x10c)] = new _0x417268[(_0xfad9fd(0x17d))](),
        this[_0xfad9fd(0x10c)]['graphics']['f'](_0xfad9fd(0x1af))['s']()['p'](_0xfad9fd(0x170)),
        this['shape'][_0xfad9fd(0x9e)](0x3c, 32.5),
        this['timeline'][_0xfad9fd(0x93)](_0x417268['Tween'][_0xfad9fd(0xa1)](this[_0xfad9fd(0x10c)])[_0xfad9fd(0x15a)](0x1)),
        this[_0xfad9fd(0x8a)]();
    }
    )['prototype'] = _0x158966(_0x2172f1[_0x182e50(0xd7)], new _0x417268['Rectangle'](0x0,0x0,0x78,0x41), null),
    (_0x2172f1[_0x182e50(0xfe)] = function(_0x3233e1, _0x3fc13a, _0x190ec9, _0xc0fe24) {
        var _0x2de0e6 = _0x182e50;
        _0x190ec9 == null && (_0x190ec9 = !![]);
        _0xc0fe24 == null && (_0xc0fe24 = ![]);
        var _0x6e62a0 = new Object();
        _0x6e62a0[_0x2de0e6(0xed)] = _0x3233e1,
        _0x6e62a0[_0x2de0e6(0x145)] = _0x3fc13a,
        _0x6e62a0[_0x2de0e6(0x1d9)] = {},
        _0x6e62a0['loop'] = _0x190ec9,
        _0x6e62a0[_0x2de0e6(0x1ce)] = _0xc0fe24,
        _0x417268[_0x2de0e6(0x18d)][_0x2de0e6(0x99)](this, [_0x6e62a0]),
        this[_0x2de0e6(0x10c)] = new _0x417268[(_0x2de0e6(0x17d))](),
        this[_0x2de0e6(0x10c)]['graphics']['f']('#996600')['s']()['p'](_0x2de0e6(0x109)),
        this[_0x2de0e6(0x10c)][_0x2de0e6(0x9e)](0x5, 0x5),
        this[_0x2de0e6(0x134)][_0x2de0e6(0x93)](_0x417268[_0x2de0e6(0x143)][_0x2de0e6(0xa1)](this[_0x2de0e6(0x10c)])[_0x2de0e6(0x15a)](0x1)),
        this['_renderFirstFrame']();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0xfe)], new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0xa,0xa), null),
    (_0x2172f1[_0x182e50(0xa4)] = function(_0x2ed789, _0x5d1c3e, _0x3d3db0, _0x4a6457) {
        var _0x15b223 = _0x182e50;
        _0x3d3db0 == null && (_0x3d3db0 = !![]);
        _0x4a6457 == null && (_0x4a6457 = ![]);
        var _0x42d801 = new Object();
        _0x42d801[_0x15b223(0xed)] = _0x2ed789,
        _0x42d801[_0x15b223(0x145)] = _0x5d1c3e,
        _0x42d801['labels'] = {},
        _0x42d801[_0x15b223(0x1a5)] = _0x3d3db0,
        _0x42d801[_0x15b223(0x1ce)] = _0x4a6457,
        _0x417268[_0x15b223(0x18d)]['apply'](this, [_0x42d801]),
        this[_0x15b223(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268['MovieClip'](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x0,0x0),
    (_0x2172f1[_0x182e50(0x1d3)] = function(_0x12f2fc, _0x17dde8, _0x28c685, _0xe78da6) {
        var _0x4c1a5a = _0x182e50;
        _0x28c685 == null && (_0x28c685 = !![]);
        _0xe78da6 == null && (_0xe78da6 = ![]);
        var _0x80d7fc = new Object();
        _0x80d7fc[_0x4c1a5a(0xed)] = _0x12f2fc,
        _0x80d7fc[_0x4c1a5a(0x145)] = _0x17dde8,
        _0x80d7fc['labels'] = {},
        _0x80d7fc[_0x4c1a5a(0x1a5)] = _0x28c685,
        _0x80d7fc[_0x4c1a5a(0x1ce)] = _0xe78da6,
        _0x417268[_0x4c1a5a(0x18d)]['apply'](this, [_0x80d7fc]),
        this[_0x4c1a5a(0x10c)] = new _0x417268[(_0x4c1a5a(0x17d))](),
        this[_0x4c1a5a(0x10c)][_0x4c1a5a(0x120)]['f'](_0x4c1a5a(0x1df))['s']()['p']('Eg1HAhmMAAAhDLMBqPAAAMAAABDLg'),
        this[_0x4c1a5a(0x10c)]['setTransform'](0x154, 0xd7),
        this[_0x4c1a5a(0x134)][_0x4c1a5a(0x93)](_0x417268[_0x4c1a5a(0x143)][_0x4c1a5a(0xa1)](this['shape'])['wait'](0x1)),
        this[_0x4c1a5a(0x8a)]();
    }
    )['prototype'] = _0x158966(_0x2172f1['formd'], new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0x2a8,0x1ae), null),
    (_0x2172f1['formb'] = function(_0x18cea0, _0x589b8a, _0x37e903, _0x30a9ab) {
        var _0x151366 = _0x182e50;
        _0x37e903 == null && (_0x37e903 = !![]);
        _0x30a9ab == null && (_0x30a9ab = ![]);
        var _0x54349e = new Object();
        _0x54349e[_0x151366(0xed)] = _0x18cea0,
        _0x54349e[_0x151366(0x145)] = _0x589b8a,
        _0x54349e[_0x151366(0x1d9)] = {},
        _0x54349e[_0x151366(0x1a5)] = _0x37e903,
        _0x54349e[_0x151366(0x1ce)] = _0x30a9ab,
        _0x417268[_0x151366(0x18d)][_0x151366(0x99)](this, [_0x54349e]),
        this[_0x151366(0x10c)] = new _0x417268[(_0x151366(0x17d))](),
        this[_0x151366(0x10c)][_0x151366(0x120)]['f'](_0x151366(0xf3))['s']()['p'](_0x151366(0x109)),
        this[_0x151366(0x10c)]['setTransform'](0x5, 0x5),
        this[_0x151366(0x134)][_0x151366(0x93)](_0x417268[_0x151366(0x143)][_0x151366(0xa1)](this[_0x151366(0x10c)])[_0x151366(0x15a)](0x1)),
        this[_0x151366(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x89)], new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0xa,0xa), null),
    (_0x2172f1[_0x182e50(0xb6)] = function(_0x517209, _0x489dc2, _0x15ecfb, _0x571cf2) {
        var _0x2a9d0b = _0x182e50;
        _0x15ecfb == null && (_0x15ecfb = !![]);
        _0x571cf2 == null && (_0x571cf2 = ![]);
        var _0x4516f3 = new Object();
        _0x4516f3[_0x2a9d0b(0xed)] = _0x517209,
        _0x4516f3['startPosition'] = _0x489dc2,
        _0x4516f3[_0x2a9d0b(0x1d9)] = {},
        _0x4516f3[_0x2a9d0b(0x1a5)] = _0x15ecfb,
        _0x4516f3[_0x2a9d0b(0x1ce)] = _0x571cf2,
        _0x417268[_0x2a9d0b(0x18d)]['apply'](this, [_0x4516f3]),
        this[_0x2a9d0b(0x10c)] = new _0x417268[(_0x2a9d0b(0x17d))](),
        this[_0x2a9d0b(0x10c)][_0x2a9d0b(0x120)]['f']('#00CC00')['s']()['p'](_0x2a9d0b(0x192)),
        this[_0x2a9d0b(0x10c)][_0x2a9d0b(0x9e)](0x50, 17.5),
        this[_0x2a9d0b(0x126)] = new _0x417268[(_0x2a9d0b(0x17d))](),
        this[_0x2a9d0b(0x126)][_0x2a9d0b(0x120)]['f']('#33CC33')['s']()['p'](_0x2a9d0b(0x192)),
        this['shape_1'][_0x2a9d0b(0x9e)](0x50, 17.5),
        this[_0x2a9d0b(0x134)][_0x2a9d0b(0x93)](_0x417268[_0x2a9d0b(0x143)][_0x2a9d0b(0xa1)]({})['to']({
            'state': [{
                't': this[_0x2a9d0b(0x10c)]
            }]
        })['to']({
            'state': [{
                't': this['shape_1']
            }]
        }, 0x1)[_0x2a9d0b(0x15a)](0x1)),
        this[_0x2a9d0b(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0xa0,0x23),
    (_0x2172f1[_0x182e50(0xfd)] = function(_0x28a2f9, _0x105b46, _0x284967, _0x42629d) {
        var _0x4e8d68 = _0x182e50;
        _0x284967 == null && (_0x284967 = !![]);
        _0x42629d == null && (_0x42629d = ![]);
        var _0x4df0b8 = new Object();
        _0x4df0b8['mode'] = _0x28a2f9,
        _0x4df0b8[_0x4e8d68(0x145)] = _0x105b46,
        _0x4df0b8[_0x4e8d68(0x1d9)] = {},
        _0x4df0b8[_0x4e8d68(0x1a5)] = _0x284967,
        _0x4df0b8[_0x4e8d68(0x1ce)] = _0x42629d,
        _0x417268[_0x4e8d68(0x18d)][_0x4e8d68(0x99)](this, [_0x4df0b8]),
        this[_0x4e8d68(0x10c)] = new _0x417268[(_0x4e8d68(0x17d))](),
        this[_0x4e8d68(0x10c)][_0x4e8d68(0x120)]['f']('#FFFFFF')['s']()['p'](_0x4e8d68(0xdf)),
        this[_0x4e8d68(0x10c)][_0x4e8d68(0x9e)](373.175, 76.225),
        this[_0x4e8d68(0x126)] = new _0x417268[(_0x4e8d68(0x17d))](),
        this['shape_1'][_0x4e8d68(0x120)]['f'](_0x4e8d68(0xf3))['s']()['p']('Ag0BUIAAijIAkAAIACAdIABAAQAKgQALgIQAMgJANAAIALABIAJADIgIAlIgIgCIgJgBQgKAAgKAHQgJAIgIARIAABhg'),
        this[_0x4e8d68(0x126)][_0x4e8d68(0x9e)](360.3, 76.025),
        this[_0x4e8d68(0xea)] = new _0x417268[(_0x4e8d68(0x17d))](),
        this[_0x4e8d68(0xea)][_0x4e8d68(0x120)]['f'](_0x4e8d68(0xf3))['s']()['p'](_0x4e8d68(0xba)),
        this['shape_2'][_0x4e8d68(0x9e)](344.35, 76.225),
        this[_0x4e8d68(0x9f)] = new _0x417268['Shape'](),
        this['shape_3'][_0x4e8d68(0x120)]['f'](_0x4e8d68(0xf3))['s']()['p'](_0x4e8d68(0x132)),
        this[_0x4e8d68(0x9f)]['setTransform'](328.55, 76.225),
        this[_0x4e8d68(0xda)] = new _0x417268[(_0x4e8d68(0x17d))](),
        this[_0x4e8d68(0xda)][_0x4e8d68(0x120)]['f'](_0x4e8d68(0xf3))['s']()['p'](_0x4e8d68(0x108)),
        this[_0x4e8d68(0xda)]['setTransform'](312.3, 73.6),
        this[_0x4e8d68(0x134)][_0x4e8d68(0x93)](_0x417268[_0x4e8d68(0x143)][_0x4e8d68(0xa1)]({})['to']({
            'state': [{
                't': this[_0x4e8d68(0xda)]
            }, {
                't': this['shape_3']
            }, {
                't': this[_0x4e8d68(0xea)]
            }, {
                't': this['shape_1']
            }, {
                't': this[_0x4e8d68(0x10c)]
            }]
        })[_0x4e8d68(0x15a)](0x1)),
        this[_0x4e8d68(0x1d7)] = new _0x417268[(_0x4e8d68(0xf4))](_0x4e8d68(0x1e0),'30px\x20\x27subset_2019_06_10\x27',_0x4e8d68(0x14e)),
        this[_0x4e8d68(0x1d7)][_0x4e8d68(0x13d)] = _0x4e8d68(0x1d7),
        this[_0x4e8d68(0x1d7)][_0x4e8d68(0x1b5)] = _0x4e8d68(0x1c0),
        this[_0x4e8d68(0x1d7)][_0x4e8d68(0x168)] = 0x2e,
        this[_0x4e8d68(0x1d7)][_0x4e8d68(0x189)] = 0x100,
        this[_0x4e8d68(0x1d7)][_0x4e8d68(0xe7)] = this,
        this[_0x4e8d68(0x1d7)][_0x4e8d68(0x9e)](0x157, 0xd4),
        this[_0x4e8d68(0x134)][_0x4e8d68(0x93)](_0x417268[_0x4e8d68(0x143)][_0x4e8d68(0xa1)](this['txTimeUpTime2'])[_0x4e8d68(0x15a)](0x1)),
        this[_0x4e8d68(0x1b8)] = new _0x417268[(_0x4e8d68(0xf4))](_0x4e8d68(0x1e0),_0x4e8d68(0xb0),_0x4e8d68(0x13b)),
        this[_0x4e8d68(0x1b8)]['name'] = _0x4e8d68(0x1b8),
        this['txTimeUpTime1']['textAlign'] = _0x4e8d68(0x1c0),
        this['txTimeUpTime1'][_0x4e8d68(0x168)] = 0x2e,
        this[_0x4e8d68(0x1b8)][_0x4e8d68(0x189)] = 0x100,
        this[_0x4e8d68(0x1b8)][_0x4e8d68(0xe7)] = this,
        this[_0x4e8d68(0x1b8)][_0x4e8d68(0x9e)](0x157, 0xd4),
        this[_0x4e8d68(0x134)][_0x4e8d68(0x93)](_0x417268['Tween'][_0x4e8d68(0xa1)](this['txTimeUpTime1'])[_0x4e8d68(0x15a)](0x1)),
        this['txScoreEnd'] = new _0x417268[(_0x4e8d68(0xf4))](_0x4e8d68(0xcf),"bold 146px 'subset_2019_06_10'",_0x4e8d68(0xf3)),
        this['txScoreEnd'][_0x4e8d68(0x13d)] = 'txScoreEnd',
        this['txScoreEnd'][_0x4e8d68(0x1b5)] = _0x4e8d68(0x1c0),
        this['txScoreEnd']['lineHeight'] = 0x6e,
        this['txScoreEnd'][_0x4e8d68(0x189)] = 0x100,
        this['txScoreEnd'][_0x4e8d68(0xe7)] = this,
        this['txScoreEnd'][_0x4e8d68(0x9e)](0x15c, 141, 0.65, 0.65),
        this['txScoreEnd2'] = new _0x417268[(_0x4e8d68(0xf4))](_0x4e8d68(0xcf),"bold 146px 'subset_2019_06_10'","#000000"),
        this['txScoreEnd2'][_0x4e8d68(0x13d)] = 'txScoreEnd2',
        this['txScoreEnd2'][_0x4e8d68(0x1b5)] = _0x4e8d68(0x1c0),
        this['txScoreEnd2']['lineHeight'] = 0x6e,
        this['txScoreEnd2'][_0x4e8d68(0x189)] = 0x100,
        this['txScoreEnd2'][_0x4e8d68(0xe7)] = this,
        this['txScoreEnd2'][_0x4e8d68(0x9e)](0x15c, 141, 0.65, 0.65),
        this.shape.alpha = 0,
        this.shape_1.alpha = 0,
        this.shape_2.alpha = 0,
        this.shape_3.alpha = 0,
        this.shape_4.alpha = 0,
        this.txScoreEnd.alpha = 0.7,
        this.txScoreEnd2.alpha = 0.8,
        this.txScoreEnd.outline = 20,
        this['timeline'][_0x4e8d68(0x93)](_0x417268[_0x4e8d68(0x143)][_0x4e8d68(0xa1)](this['txScoreEnd2'])[_0x4e8d68(0x15a)](0x1)),
        this['timeline'][_0x4e8d68(0x93)](_0x417268[_0x4e8d68(0x143)][_0x4e8d68(0xa1)](this['txScoreEnd'])[_0x4e8d68(0x15a)](0x1)),
        this[_0x4e8d68(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0xfd)], new _0x417268[(_0x182e50(0xf6))](0xd5,0x31,0x104,209.39999999999998), null),
    (_0x2172f1[_0x182e50(0x1dd)] = function(_0x38fc14, _0x235aaa, _0x34950b, _0x532784) {
        var _0x20cdf8 = _0x182e50;
        _0x34950b == null && (_0x34950b = !![]);
        _0x532784 == null && (_0x532784 = ![]);
        var _0xae5016 = new Object();
        _0xae5016[_0x20cdf8(0xed)] = _0x38fc14,
        _0xae5016[_0x20cdf8(0x145)] = _0x235aaa,
        _0xae5016['labels'] = {},
        _0xae5016['loop'] = _0x34950b,
        _0xae5016[_0x20cdf8(0x1ce)] = _0x532784,
        _0x417268[_0x20cdf8(0x18d)]['apply'](this, [_0xae5016]),
        this[_0x20cdf8(0xd8)] = new _0x2172f1[(_0x20cdf8(0x1e6))](_0x20cdf8(0x84),0x0),
        this[_0x20cdf8(0xd8)][_0x20cdf8(0x9e)](0x0, 0x0, 1.09, 1.0964),
        this[_0x20cdf8(0x134)][_0x20cdf8(0x93)](_0x417268[_0x20cdf8(0x143)][_0x20cdf8(0xa1)](this[_0x20cdf8(0xd8)])[_0x20cdf8(0x15a)](0x1)),
        this[_0x20cdf8(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x1dd)], new _0x417268[(_0x182e50(0xf6))](-16.8,-14.2,34.900000000000006,32.9), null),
    (_0x2172f1['formksa'] = function(_0x13cfa6, _0x2f8981, _0x20a6df, _0x153440) {
        var _0x2172eb = _0x182e50;
        _0x20a6df == null && (_0x20a6df = !![]);
        _0x153440 == null && (_0x153440 = ![]);
        var _0x5a257e = new Object();
        _0x5a257e[_0x2172eb(0xed)] = _0x13cfa6,
        _0x5a257e[_0x2172eb(0x145)] = _0x2f8981,
        _0x5a257e[_0x2172eb(0x1d9)] = {},
        _0x5a257e[_0x2172eb(0x1a5)] = _0x20a6df,
        _0x5a257e['reversed'] = _0x153440,
        _0x417268[_0x2172eb(0x18d)][_0x2172eb(0x99)](this, [_0x5a257e]),
        this[_0x2172eb(0xc7)] = new _0x417268[(_0x2172eb(0xf4))]('',_0x2172eb(0x8c),'#FFFFFF'),
        this[_0x2172eb(0xc7)][_0x2172eb(0x13d)] = 'txNu',
        this['txNu']['textAlign'] = _0x2172eb(0x1c0),
        this[_0x2172eb(0xc7)][_0x2172eb(0x168)] = 0x1a,
        this[_0x2172eb(0xc7)]['lineWidth'] = 0x1a,
        this[_0x2172eb(0xc7)][_0x2172eb(0xe7)] = this,
        this[_0x2172eb(0xc7)][_0x2172eb(0x9e)](-0.0263, 7.2, 0.9983, 0x1),
        this[_0x2172eb(0x134)][_0x2172eb(0x93)](_0x417268['Tween'][_0x2172eb(0xa1)](this['txNu'])[_0x2172eb(0x15a)](0x1)),
        this[_0x2172eb(0x171)] = new _0x2172f1[(_0x2172eb(0x199))](),
        this[_0x2172eb(0x171)][_0x2172eb(0x13d)] = 'mksac',
        this[_0x2172eb(0x171)]['setTransform'](0x0, 1.65, 0x1, 0x1, 0x0, 0x0, 0x0, 12.5, 11.5),
        this[_0x2172eb(0x134)]['addTween'](_0x417268[_0x2172eb(0x143)]['get'](this[_0x2172eb(0x171)])[_0x2172eb(0x15a)](0x1)),
        this[_0x2172eb(0x10c)] = new _0x417268[(_0x2172eb(0x17d))](),
        this[_0x2172eb(0x10c)][_0x2172eb(0x120)]['f'](_0x2172eb(0x1e4))['s']()['p'](_0x2172eb(0x1aa)),
        this[_0x2172eb(0x10c)][_0x2172eb(0x9e)](1.8031, -10.675),
        this[_0x2172eb(0x134)]['addTween'](_0x417268['Tween'][_0x2172eb(0xa1)](this[_0x2172eb(0x10c)])[_0x2172eb(0x15a)](0x1)),
        this[_0x2172eb(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x12a)], new _0x417268[(_0x182e50(0xf6))](-0xf,-13.1,0x1e,47.5), null),
    (_0x2172f1[_0x182e50(0x17c)] = function(_0x5aa5d0, _0x3d118c, _0x3d1501, _0x532c78) {
        var _0x3e2abf = _0x182e50;
        _0x3d1501 == null && (_0x3d1501 = !![]);
        _0x532c78 == null && (_0x532c78 = ![]);
        var _0x36ced9 = new Object();
        _0x36ced9['mode'] = _0x5aa5d0,
        _0x36ced9[_0x3e2abf(0x145)] = _0x3d118c,
        _0x36ced9[_0x3e2abf(0x1d9)] = {},
        _0x36ced9[_0x3e2abf(0x1a5)] = _0x3d1501,
        _0x36ced9[_0x3e2abf(0x1ce)] = _0x532c78,
        _0x417268[_0x3e2abf(0x18d)]['apply'](this, [_0x36ced9]),
        this[_0x3e2abf(0x112)] = new _0x2172f1[(_0x3e2abf(0x12a))](),
        this['mksa'][_0x3e2abf(0x13d)] = 'mksa',
        this['mksa']['setTransform'](12.5, 11.5, 0x1, 0x1, 0x0, 0x0, 0x0, 12.5, 11.5),
        this['timeline']['addTween'](_0x417268[_0x3e2abf(0x143)][_0x3e2abf(0xa1)](this[_0x3e2abf(0x112)])[_0x3e2abf(0x15a)](0x1)),
        this['mksb'] = new _0x2172f1['formksb'](),
        this[_0x3e2abf(0x102)][_0x3e2abf(0x13d)] = _0x3e2abf(0x102),
        this[_0x3e2abf(0x102)][_0x3e2abf(0x9e)](0xf, 13.8, 0x1, 0x1, 0x0, 0x0, 0x0, 0xf, 13.8),
        this[_0x3e2abf(0x134)]['addTween'](_0x417268[_0x3e2abf(0x143)][_0x3e2abf(0xa1)](this[_0x3e2abf(0x102)])[_0x3e2abf(0x15a)](0x1)),
        this[_0x3e2abf(0xd8)] = new _0x2172f1[(_0x3e2abf(0xa7))](),
        this[_0x3e2abf(0xd8)][_0x3e2abf(0x9e)](-0xe, -11.3, 0.9667, 0.9643),
        this[_0x3e2abf(0x134)]['addTween'](_0x417268[_0x3e2abf(0x143)][_0x3e2abf(0xa1)](this[_0x3e2abf(0xd8)])['wait'](0x1)),
        this[_0x3e2abf(0x8a)]();
    }
    )['prototype'] = _0x158966(_0x2172f1[_0x182e50(0x17c)], new _0x417268['Rectangle'](-16.9,-14.2,34.9,48.599999999999994), null),
    (_0x2172f1[_0x182e50(0x15f)] = function(_0x1a7b6a, _0x3dc143, _0x57e33b, _0x38b78e) {
        var _0x48300d = _0x182e50;
        _0x57e33b == null && (_0x57e33b = !![]);
        _0x38b78e == null && (_0x38b78e = ![]);
        var _0x3ad271 = new Object();
        _0x3ad271['mode'] = _0x1a7b6a,
        _0x3ad271[_0x48300d(0x145)] = _0x3dc143,
        _0x3ad271['labels'] = {},
        _0x3ad271[_0x48300d(0x1a5)] = _0x57e33b,
        _0x3ad271[_0x48300d(0x1ce)] = _0x38b78e,
        _0x417268[_0x48300d(0x18d)][_0x48300d(0x99)](this, [_0x3ad271]),
        this[_0x48300d(0x133)] = new _0x2172f1[(_0x48300d(0x11f))](),
        this['mzSlSoundRangeBar'][_0x48300d(0x13d)] = _0x48300d(0x133),
        this[_0x48300d(0x133)][_0x48300d(0x9e)](0x15, 0x0),
        this[_0x48300d(0x134)][_0x48300d(0x93)](_0x417268[_0x48300d(0x143)][_0x48300d(0xa1)](this[_0x48300d(0x133)])[_0x48300d(0x15a)](0x1)),
        this['shape'] = new _0x417268['Shape'](),
        this['shape']['graphics']['f'](_0x48300d(0xaa))['s']()['p'](_0x48300d(0x11a)),
        this[_0x48300d(0x10c)]['setTransform'](0x23, 0x0),
        this[_0x48300d(0x134)][_0x48300d(0x93)](_0x417268[_0x48300d(0x143)][_0x48300d(0xa1)](this['shape'])['wait'](0x1)),
        this[_0x48300d(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x15f)], new _0x417268[(_0x182e50(0xf6))](0x0,-0xf,0x46,0x1e), null),
    (_0x2172f1[_0x182e50(0xbd)] = function(_0x29fc28, _0x2619f0, _0x4f2d2c, _0x5852b3) {
        var _0xbc8b49 = _0x182e50;
        _0x4f2d2c == null && (_0x4f2d2c = !![]);
        _0x5852b3 == null && (_0x5852b3 = ![]);
        var _0x336cad = new Object();
        _0x336cad[_0xbc8b49(0xed)] = _0x29fc28,
        _0x336cad['startPosition'] = _0x2619f0,
        _0x336cad[_0xbc8b49(0x1d9)] = {},
        _0x336cad['loop'] = _0x4f2d2c,
        _0x336cad[_0xbc8b49(0x1ce)] = _0x5852b3,
        _0x417268[_0xbc8b49(0x18d)]['apply'](this, [_0x336cad]),
        this['mzSlSoundRange'] = new _0x2172f1['formzSlSoundRange'](),
        this['mzSlSoundRange'][_0xbc8b49(0x13d)] = _0xbc8b49(0x16f),
        this['mzSlSoundRange']['setTransform'](40.7, 1.3, 0x1, 0x1, 0x0, 0x0, 0x0, 40.7, 1.3),
        this[_0xbc8b49(0x134)][_0xbc8b49(0x93)](_0x417268['Tween'][_0xbc8b49(0xa1)](this[_0xbc8b49(0x16f)])[_0xbc8b49(0x15a)](0x1)),
        this[_0xbc8b49(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0xbd)], new _0x417268[(_0x182e50(0xf6))](0x0,-0xf,0x46,0x1e), null),
    (_0x2172f1[_0x182e50(0x15e)] = function(_0x44a9fc, _0x4b2ae1, _0x3e0d30, _0x1060a9) {
        var _0x43b507 = _0x182e50;
        _0x3e0d30 == null && (_0x3e0d30 = !![]);
        _0x1060a9 == null && (_0x1060a9 = ![]);
        var _0x244fcd = new Object();
        _0x244fcd[_0x43b507(0xed)] = _0x44a9fc,
        _0x244fcd[_0x43b507(0x145)] = _0x4b2ae1,
        _0x244fcd[_0x43b507(0x1d9)] = {},
        _0x244fcd[_0x43b507(0x1a5)] = _0x3e0d30,
        _0x244fcd[_0x43b507(0x1ce)] = _0x1060a9,
        _0x417268[_0x43b507(0x18d)][_0x43b507(0x99)](this, [_0x244fcd]),
        this[_0x43b507(0x15b)] = new _0x2172f1[(_0x43b507(0x9b))](),
        this[_0x43b507(0x15b)][_0x43b507(0x13d)] = 'mzTimeBarS',
        this[_0x43b507(0x15b)][_0x43b507(0x9e)](0x7, 0x12b, 0x1, 0x1, 0xb4),
        this[_0x43b507(0x134)][_0x43b507(0x93)](_0x417268['Tween'][_0x43b507(0xa1)](this[_0x43b507(0x15b)])[_0x43b507(0x15a)](0x1)),
        this[_0x43b507(0x10c)] = new _0x417268[(_0x43b507(0x17d))](),
        this[_0x43b507(0x10c)][_0x43b507(0x120)]['f'](_0x43b507(0x19c))['s']()['p'](_0x43b507(0x8d)),
        this[_0x43b507(0x10c)][_0x43b507(0x9e)](3.5, 0x95),
        this['timeline'][_0x43b507(0x93)](_0x417268['Tween'][_0x43b507(0xa1)](this[_0x43b507(0x10c)])[_0x43b507(0x15a)](0x1)),
        this[_0x43b507(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x15e)], new _0x417268[(_0x182e50(0xf6))](-0x1,-0x2,0x9,0x12e), null),
    (_0x2172f1[_0x182e50(0x1d2)] = function(_0x4bcb27, _0x325230, _0x112931, _0x1ff79b) {
        var _0x17eb73 = _0x182e50;
        _0x112931 == null && (_0x112931 = !![]);
        _0x1ff79b == null && (_0x1ff79b = ![]);
        var _0x21aadb = new Object();
        _0x21aadb['mode'] = _0x4bcb27,
        _0x21aadb[_0x17eb73(0x145)] = _0x325230,
        _0x21aadb[_0x17eb73(0x1d9)] = {},
        _0x21aadb[_0x17eb73(0x1a5)] = _0x112931,
        _0x21aadb[_0x17eb73(0x1ce)] = _0x1ff79b,
        _0x417268[_0x17eb73(0x18d)][_0x17eb73(0x99)](this, [_0x21aadb]),
        this[_0x17eb73(0xca)] = function() {
            var _0x12e12d = _0x17eb73;
            this[_0x12e12d(0xd3)]();
        }
        ,
        this['timeline'][_0x17eb73(0x93)](_0x417268[_0x17eb73(0x143)][_0x17eb73(0xa1)](this)['call'](this['frame_0'])[_0x17eb73(0x15a)](0x2)),
        this['instance'] = new _0x2172f1['formzCheckLightColorで使用'](),
        this['instance'][_0x17eb73(0x9e)](0x0, -0x14),
        this[_0x17eb73(0x134)]['addTween'](_0x417268[_0x17eb73(0x143)][_0x17eb73(0xa1)](this['instance'])[_0x17eb73(0x15a)](0x2)),
        this[_0x17eb73(0x10c)] = new _0x417268['Shape'](),
        this['shape']['graphics']['f']('#05C062')['s']()['p'](_0x17eb73(0xd6)),
        this['shape'][_0x17eb73(0x9e)](30.975, 0x1f),
        this[_0x17eb73(0x134)][_0x17eb73(0x93)](_0x417268[_0x17eb73(0x143)][_0x17eb73(0xa1)](this[_0x17eb73(0x10c)])['to']({
            '_off': !![]
        }, 0x1)[_0x17eb73(0x15a)](0x1)),
        this[_0x17eb73(0xd4)] = new _0x2172f1['forチェックボックスで使用'](),
        this['instance_1'][_0x17eb73(0x9e)](20.5, 20.5, 0x1, 0x1, 0x0, 0x0, 0x0, 20.5, 20.5),
        this[_0x17eb73(0x134)][_0x17eb73(0x93)](_0x417268[_0x17eb73(0x143)][_0x17eb73(0xa1)](this[_0x17eb73(0xd4)])[_0x17eb73(0x15a)](0x2)),
        this['_renderFirstFrame']();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268['Rectangle'](0x0,-0x14,0xd2,0x64),
    (_0x2172f1[_0x182e50(0x17b)] = function(_0x4474e8, _0x4c416e, _0x1adcf8, _0x173d6b) {
        var _0x3605dc = _0x182e50;
        _0x1adcf8 == null && (_0x1adcf8 = !![]);
        _0x173d6b == null && (_0x173d6b = ![]);
        var _0x76b981 = new Object();
        _0x76b981[_0x3605dc(0xed)] = _0x4474e8,
        _0x76b981[_0x3605dc(0x145)] = _0x4c416e,
        _0x76b981[_0x3605dc(0x1d9)] = {},
        _0x76b981[_0x3605dc(0x1a5)] = _0x1adcf8,
        _0x76b981[_0x3605dc(0x1ce)] = _0x173d6b,
        _0x417268[_0x3605dc(0x18d)][_0x3605dc(0x99)](this, [_0x76b981]),
        this[_0x3605dc(0xca)] = function() {
            var _0x670aea = _0x3605dc;
            this[_0x670aea(0xd3)]();
        }
        ,
        this[_0x3605dc(0x134)][_0x3605dc(0x93)](_0x417268[_0x3605dc(0x143)]['get'](this)[_0x3605dc(0x1cc)](this[_0x3605dc(0xca)])[_0x3605dc(0x15a)](0x2)),
        this[_0x3605dc(0x10c)] = new _0x417268[(_0x3605dc(0x17d))](),
        this[_0x3605dc(0x10c)][_0x3605dc(0x120)]['f'](_0x3605dc(0x1ca))['s']()['p'](_0x3605dc(0x130)),
        this[_0x3605dc(0x10c)][_0x3605dc(0x9e)](0x64, 0x1e),
        this['timeline']['addTween'](_0x417268[_0x3605dc(0x143)][_0x3605dc(0xa1)](this[_0x3605dc(0x10c)])[_0x3605dc(0x15a)](0x2)),
        this['shape_1'] = new _0x417268['Shape'](),
        this[_0x3605dc(0x126)][_0x3605dc(0x120)]['f']('#05C062')['s']()['p'](_0x3605dc(0xd6)),
        this[_0x3605dc(0x126)][_0x3605dc(0x9e)](30.975, 0x1f),
        this[_0x3605dc(0x134)][_0x3605dc(0x93)](_0x417268[_0x3605dc(0x143)][_0x3605dc(0xa1)](this[_0x3605dc(0x126)])['to']({
            '_off': !![]
        }, 0x1)[_0x3605dc(0x15a)](0x1)),
        this[_0x3605dc(0xd8)] = new _0x2172f1[(_0x3605dc(0xa5))](),
        this[_0x3605dc(0xd8)][_0x3605dc(0x9e)](20.5, 20.5, 0x1, 0x1, 0x0, 0x0, 0x0, 20.5, 20.5),
        this['timeline'][_0x3605dc(0x93)](_0x417268[_0x3605dc(0x143)][_0x3605dc(0xa1)](this[_0x3605dc(0xd8)])[_0x3605dc(0x15a)](0x2)),
        this['_renderFirstFrame']();
    }
    )['prototype'] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b['nominalBounds'] = new _0x417268[(_0x182e50(0xf6))](0x0,-0x14,0xc8,0x64),
    (_0x2172f1['Cl_mk'] = function(_0x42094f, _0xaafee6, _0x5d17a5, _0x3efae6) {
        var _0x5017d4 = _0x182e50;
        _0x5d17a5 == null && (_0x5d17a5 = !![]);
        _0x3efae6 == null && (_0x3efae6 = ![]);
        var _0x3f4ec4 = new Object();
        _0x3f4ec4[_0x5017d4(0xed)] = _0x42094f,
        _0x3f4ec4[_0x5017d4(0x145)] = _0xaafee6,
        _0x3f4ec4[_0x5017d4(0x1d9)] = {},
        _0x3f4ec4[_0x5017d4(0x1a5)] = _0x5d17a5,
        _0x3f4ec4[_0x5017d4(0x1ce)] = _0x3efae6,
        _0x417268[_0x5017d4(0x18d)][_0x5017d4(0x99)](this, [_0x3f4ec4]),
        this['isSingleFrame'] = ![],
        this[_0x5017d4(0xca)] = function() {
            var _0x1cb2b5 = _0x5017d4;
            if (this[_0x1cb2b5(0x1b4)])
                return;
            this[_0x1cb2b5(0x1c7)] == 0x1 && (this[_0x1cb2b5(0x1b4)] = !![]);
            this[_0x1cb2b5(0xd3)](),
            this[_0x1cb2b5(0x12b)] = 0x14 * Math[_0x1cb2b5(0x18c)](),
            this['ray'] = -0x19 * Math[_0x1cb2b5(0x18c)](),
            this[_0x1cb2b5(0xc3)] = 0x0;
            function _0x4e9e80() {
                var _0x52a939 = _0x1cb2b5;
                exportRoot['mm']['pmmk'] *= -0x1,
                this['pm'] = exportRoot['mm'][_0x52a939(0x190)],
                this[_0x52a939(0x1e1)] = createjs['Ticker']['on'](_0x52a939(0xd0), this[_0x52a939(0x16e)], this);
            }
            function _0xdd3b84(_0x563a8b) {
                var _0x2ee776 = _0x1cb2b5;
                this['y'] += this[_0x2ee776(0xef)] + 0.07 * this[_0x2ee776(0xc3)] * this[_0x2ee776(0xc3)],
                this[_0x2ee776(0xc3)] += 0x2,
                this['x'] += 1.2 * this[_0x2ee776(0x12b)] * this['pm'],
                this[_0x2ee776(0xc9)] += 0x3 * this['pm'];
                if (this[_0x2ee776(0xc3)] > 0x2d) {
                    createjs[_0x2ee776(0xfb)][_0x2ee776(0x182)](_0x2ee776(0xd0), this[_0x2ee776(0x1e1)]);
                    try {
                        exportRoot['mm']['mg'][_0x2ee776(0x9a)](this);
                    } catch (_0x581a2c) {}
                }
            }
            ;this['funTileDrop'] = _0x4e9e80,
            this[_0x1cb2b5(0x16e)] = _0xdd3b84;
        }
        ,
        this[_0x5017d4(0x134)][_0x5017d4(0x93)](_0x417268[_0x5017d4(0x143)][_0x5017d4(0xa1)](this)[_0x5017d4(0x1cc)](this[_0x5017d4(0xca)])[_0x5017d4(0x15a)](0x1)),
        this[_0x5017d4(0x17f)] = new _0x2172f1['formks'](),
        this[_0x5017d4(0x17f)][_0x5017d4(0x13d)] = _0x5017d4(0x17f),
        this[_0x5017d4(0x134)]['addTween'](_0x417268['Tween'][_0x5017d4(0xa1)](this[_0x5017d4(0x17f)])['wait'](0x1)),
        this[_0x5017d4(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x105)], new _0x417268['Rectangle'](-16.9,-14.2,34.9,48.599999999999994), null),
    (_0x2172f1[_0x182e50(0x139)] = function(_0x2fce9b, _0x41e5c2, _0x1e2989, _0x487f1a) {
        var _0x4b3105 = _0x182e50;
        _0x1e2989 == null && (_0x1e2989 = !![]);
        _0x487f1a == null && (_0x487f1a = ![]);
        var _0x31fa6c = new Object();
        _0x31fa6c[_0x4b3105(0xed)] = _0x2fce9b,
        _0x31fa6c['startPosition'] = _0x41e5c2,
        _0x31fa6c['labels'] = {},
        _0x31fa6c[_0x4b3105(0x1a5)] = _0x1e2989,
        _0x31fa6c[_0x4b3105(0x1ce)] = _0x487f1a,
        _0x417268[_0x4b3105(0x18d)][_0x4b3105(0x99)](this, [_0x31fa6c]),
        this[_0x4b3105(0xca)] = function() {
            var _0x1124bc = _0x4b3105;
            ef_lang == 'ja' ? this[_0x1124bc(0x1e3)](0x1) : this[_0x1124bc(0x1e3)](0x2);
        }
        ,
        this[_0x4b3105(0x134)][_0x4b3105(0x93)](_0x417268[_0x4b3105(0x143)]['get'](this)['call'](this['frame_0'])[_0x4b3105(0x15a)](0x3)),
        this[_0x4b3105(0x10c)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x10c)]['graphics']['f']('#FFFFFF')['s']()['p'](_0x4b3105(0xe6)),
        this[_0x4b3105(0x10c)][_0x4b3105(0x9e)](127.15, 17.45),
        this[_0x4b3105(0x126)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x126)]['graphics']['f']('#FFFFFF')['s']()['p'](_0x4b3105(0x193)),
        this[_0x4b3105(0x126)][_0x4b3105(0x9e)](112.55, 17.9),
        this['shape_2'] = new _0x417268['Shape'](),
        this['shape_2'][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x153)),
        this[_0x4b3105(0xea)][_0x4b3105(0x9e)](96.075, 17.2),
        this[_0x4b3105(0x9f)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x9f)][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x1a1)),
        this['shape_3'][_0x4b3105(0x9e)](79.425, 17.55),
        this[_0x4b3105(0xda)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0xda)][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0xec)),
        this[_0x4b3105(0xda)][_0x4b3105(0x9e)](63.525, 17.375),
        this[_0x4b3105(0x1bb)] = new _0x417268[(_0x4b3105(0x17d))](),
        this['shape_5'][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0xb2)),
        this[_0x4b3105(0x1bb)][_0x4b3105(0x9e)](47.275, 17.575),
        this[_0x4b3105(0x11d)] = new _0x417268[(_0x4b3105(0x17d))](),
        this['shape_6'][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p']('AgQBDQgKgEgFgJQgGgJAAgNIAAgGIABgJIgPgCIgNgDIABgWIAPAEIAPACIACgRIgQgDIgOgDIABgWIAPAEIAQACIACgLIAAgHIAAgIIAbABIgCAJIgCAHIAAAEIgBAGIAOgBIAMgBIgBAWIgNACIgPAAIgBAJIgBAJIAOgBIAQgBIgBAVIgMABIgNABIgDAAIgDAAIgBAFIAAAEQAAAJAGAEQAFAFAKAAQAKgBAHgCQAHgDAEgFQADgFAAgGQAAgIgEgHQgEgHgIgGIAbgGQAIAKAEAJQADAJAAAKQAAAMgHAJQgHAKgNAGQgNAFgSAAQgNAAgKgDg'),
        this[_0x4b3105(0x11d)]['setTransform'](31.375, 17.575),
        this[_0x4b3105(0x115)] = new _0x417268[(_0x4b3105(0x17d))](),
        this['shape_7'][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x178)),
        this['shape_7'][_0x4b3105(0x9e)](126.65, 19.375),
        this[_0x4b3105(0xdd)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0xdd)][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x125)),
        this[_0x4b3105(0xdd)][_0x4b3105(0x9e)](116.825, 16.9),
        this[_0x4b3105(0x8b)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x8b)][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x151)),
        this['shape_9'][_0x4b3105(0x9e)](107.3742, 19.525),
        this[_0x4b3105(0x1ba)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x1ba)][_0x4b3105(0x120)]['f']('#FFFFFF')['s']()['p'](_0x4b3105(0xa6)),
        this['shape_10']['setTransform'](95.55, 21.775),
        this[_0x4b3105(0x1b0)] = new _0x417268['Shape'](),
        this[_0x4b3105(0x1b0)][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0xb5)),
        this[_0x4b3105(0x1b0)][_0x4b3105(0x9e)](82.6, 17.75),
        this[_0x4b3105(0x187)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x187)][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x13a)),
        this[_0x4b3105(0x187)]['setTransform'](65.275, 21.7),
        this['shape_13'] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x1ab)]['graphics']['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x151)),
        this[_0x4b3105(0x1ab)]['setTransform'](53.0242, 19.525),
        this[_0x4b3105(0x100)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x100)][_0x4b3105(0x120)]['f']('#FFFFFF')['s']()['p'](_0x4b3105(0x186)),
        this['shape_14'][_0x4b3105(0x9e)](44.45, 17.35),
        this[_0x4b3105(0x1c2)] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0x1c2)][_0x4b3105(0x120)]['f'](_0x4b3105(0xf3))['s']()['p'](_0x4b3105(0x18e)),
        this['shape_15']['setTransform'](34.05, 17.75),
        this['timeline']['addTween'](_0x417268[_0x4b3105(0x143)][_0x4b3105(0xa1)]({})['to']({
            'state': [{
                't': this['shape_6']
            }, {
                't': this['shape_5']
            }, {
                't': this[_0x4b3105(0xda)]
            }, {
                't': this[_0x4b3105(0x9f)]
            }, {
                't': this['shape_2']
            }, {
                't': this['shape_1']
            }, {
                't': this[_0x4b3105(0x10c)]
            }]
        })['to']({
            'state': [{
                't': this['shape_15']
            }, {
                't': this['shape_14']
            }, {
                't': this[_0x4b3105(0x1ab)]
            }, {
                't': this['shape_12']
            }, {
                't': this[_0x4b3105(0x1b0)]
            }, {
                't': this[_0x4b3105(0x1ba)]
            }, {
                't': this[_0x4b3105(0x8b)]
            }, {
                't': this[_0x4b3105(0xdd)]
            }, {
                't': this[_0x4b3105(0x115)]
            }]
        }, 0x2)['wait'](0x1)),
        this['shape_16'] = new _0x417268[(_0x4b3105(0x17d))](),
        this[_0x4b3105(0xad)][_0x4b3105(0x120)]['f'](_0x4b3105(0x9c))['s']()['p'](_0x4b3105(0x10f)),
        this[_0x4b3105(0xad)][_0x4b3105(0x9e)](0x50, 8.5),
        this['timeline'][_0x4b3105(0x93)](_0x417268[_0x4b3105(0x143)]['get'](this[_0x4b3105(0xad)])['wait'](0x3)),
        this[_0x4b3105(0x15d)] = new _0x2172f1[(_0x4b3105(0xb6))](),
        this['mzGreenButtonColor'][_0x4b3105(0x13d)] = _0x4b3105(0x15d),
        this[_0x4b3105(0x15d)][_0x4b3105(0x9e)](0x50, 17.5, 0x1, 0x1, 0x0, 0x0, 0x0, 0x50, 17.5),
        this[_0x4b3105(0x134)][_0x4b3105(0x93)](_0x417268[_0x4b3105(0x143)]['get'](this[_0x4b3105(0x15d)])[_0x4b3105(0x15a)](0x3)),
        this['shape_17'] = new _0x417268[(_0x4b3105(0x17d))](),
        this['shape_17']['graphics']['f']('#999999')['s']()['p'](_0x4b3105(0x192)),
        this[_0x4b3105(0xe2)][_0x4b3105(0x9e)](0x52, 19.5),
        this[_0x4b3105(0x134)]['addTween'](_0x417268[_0x4b3105(0x143)]['get'](this[_0x4b3105(0xe2)])[_0x4b3105(0x15a)](0x3)),
        this['_renderFirstFrame']();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0xa2,0x25),
    (_0x2172f1[_0x182e50(0x19e)] = function(_0x26e306, _0x5a73cd, _0x10d96c, _0x4e37ee) {
        var _0x4723f8 = _0x182e50;
        _0x10d96c == null && (_0x10d96c = !![]);
        _0x4e37ee == null && (_0x4e37ee = ![]);
        var _0x2bf240 = new Object();
        _0x2bf240['mode'] = _0x26e306,
        _0x2bf240[_0x4723f8(0x145)] = _0x5a73cd,
        _0x2bf240[_0x4723f8(0x1d9)] = {},
        _0x2bf240[_0x4723f8(0x1a5)] = _0x10d96c,
        _0x2bf240[_0x4723f8(0x1ce)] = _0x4e37ee,
        _0x417268[_0x4723f8(0x18d)][_0x4723f8(0x99)](this, [_0x2bf240]),
        this[_0x4723f8(0xca)] = function() {
            var _0x181bcd = _0x4723f8;
            ef_lang == 'ja' ? this[_0x181bcd(0x1e3)](0x1) : this[_0x181bcd(0x1e3)](0x2);
        }
        ,
        this[_0x4723f8(0x134)][_0x4723f8(0x93)](_0x417268['Tween'][_0x4723f8(0xa1)](this)[_0x4723f8(0x1cc)](this[_0x4723f8(0xca)])[_0x4723f8(0x15a)](0x3)),
        this[_0x4723f8(0x10c)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x10c)]['graphics']['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x8e)),
        this[_0x4723f8(0x10c)][_0x4723f8(0x9e)](144.55, 17.425),
        this['shape_1'] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x126)]['graphics']['f']('#FFFFFF')['s']()['p'](_0x4723f8(0x12f)),
        this['shape_1'][_0x4723f8(0x9e)](129.925, 17.875),
        this[_0x4723f8(0xea)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0xea)]['graphics']['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x16a)),
        this[_0x4723f8(0xea)]['setTransform'](113.475, 17.2),
        this[_0x4723f8(0x9f)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x9f)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x127)),
        this[_0x4723f8(0x9f)][_0x4723f8(0x9e)](96.725, 17.5),
        this[_0x4723f8(0xda)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0xda)][_0x4723f8(0x120)]['f']('#FFFFFF')['s']()['p'](_0x4723f8(0x150)),
        this[_0x4723f8(0xda)][_0x4723f8(0x9e)](81.1, 17.6),
        this[_0x4723f8(0x1bb)] = new _0x417268['Shape'](),
        this[_0x4723f8(0x1bb)]['graphics']['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x17a)),
        this[_0x4723f8(0x1bb)][_0x4723f8(0x9e)](64.95, 17.425),
        this['shape_6'] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x11d)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0xd5)),
        this['shape_6'][_0x4723f8(0x9e)](48.975, 17.35),
        this[_0x4723f8(0x115)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x115)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x1c6)),
        this[_0x4723f8(0x115)][_0x4723f8(0x9e)](32.85, 17.975),
        this[_0x4723f8(0xdd)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0xdd)]['graphics']['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x173)),
        this[_0x4723f8(0xdd)][_0x4723f8(0x9e)](16.9, 17.525),
        this['shape_9'] = new _0x417268['Shape'](),
        this['shape_9'][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p']('AgQA6QgIgCgIgEIgNgIIAQgXQAIAGAHADQAHADAHAAQAGAAADgCQADgCAAgFQAAgDgDgCIgIgFIgKgEQgHgDgHgEQgHgDgEgHQgFgGAAgKQAAgLAGgIQAFgIAKgEQAKgFAMAAQAOAAAKAFQAKAEAHAGIgQAVIgMgHQgGgDgGAAQgFAAgDACQgDACAAAFQAAADADACIAIAEIALAEIAOAHQAHAEAEAGQAEAGABAKQAAALgGAIQgFAJgLAFQgKAEgPABQgHAAgIgCg'),
        this[_0x4723f8(0x8b)][_0x4723f8(0x9e)](133.125, 19.525),
        this[_0x4723f8(0x1ba)] = new _0x417268['Shape'](),
        this[_0x4723f8(0x1ba)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x80)),
        this[_0x4723f8(0x1ba)][_0x4723f8(0x9e)](123.15, 19.525),
        this[_0x4723f8(0x1b0)] = new _0x417268['Shape'](),
        this[_0x4723f8(0x1b0)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0xf0)),
        this[_0x4723f8(0x1b0)][_0x4723f8(0x9e)](108.4013, 19.375),
        this['shape_12'] = new _0x417268['Shape'](),
        this['shape_12'][_0x4723f8(0x120)]['f']('#FFFFFF')['s']()['p'](_0x4723f8(0x151)),
        this['shape_12'][_0x4723f8(0x9e)](93.2742, 19.525),
        this['shape_13'] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x1ab)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x12d)),
        this[_0x4723f8(0x1ab)][_0x4723f8(0x9e)](80.975, 17.775),
        this[_0x4723f8(0x100)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x100)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p']('AgWA0QgNgHgIgNQgIgNABgTQAAgSAIgNQAHgNANgIQAMgHANAAQAQAAALAHQAKAIAGAMQAFAMAAAQIAAAIIgBAGIhCAAQADAMAHAFQAHAFALAAIALgBIAMgGIAMAWQgJAGgLADQgKAEgLAAQgPgBgNgHgAAVgMQAAgJgEgFQgEgFgKgBQgGAAgGAFQgFAFgDAKIAmAAIAAAAg'),
        this[_0x4723f8(0x100)][_0x4723f8(0x9e)](65.15, 19.525),
        this[_0x4723f8(0x1c2)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x1c2)][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x161)),
        this[_0x4723f8(0x1c2)]['setTransform'](56.275, 19.375),
        this[_0x4723f8(0xad)] = new _0x417268[(_0x4723f8(0x17d))](),
        this['shape_16'][_0x4723f8(0x120)]['f'](_0x4723f8(0xf3))['s']()['p'](_0x4723f8(0x10d)),
        this['shape_16'][_0x4723f8(0x9e)](45.525, 19.525),
        this[_0x4723f8(0xe2)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0xe2)][_0x4723f8(0x120)]['f']('#FFFFFF')['s']()['p']('AAmBKIAAgzIABgRIACgRIACgQIgBAAIgNAjIgUA2IgSAAIgUg2IgMgjIgBAAIACAQIACARIAAARIAAAzIggAAIAAiUIAnAAIAYBBIAEAMIADAOIABAAIAEgOIAEgMIAXhBIAnAAIAACUg'),
        this[_0x4723f8(0xe2)][_0x4723f8(0x9e)](31.375, 17.75),
        this['timeline'][_0x4723f8(0x93)](_0x417268[_0x4723f8(0x143)]['get']({})['to']({
            'state': [{
                't': this[_0x4723f8(0xdd)]
            }, {
                't': this['shape_7']
            }, {
                't': this['shape_6']
            }, {
                't': this[_0x4723f8(0x1bb)]
            }, {
                't': this[_0x4723f8(0xda)]
            }, {
                't': this[_0x4723f8(0x9f)]
            }, {
                't': this[_0x4723f8(0xea)]
            }, {
                't': this[_0x4723f8(0x126)]
            }, {
                't': this[_0x4723f8(0x10c)]
            }]
        })['to']({
            'state': [{
                't': this['shape_17']
            }, {
                't': this['shape_16']
            }, {
                't': this[_0x4723f8(0x1c2)]
            }, {
                't': this[_0x4723f8(0x100)]
            }, {
                't': this[_0x4723f8(0x1ab)]
            }, {
                't': this[_0x4723f8(0x187)]
            }, {
                't': this['shape_11']
            }, {
                't': this[_0x4723f8(0x1ba)]
            }, {
                't': this[_0x4723f8(0x8b)]
            }]
        }, 0x2)['wait'](0x1)),
        this[_0x4723f8(0x146)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x146)][_0x4723f8(0x120)]['f'](_0x4723f8(0x9c))['s']()['p'](_0x4723f8(0x10f)),
        this['shape_18'][_0x4723f8(0x9e)](0x50, 8.5),
        this[_0x4723f8(0x134)][_0x4723f8(0x93)](_0x417268[_0x4723f8(0x143)][_0x4723f8(0xa1)](this[_0x4723f8(0x146)])['wait'](0x3)),
        this[_0x4723f8(0x15d)] = new _0x2172f1[(_0x4723f8(0xb6))](),
        this['mzGreenButtonColor'][_0x4723f8(0x13d)] = 'mzGreenButtonColor',
        this['mzGreenButtonColor'][_0x4723f8(0x9e)](0x50, 17.5, 0x1, 0x1, 0x0, 0x0, 0x0, 0x50, 17.5),
        this['timeline'][_0x4723f8(0x93)](_0x417268[_0x4723f8(0x143)][_0x4723f8(0xa1)](this[_0x4723f8(0x15d)])[_0x4723f8(0x15a)](0x3)),
        this[_0x4723f8(0x12c)] = new _0x417268[(_0x4723f8(0x17d))](),
        this[_0x4723f8(0x12c)][_0x4723f8(0x120)]['f'](_0x4723f8(0x19a))['s']()['p'](_0x4723f8(0x192)),
        this[_0x4723f8(0x12c)][_0x4723f8(0x9e)](0x52, 19.5),
        this[_0x4723f8(0x134)]['addTween'](_0x417268[_0x4723f8(0x143)][_0x4723f8(0xa1)](this[_0x4723f8(0x12c)])[_0x4723f8(0x15a)](0x3)),
        this[_0x4723f8(0x8a)]();
    }
    )['prototype'] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,0x0,0xa2,0x25),
    (_0x2172f1[_0x182e50(0x175)] = function(_0xa8fd61, _0x330e44, _0x4b2d9a, _0x106f10) {
        var _0x4a7e80 = _0x182e50;
        _0x4b2d9a == null && (_0x4b2d9a = !![]);
        _0x106f10 == null && (_0x106f10 = ![]);
        var _0x102865 = new Object();
        _0x102865[_0x4a7e80(0xed)] = _0xa8fd61,
        _0x102865['startPosition'] = _0x330e44,
        _0x102865['labels'] = {},
        _0x102865[_0x4a7e80(0x1a5)] = _0x4b2d9a,
        _0x102865[_0x4a7e80(0x1ce)] = _0x106f10,
        _0x417268[_0x4a7e80(0x18d)][_0x4a7e80(0x99)](this, [_0x102865]),
        this[_0x4a7e80(0x95)] = new _0x2172f1[(_0x4a7e80(0xfd))](),
        this[_0x4a7e80(0x95)][_0x4a7e80(0x13d)] = _0x4a7e80(0x95),
        this[_0x4a7e80(0x134)][_0x4a7e80(0x93)](_0x417268['Tween'][_0x4a7e80(0xa1)](this[_0x4a7e80(0x95)])[_0x4a7e80(0x15a)](0x1)),
        this[_0x4a7e80(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x158966(_0x2172f1[_0x182e50(0x175)], new _0x417268['Rectangle'](0xd5,0x31,0x104,209.39999999999998), null),
    (_0x2172f1[_0x182e50(0x140)] = function(_0x353a0c, _0x35b8fd, _0x1cf8cc, _0x2d0fbb) {
        var _0x35ba7e = _0x182e50;
        _0x1cf8cc == null && (_0x1cf8cc = !![]);
        _0x2d0fbb == null && (_0x2d0fbb = ![]);
        var _0x5f21b2 = new Object();
        _0x5f21b2['mode'] = _0x353a0c,
        _0x5f21b2[_0x35ba7e(0x145)] = _0x35b8fd,
        _0x5f21b2[_0x35ba7e(0x1d9)] = {},
        _0x5f21b2[_0x35ba7e(0x1a5)] = _0x1cf8cc,
        _0x5f21b2[_0x35ba7e(0x1ce)] = _0x2d0fbb,
        _0x417268['MovieClip']['apply'](this, [_0x5f21b2]),
        this[_0x35ba7e(0xf7)] = new _0x2172f1[(_0x35ba7e(0x175))](),
        this[_0x35ba7e(0xf7)]['name'] = _0x35ba7e(0xf7),
        this[_0x35ba7e(0x134)]['addTween'](_0x417268[_0x35ba7e(0x143)][_0x35ba7e(0xa1)](this['mess'])['wait'](0x2)),
        this[_0x35ba7e(0x10c)] = new _0x417268[(_0x35ba7e(0x17d))](),
        this[_0x35ba7e(0x10c)]['graphics']['f']()['s']('#FFDDDD')['ss'](0x2, 0x1, 0x1)['p'](_0x35ba7e(0x14b)),
        this[_0x35ba7e(0x10c)][_0x35ba7e(0x9e)](341.5, 108.2164),
        this[_0x35ba7e(0x126)] = new _0x417268['Shape'](),
        this[_0x35ba7e(0x126)][_0x35ba7e(0x120)]['f']()['s']('#FFEEEE')['ss'](0x1, 0x1, 0x1)['p'](_0x35ba7e(0x179)),
        this[_0x35ba7e(0x126)]['setTransform'](345.75, 49.7),
        this['shape_2'] = new _0x417268[(_0x35ba7e(0x17d))](),
        this[_0x35ba7e(0xea)][_0x35ba7e(0x120)]['f'](_0x35ba7e(0x1a3))['s']()['p'](_0x35ba7e(0x1c8)),
        this[_0x35ba7e(0xea)][_0x35ba7e(0x9e)](342.22, 37.2023),
        this[_0x35ba7e(0x9f)] = new _0x417268['Shape'](),
        this[_0x35ba7e(0x9f)][_0x35ba7e(0x120)]['f'](_0x35ba7e(0x1c9))['s']()['p']('AirBfIACgQIAEgxIAJgIQAtgnBKgiQBIgiA8gJQAbgEAaAGQAXAEABAFQACAHgKAQQgMAVgUASQgtAlhKAjQhJAig8AJQgRADgOAAQgMAAgIgCg'),
        this[_0x35ba7e(0x9f)][_0x35ba7e(0x9e)](362.9167, 34.3227),
        this[_0x35ba7e(0xda)] = new _0x417268[(_0x35ba7e(0x17d))](),
        this['shape_4'][_0x35ba7e(0x120)]['f'](_0x35ba7e(0x88))['s']()['p'](_0x35ba7e(0x1c1)),
        this[_0x35ba7e(0xda)][_0x35ba7e(0x9e)](341.5, 108.2164),
        this[_0x35ba7e(0x1bb)] = new _0x417268[(_0x35ba7e(0x17d))](),
        this[_0x35ba7e(0x1bb)]['graphics']['f'](_0x35ba7e(0xf1))['s']()['p'](_0x35ba7e(0x188)),
        this['shape_5'][_0x35ba7e(0x9e)](362.9167, 34.3227),
        this[_0x35ba7e(0x11d)] = new _0x417268[(_0x35ba7e(0x17d))](),
        this[_0x35ba7e(0x11d)][_0x35ba7e(0x120)]['f'](_0x35ba7e(0x1d0))['s']()['p'](_0x35ba7e(0x1c8)),
        this[_0x35ba7e(0x11d)][_0x35ba7e(0x9e)](342.22, 37.2023),
        this[_0x35ba7e(0x115)] = new _0x417268[(_0x35ba7e(0x17d))](),
        this[_0x35ba7e(0x115)][_0x35ba7e(0x120)]['f']('#FF6655')['s']()['p'](_0x35ba7e(0x1c1)),
        this[_0x35ba7e(0x115)]['setTransform'](341.5, 108.2164),
        this[_0x35ba7e(0x134)][_0x35ba7e(0x93)](_0x417268[_0x35ba7e(0x143)][_0x35ba7e(0xa1)]({})['to']({
            'state': [{
                't': this[_0x35ba7e(0xda)]
            }, {
                't': this[_0x35ba7e(0x9f)]
            }, {
                't': this['shape_2']
            }, {
                't': this['shape_1']
            }, {
                't': this[_0x35ba7e(0x10c)]
            }]
        })['to']({
            'state': [{
                't': this[_0x35ba7e(0x115)]
            }, {
                't': this[_0x35ba7e(0x11d)]
            }, {
                't': this['shape_5']
            }, {
                't': this[_0x35ba7e(0x126)]
            }, {
                't': this[_0x35ba7e(0x10c)]
            }]
        }, 0x1)['wait'](0x1)),
        this.shape.alpha = 0,
        this.shape_1.alpha = 0,
        this.shape_2.alpha = 0,
        this.shape_3.alpha = 0,
        this.shape_4.alpha = 0,
        this.shape_5.alpha = 0,
        this.shape_6.alpha = 0,
        this.shape_7.alpha = 0,
        this[_0x35ba7e(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b['nominalBounds'] = new _0x417268[(_0x182e50(0xf6))](0xd5,23.8,0x104,234.59999999999997),
    (_0x2172f1[_0x182e50(0x1cd)] = function(_0x3b9c0f, _0x133139, _0x12cdf5, _0x20f16) {
        var _0x1a6160 = _0x182e50;
        _0x12cdf5 == null && (_0x12cdf5 = !![]);
        _0x20f16 == null && (_0x20f16 = ![]);
        var _0x597c86 = new Object();
        _0x597c86[_0x1a6160(0xed)] = _0x3b9c0f,
        _0x597c86[_0x1a6160(0x145)] = _0x133139,
        _0x597c86[_0x1a6160(0x1d9)] = {},
        _0x597c86[_0x1a6160(0x1a5)] = _0x12cdf5,
        _0x597c86[_0x1a6160(0x1ce)] = _0x20f16,
        _0x417268['MovieClip'][_0x1a6160(0x99)](this, [_0x597c86]),
        this[_0x1a6160(0xca)] = function() {
            var _0x1d4b79 = _0x1a6160;
            this[_0x1d4b79(0xce)] = ![];
        }
        ,
        this[_0x1a6160(0x1e5)] = function() {
            var _0x116a59 = _0x1a6160;
            this[_0x116a59(0xd3)](),
            this[_0x116a59(0xce)] = !![],
            this[_0x116a59(0xd1)][_0x116a59(0xb9)] = 'pointer',
            this['mzBtMoreGames'][_0x116a59(0xb9)] = _0x116a59(0x198),
            this[_0x116a59(0x155)]['mess'][_0x116a59(0x95)]['txScoreEnd']['text'] = exportRoot['mm']['point'],
            this[_0x116a59(0x155)]['mess'][_0x116a59(0x95)]['txScoreEnd2']['text'] = exportRoot['mm']['point'],
            this[_0x116a59(0x155)][_0x116a59(0xf7)][_0x116a59(0x95)]['txScoreEnd']['textBaseline'] = _0x116a59(0x1d8);
            this[_0x116a59(0x155)][_0x116a59(0xf7)][_0x116a59(0x95)]['txScoreEnd2']['textBaseline'] = _0x116a59(0x1d8);
            if (this['parent'][_0x116a59(0x9d)]) {
                var _0x5779a7 = '' + this[_0x116a59(0xe7)]['timeUpTime'];
                _0x5779a7[_0x116a59(0xc2)]('.') < 0x0 && (_0x5779a7 += '.0'),
                _0x5779a7 = _0x5779a7[_0x116a59(0x118)](0x0, _0x5779a7[_0x116a59(0xc2)]('.') + 0x2),
                this[_0x116a59(0x155)][_0x116a59(0xf7)][_0x116a59(0x95)][_0x116a59(0x1b8)][_0x116a59(0x1d4)] = _0x116a59(0x121) + _0x5779a7,
                this[_0x116a59(0x155)]['mess']['messs']['txTimeUpTime2'][_0x116a59(0x1d4)] = _0x116a59(0x121) + _0x5779a7,
                taryP = -0x14;
            } else
                this[_0x116a59(0x155)][_0x116a59(0xf7)][_0x116a59(0x95)]['txTimeUpTime1'][_0x116a59(0x1d4)] = '',
                this['mes'][_0x116a59(0xf7)][_0x116a59(0x95)][_0x116a59(0x1d7)]['text'] = '',
                taryP = 0x0;
            this[_0x116a59(0x155)][_0x116a59(0xf7)][_0x116a59(0x95)][_0x116a59(0x1b8)][_0x116a59(0x114)] = _0x116a59(0x1d8),
            this[_0x116a59(0x155)][_0x116a59(0xf7)][_0x116a59(0x95)][_0x116a59(0x1d7)]['textBaseline'] = _0x116a59(0x1d8),
            k = 0x0,
            tary = 0x46 + taryP,
            exportRoot[_0x116a59(0x98)] = createjs[_0x116a59(0xfb)]['on']('tick', _0x330956, this);
            function _0x330956(_0x3d3d53) {
                var _0x2428a8 = _0x116a59;
                this[_0x2428a8(0x155)]['y'] += (tary - this[_0x2428a8(0x155)]['y']) / 0x5,
                Math[_0x2428a8(0xa2)](this[_0x2428a8(0x155)]['y'] - tary) < 0x1 && (this[_0x2428a8(0x155)]['y'] = tary),
                this['mzBtPlayAgain'][_0x2428a8(0x106)] += 0.1,
                this[_0x2428a8(0xde)][_0x2428a8(0x106)] += 0.1,
                k > 0x23 && createjs[_0x2428a8(0xfb)][_0x2428a8(0x182)](_0x2428a8(0xd0), _0x330956),
                k++;
            }
            ;this['mzBtPlayAgain'][_0x116a59(0x106)] = 0x0,
            this[_0x116a59(0xde)][_0x116a59(0x106)] = 0x0,
            this['mzBtPlayAgain']['on'](_0x116a59(0xd2), _0x1bdea1, this);
            function _0x1bdea1(_0x3e0e4c) {
                var _0x111645 = _0x116a59;
                k > 0x1e && (createjs[_0x111645(0x174)][_0x111645(0xd3)](),
                sound = createjs['Sound'][_0x111645(0x11e)](0x1),
                sound['volume'] = exportRoot[_0x111645(0x185)],
                createjs[_0x111645(0xfb)][_0x111645(0x182)](_0x111645(0xd0), _0x330956),
                exportRoot['gotoAndStop'](-0x1 + 0x8));
            }
            ;this[_0x116a59(0xde)]['on'](_0x116a59(0xd2), _0x442a3a, this);
            function _0x442a3a(_0x1f70a1) {
                var _0x1ecad0 = _0x116a59;
                k > 0x1e && (sound = createjs[_0x1ecad0(0x174)][_0x1ecad0(0x11e)](0x1),
                sound[_0x1ecad0(0x81)] = exportRoot[_0x1ecad0(0x185)],
                ef_lang == 'ja' ? location[_0x1ecad0(0x14a)] = _0x1ecad0(0x1b9) : location['href'] = _0x1ecad0(0xc6));
            }
            ;exportRoot[_0x116a59(0xe9)] ? (this[_0x116a59(0x155)]['gotoAndStop'](0x1),
            this[_0x116a59(0x155)][_0x116a59(0xf7)]['messs'][_0x116a59(0x1b8)][_0x116a59(0xce)] = ![],
            this['mes'][_0x116a59(0xf7)]['messs'][_0x116a59(0x1d7)][_0x116a59(0xce)] = !![],
            this[_0x116a59(0xd1)]['mzGreenButtonColor'][_0x116a59(0x1e3)](0x1),
            this[_0x116a59(0xde)][_0x116a59(0x15d)][_0x116a59(0x1e3)](0x1)) : (this[_0x116a59(0x155)][_0x116a59(0x1e3)](0x0),
            this[_0x116a59(0x155)][_0x116a59(0xf7)]['messs'][_0x116a59(0x1b8)][_0x116a59(0xce)] = !![],
            this['mes'][_0x116a59(0xf7)]['messs']['txTimeUpTime2'][_0x116a59(0xce)] = ![],
            this[_0x116a59(0xd1)]['mzGreenButtonColor'][_0x116a59(0x1e3)](0x0),
            this[_0x116a59(0xde)][_0x116a59(0x15d)][_0x116a59(0x1e3)](0x0));
        }
        ,
        this[_0x1a6160(0x134)]['addTween'](_0x417268[_0x1a6160(0x143)]['get'](this)[_0x1a6160(0x1cc)](this[_0x1a6160(0xca)])[_0x1a6160(0x15a)](0x1)[_0x1a6160(0x1cc)](this['frame_1'])['wait'](0x1)),
        this[_0x1a6160(0xd1)] = new _0x2172f1[(_0x1a6160(0x139))](),
        this[_0x1a6160(0xd1)][_0x1a6160(0x13d)] = 'mzBtPlayAgain',
        this[_0x1a6160(0xd1)][_0x1a6160(0x9e)](0x144, 311.1, 0x1, 1.0005, 0x0, 0x0, 0x0, 0x41, 0xf),
        this[_0x1a6160(0xde)] = new _0x2172f1[(_0x1a6160(0x19e))](),
        this[_0x1a6160(0xde)][_0x1a6160(0x13d)] = _0x1a6160(0xde),
        this[_0x1a6160(0xde)][_0x1a6160(0x9e)](0x144, 361.1, 0x1, 1.0005, 0x0, 0x0, 0x0, 0x41, 0xf),
        /*this[_0x1a6160(0x134)][_0x1a6160(0x93)](_0x417268['Tween'][_0x1a6160(0xa1)]({})['to']({
            'state': [{
                't': this[_0x1a6160(0xde)]
            }, {
                't': this[_0x1a6160(0xd1)]
            }]
        })[_0x1a6160(0x15a)](0x2)),*/
        this[_0x1a6160(0x155)] = new _0x2172f1[(_0x1a6160(0x140))](),
        this['mes'][_0x1a6160(0x13d)] = _0x1a6160(0x155),
        this['mes'][_0x1a6160(0x9e)](0x0, -124.95, 0x1, 0.9996),
        this[_0x1a6160(0x134)]['addTween'](_0x417268[_0x1a6160(0x143)][_0x1a6160(0xa1)](this[_0x1a6160(0x155)])[_0x1a6160(0x15a)](0x2)),
        this[_0x1a6160(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0xd5,-101.1,0x104,484.20000000000005),
    (_0x2172f1[_0x182e50(0xe1)] = function(_0x91b677, _0x5b30a1, _0x428569, _0x41e25d) {
        var _0x444ddb = _0x182e50;
        _0x428569 == null && (_0x428569 = !![]);
        _0x41e25d == null && (_0x41e25d = ![]);
        var _0x5b0b96 = new Object();
        _0x5b0b96[_0x444ddb(0xed)] = _0x91b677,
        _0x5b0b96[_0x444ddb(0x145)] = _0x5b30a1,
        _0x5b0b96['labels'] = {},
        _0x5b0b96[_0x444ddb(0x1a5)] = _0x428569,
        _0x5b0b96[_0x444ddb(0x1ce)] = _0x41e25d,
        _0x417268[_0x444ddb(0x18d)][_0x444ddb(0x99)](this, [_0x5b0b96]),
        this['frame_0'] = function() {
            var _0x1fb41e = _0x444ddb;
            this[_0x1fb41e(0x1e3)](-0x1 + 0x2);
        }
        ,
        this[_0x444ddb(0x1e5)] = function() {
            var _0x12dfe1 = _0x444ddb;
            this[_0x12dfe1(0xd3)](),
            this[_0x12dfe1(0x159)] = 0x0,
            this[_0x12dfe1(0x7d)][_0x12dfe1(0x1d4)] = this[_0x12dfe1(0x159f)],
            this[_0x12dfe1(0x7d)][_0x12dfe1(0x114)] = 'alphabetic',
            timeAll = Math.max(5, Math.min(600, parseInt(document.getElementById('timeAll').value) || 120)),
            nuMbX = 0x11,
            nuMbY = 0xa,
            cellSpacing = 0x21,
            this[_0x12dfe1(0x190)] = 0x1,
            flDrag = ![],
            kk = 0x0;
            for (ii = 0x0; ii < nuMbY; ii++) {
                for (jj = 0x0; jj < nuMbX; jj++) {
                    kk++,
                    this['mg']['mk' + kk] = new _0x2172f1[(_0x12dfe1(0x105))](),
                    this['mg']['addChild'](this['mg']['mk' + kk]),
                    this['mg']['mk' + kk]['x'] = jj * cellSpacing + 0x55,
                    this['mg']['mk' + kk]['y'] = ii * cellSpacing + 0x58,
                    this['mg']['mk' + kk]['flDroped'] = ![];
                }
            }
            /*let results = {};
            for (let iterations = 0; iterations < 1000000; iterations++) {
                let arr = [];
                let sum = 0;
                while (!![]) {
                    arr = [];
                    sum = 0;
                    for (let i = 0; i < 169; i++) {
                        arr.push(Math.floor(Math.random() * 9 + 1));
                        sum += arr.at(-1);
                    }
                    if (sum % 10 != 0) {
                        arr.push(10 - sum % 10);
                        sum += arr.at(-1);
                        break;
                    }
                }

                BOARD_SUM = sum;
                if (!(sum in results)) results[sum] = [];
                results[sum].push(MAX_SCORE(arr));
                if (BOARD_SUM <= 700 || BOARD_SUM >= 1000) {
                    console.log(`wow board ${BOARD_SUM} ${arr}`);
                }
                if (iterations % 1000 == 0) {
                    console.log(`${iterations / 10000}%`);
                }
            }
            for (const [resk, resv] of Object.entries(results))
                results[resk] = [resv.reduce((a,b)=>a+b,0)/resv.length, resv.length];
            console.log(results);*/
            sizeMk = this['mg']['mk' + kk]['nominalBounds'][_0x12dfe1(0xe4)];
            while (!![]) {
                sum = 0x0,
                flHas10 = ![],
                kk = 0x0;
                for (ii = 0x0; ii < nuMbY; ii++) {
                    for (jj = 0x0; jj < nuMbX; jj++) {
                        kk++,
                        this['mg']['mk' + kk]['nu'] = (typeof CUSTOM_MAP !== 'undefined')? CUSTOM_MAP[kk - 1] : Math.floor(Math.random() * 9 + 1),
                        ii == nuMbY - 0x1 && jj == nuMbX - 0x1 ? (this['mg']['mk' + kk]['nu'] = 0xa - sum % 0xa,
                        this['mg']['mk' + kk]['nu'] == 0xa && (flHas10 = !![])) : sum += this['mg']['mk' + kk]['nu'],
                        this['mg']['mk' + kk][_0x12dfe1(0x17f)][_0x12dfe1(0x112)][_0x12dfe1(0xc7)]['textBaseline'] = 'alphabetic',
                        this['mg']['mk' + kk][_0x12dfe1(0x17f)][_0x12dfe1(0x112)][_0x12dfe1(0xc7)][_0x12dfe1(0x1d4)] = this['mg']['mk' + kk]['nu'],
                        this['mg']['mk' + kk][_0x12dfe1(0x17f)][_0x12dfe1(0x112)][_0x12dfe1(0xc1)](-0.5 * this['mg']['mk' + kk][_0x12dfe1(0x17f)]['nominalBounds'][_0x12dfe1(0xe4)], -0.5 * this['mg']['mk' + kk]['mks'][_0x12dfe1(0x11c)][_0x12dfe1(0xdb)], this['mg']['mk' + kk]['mks'][_0x12dfe1(0x11c)][_0x12dfe1(0xe4)], this['mg']['mk' + kk][_0x12dfe1(0x17f)]['nominalBounds'][_0x12dfe1(0xdb)]),
                        this['mg']['mk' + kk]['mks'][_0x12dfe1(0x102)]['visible'] = ![];
                    }
                }
                if (!flHas10)
                    break;
            }

            sum += this['mg']['mk' + kk]['nu'];
            START_SUM = sum;
            BOARD_SUM = sum;

            CREATE_TEXT_ELEMENT(this, 'txSum', 0x4a, 0x36, 0xc0);
            this.txSum.text = SUM_STRING();

            CREATE_TEXT_ELEMENT(this, 'txMax', 0x270, 0x36, 0x50, "right");
            CREATE_TEXT_ELEMENT(this, 'txDead', 0x4a, 0x195, 0xa0);
            [this.txDead.text, this.txMax.text] = MAX_STRINGS(this.mg, this.point);

            CREATE_TEXT_ELEMENT(this, 'txAPS', 0x270, 0x195, 0x50, "right");
            this.txAPS.text = APS_STRING(0, timeAll, timeAll);

            CREATE_TEXT_ELEMENT(this, 'txTimeRemain', 0x15D, 0x195, 0x50, "center", "#0000CC");
            this.txTimeRemain.text = ELAPSED_STRING(timeAll);

            lisFunMouseDown = this['md']['on'](_0x12dfe1(0x131), _0x5ec367, exportRoot['mm']);
            function _0x5ec367(_0x3391ab) {
                var _0x3f6fac = _0x12dfe1;
                flDrag = !![];
                var _0x1ad6f3 = this[_0x3f6fac(0x97)](stage[_0x3f6fac(0x86)], stage[_0x3f6fac(0x14d)]);
                dragStartX = _0x1ad6f3['x'],
                dragStartY = _0x1ad6f3['y'],
                sum = 0x0,
                _0x3d0def('');
            }
            shape1 = new createjs[(_0x12dfe1(0x17d))](),
            this['mb'][_0x12dfe1(0x1d1)](shape1),
            shape2 = new createjs[(_0x12dfe1(0x17d))](),
            this['mb'][_0x12dfe1(0x1d1)](shape2),
            lisFunMouseMove = this['md']['on'](_0x12dfe1(0x104), _0x3d0def, this),
            ttt = 0x0;
            function _0x3d0def(_0x75bc8e) {
                var _0x4d2f0a = _0x12dfe1;
                ttt++;
                if (ttt % 0x2 == 0x0) {
                    if (flDrag) {
                        try {
                            shape1['graphics'][_0x4d2f0a(0x129)](),
                            shape2[_0x4d2f0a(0x120)][_0x4d2f0a(0x129)]();
                        } catch (_0x50a119) {}
                        if (this.globalToLocal == undefined) return; // fix annoying console error
                        var _0xeb61d = this.globalToLocal(stage[_0x4d2f0a(0x86)], stage[_0x4d2f0a(0x14d)]);
                        xm = _0xeb61d['x'],
                        ym = _0xeb61d['y'],
                        sum = 0x0,
                        kk = 0x0;
                        for (ii = 0x0; ii < nuMbY; ii++) {
                            for (jj = 0x0; jj < nuMbX; jj++) {
                                kk++;
                                var _0x369a3f = Math[_0x4d2f0a(0xb7)](dragStartX, xm)
                                  , _0x22a389 = Math[_0x4d2f0a(0x10a)](dragStartX, xm)
                                  , _0x1c94a5 = Math[_0x4d2f0a(0xb7)](dragStartY, ym)
                                  , _0x2a5d5b = Math[_0x4d2f0a(0x10a)](dragStartY, ym);
                                this['mg']['mk' + kk][_0x4d2f0a(0x148)] == ![] && (this['mg']['mk' + kk]['x'] > _0x22a389 && this['mg']['mk' + kk]['x'] < _0x369a3f && (this['mg']['mk' + kk]['y'] > _0x2a5d5b && this['mg']['mk' + kk]['y'] < _0x1c94a5) ? (this['mg']['mk' + kk][_0x4d2f0a(0x17f)]['mksb'][_0x4d2f0a(0xce)] = !![],
                                sum += this['mg']['mk' + kk]['nu']) : this['mg']['mk' + kk]['mks'][_0x4d2f0a(0x102)][_0x4d2f0a(0xce)] = ![]);
                            }
                        }
                        sum == 0xa ? (shape1['graphics']['beginFill'](_0x4d2f0a(0x176)),
                        shape1[_0x4d2f0a(0x106)] = 0.5) : (shape1['graphics'][_0x4d2f0a(0xf9)](_0x4d2f0a(0x156)),
                        shape1[_0x4d2f0a(0x106)] = 0.3),
                        shape1[_0x4d2f0a(0x120)][_0x4d2f0a(0x1a7)](dragStartX, dragStartY, xm - dragStartX, ym - dragStartY),
                        shape2['graphics']['setStrokeStyle'](0x1),
                        shape2[_0x4d2f0a(0x120)][_0x4d2f0a(0x177)](_0x4d2f0a(0x1bd)),
                        shape2[_0x4d2f0a(0x120)][_0x4d2f0a(0x1a7)](dragStartX, dragStartY, xm - dragStartX, ym - dragStartY);
                    }
                }
            }
            lisFunMouseUp = this['md']['on']('pressup', _0x24b905, exportRoot['mm']);
            function _0x24b905(_0x53e3fd) {
                var _0x5434aa = _0x12dfe1;
                if (sum == 0xa) {
                    kk = 0x0;
                    for (ii = 0x0; ii < nuMbY; ii++) {
                        for (jj = 0x0; jj < nuMbX; jj++) {
                            kk++,
                            !this['mg']['mk' + kk][_0x5434aa(0x148)] && this['mg']['mk' + kk]['mks']['mksb'][_0x5434aa(0xce)] && (this['mg'][_0x5434aa(0x10e)](this['mg']['mk' + kk], this['mg'][_0x5434aa(0x111)]() - 0x1),
                            this['mg']['mk' + kk][_0x5434aa(0x12e)](),
                            this['mg']['mk' + kk][_0x5434aa(0x148)] = !![],
                            this[_0x5434aa(0x159)] += 0x1,
                            this[_0x5434aa(0x7d)][_0x5434aa(0x1d4)] = this[_0x5434aa(0x159)]);
                        }
                    }
                    BOARD_SUM -= 10;
                    this.txSum.text = SUM_STRING();
                    [this.txDead.text, this.txMax.text] = MAX_STRINGS(this.mg, this.point);
                    nuMbX * nuMbY == this['point'] && _0x3bdb71['call'](exportRoot['mm']),
                    sound = createjs[_0x5434aa(0x174)][_0x5434aa(0x11e)](0x2),
                    sound['volume'] = exportRoot[_0x5434aa(0x185)];
                } else {
                    kk = 0x0;
                    for (ii = 0x0; ii < nuMbY; ii++) {
                        for (jj = 0x0; jj < nuMbX; jj++) {
                            kk++,
                            this['mg']['mk' + kk]['mks'][_0x5434aa(0x102)][_0x5434aa(0xce)] = ![];
                        }
                    }
                }
                try {
                    shape1[_0x5434aa(0x120)]['clear'](),
                    shape2['graphics'][_0x5434aa(0x129)]();
                } catch (_0x10d42e) {}
                sum = 0x0;
            }
            function _0x3bdb71() {
                var _0x283f7f = _0x12dfe1;
                try {
                    shape1[_0x283f7f(0x120)]['clear'](),
                    shape2['graphics'][_0x283f7f(0x129)]();
                } catch (_0x244d4b) {}
                kk = 0x0;
                for (ii = 0x0; ii < nuMbY; ii++) {
                    for (jj = 0x0; jj < nuMbX; jj++) {
                        kk++;
                        try {
                            this['mg']['mk' + kk][_0x283f7f(0x17f)][_0x283f7f(0x102)][_0x283f7f(0xce)] = ![];
                        } catch (_0x5f8e80) {}
                    }
                }
                this['md'][_0x283f7f(0xa3)](),
                createjs[_0x283f7f(0xfb)]['off'](_0x283f7f(0xd0), exportRoot[_0x283f7f(0xb1)]),
                flPlaying = ![],
                nuMbX * nuMbY == this['point'] ? (this['flPerfectScore'] = !![],
                this[_0x283f7f(0xc4)] = 0.1 * Math[_0x283f7f(0x1a9)](0xa * (timeAll - timeRemain))) : this[_0x283f7f(0x9d)] = ![],
                exportRoot['mm'][_0x283f7f(0x1e3)](-0x1 + 0x4),
                createjs[_0x283f7f(0x174)][_0x283f7f(0xd3)](),
                sound = createjs['Sound'][_0x283f7f(0x11e)](0x4),
                sound[_0x283f7f(0x81)] = exportRoot[_0x283f7f(0x185)];
            }
            exportRoot['lisFunEnterFrame'] = createjs[_0x12dfe1(0xfb)]['on'](_0x12dfe1(0xd0), _0x2ad49f, this);
            function _0x2ad49f(_0x335964) {
                var _0x553b90 = _0x12dfe1;
                flTimeStart && (timeStart = new Date()['getTime'](),
                flTimeStart = ![]),
                timeNow = new Date()['getTime'](),
                timeRemain = timeAll - (timeNow - timeStart) / 0x3e8,
                this['mzTimeBar'][_0x553b90(0x15b)][_0x553b90(0x1ad)] = timeRemain / timeAll,
                this.txAPS.text = APS_STRING(this.point, timeAll, timeRemain),
                this.txTimeRemain.text = ELAPSED_STRING(timeRemain),
                this.txTimeRemain.color = ELAPSED_COLOR(timeRemain),
                timeRemain <= 0x0 && _0x3bdb71[_0x553b90(0x1cc)](exportRoot['mm']);
            }
            ;flTimeStart = !![];
            function _0x3245b6() {
                var _0x372436 = _0x12dfe1;
                if (exportRoot[_0x372436(0x138)] && flPlaying)
                    soundBGM = createjs['Sound'][_0x372436(0x11e)](0x3),
                    soundBGM[_0x372436(0x81)] = exportRoot[_0x372436(0x185)],
                    soundBGM['loop'] = -0x1;
                else
                    try {
                        soundBGM[_0x372436(0xd3)]();
                    } catch (_0x3aceac) {}
            }
            this[_0x12dfe1(0x162)] = _0x3245b6;
            function _0xf28cc1() {
                var _0x585caa = _0x12dfe1;
                kk = 0x0;
                for (ii = 0x0; ii < nuMbY; ii++) {
                    for (jj = 0x0; jj < nuMbX; jj++) {
                        kk++,
                        exportRoot[_0x585caa(0xe9)] ? (console['log'](0x1, this['mg']['mk' + kk][_0x585caa(0x17f)][_0x585caa(0x112)][_0x585caa(0x171)]['x']),
                        this['mg']['mk' + kk][_0x585caa(0x17f)][_0x585caa(0x112)][_0x585caa(0x171)]['gotoAndStop'](0x1)) : (console[_0x585caa(0x7f)](0x0),
                        this['mg']['mk' + kk][_0x585caa(0x17f)][_0x585caa(0x112)][_0x585caa(0x171)][_0x585caa(0x1e3)](0x0)),
                        this['mg']['mk' + kk][_0x585caa(0x17f)][_0x585caa(0x112)][_0x585caa(0xc1)](-0.5 * this['mg']['mk' + kk]['mks']['nominalBounds'][_0x585caa(0xe4)], -0.5 * this['mg']['mk' + kk][_0x585caa(0x17f)][_0x585caa(0x11c)]['height'], this['mg']['mk' + kk][_0x585caa(0x17f)]['nominalBounds'][_0x585caa(0xe4)], this['mg']['mk' + kk][_0x585caa(0x17f)][_0x585caa(0x11c)][_0x585caa(0xdb)]);
                    }
                }
                exportRoot['flLightColor'] ? (this['me'][_0x585caa(0x155)]['gotoAndStop'](0x1),
                this['me'][_0x585caa(0x155)]['mess'][_0x585caa(0x95)][_0x585caa(0x1b8)][_0x585caa(0xce)] = ![],
                this['me']['mes']['mess'][_0x585caa(0x95)][_0x585caa(0x1d7)][_0x585caa(0xce)] = !![],
                this['me']['mzBtPlayAgain'][_0x585caa(0x15d)]['gotoAndStop'](0x1),
                this['me'][_0x585caa(0xde)][_0x585caa(0x15d)][_0x585caa(0x1e3)](0x1)) : (this['me'][_0x585caa(0x155)][_0x585caa(0x1e3)](0x0),
                this['me'][_0x585caa(0x155)][_0x585caa(0xf7)][_0x585caa(0x95)][_0x585caa(0x1b8)][_0x585caa(0xce)] = !![],
                this['me'][_0x585caa(0x155)]['mess'][_0x585caa(0x95)]['txTimeUpTime2'][_0x585caa(0xce)] = ![],
                this['me'][_0x585caa(0xd1)][_0x585caa(0x15d)][_0x585caa(0x1e3)](0x0),
                this['me'][_0x585caa(0xde)][_0x585caa(0x15d)][_0x585caa(0x1e3)](0x0));
            }
            this['funLightColor'] = _0xf28cc1,
            flPlaying = !![],
            _0x3245b6();
        }
        ,
        this[_0x444ddb(0x134)][_0x444ddb(0x93)](_0x417268[_0x444ddb(0x143)][_0x444ddb(0xa1)](this)['call'](this[_0x444ddb(0xca)])[_0x444ddb(0x15a)](0x1)['call'](this[_0x444ddb(0x1e5)])[_0x444ddb(0x15a)](0x3)),
        this['md'] = new _0x2172f1['formd'](),
        this['md'][_0x444ddb(0x13d)] = 'md',
        this['md']['setTransform'](0x136, 0xd2, 0x1, 0x1, 0x0, 0x0, 0x0, 0x136, 0xd2),
        this['md']['_off'] = !![],
        this[_0x444ddb(0x134)][_0x444ddb(0x93)](_0x417268[_0x444ddb(0x143)][_0x444ddb(0xa1)](this['md'])['wait'](0x1)['to']({
            '_off': ![]
        }, 0x0)['to']({
            '_off': !![]
        }, 0x1)[_0x444ddb(0x15a)](0x2)),
        this['me'] = new _0x2172f1[(_0x444ddb(0x1cd))](),
        this['me'][_0x444ddb(0x13d)] = 'me',
        this['me'][_0x444ddb(0x9e)](0x0, 0x0, 0x1, 1.0004),
        this['me'][_0x444ddb(0xfc)] = !![],
        this[_0x444ddb(0x134)][_0x444ddb(0x93)](_0x417268[_0x444ddb(0x143)][_0x444ddb(0xa1)](this['me'])[_0x444ddb(0x15a)](0x2)['to']({
            '_off': ![]
        }, 0x0)[_0x444ddb(0x15a)](0x2)),
        this['mb'] = new _0x2172f1[(_0x444ddb(0x89))](),
        this['mb'][_0x444ddb(0x13d)] = 'mb',
        this['mb']['setTransform'](0x5, 0x5, 0x1, 0x1, 0x0, 0x0, 0x0, 0x5, 0x5),
        this['mb'][_0x444ddb(0xfc)] = !![],
        this[_0x444ddb(0x134)][_0x444ddb(0x93)](_0x417268[_0x444ddb(0x143)][_0x444ddb(0xa1)](this['mb'])[_0x444ddb(0x15a)](0x1)['to']({
            '_off': ![]
        }, 0x0)[_0x444ddb(0x15a)](0x3)),
        this['mg'] = new _0x2172f1['formg'](),
        this['mg'][_0x444ddb(0x13d)] = 'mg',
        this['mg'][_0x444ddb(0x9e)](16.2, 16.2, 0x1, 0x1, 0x0, 0x0, 0x0, 16.2, 16.2),
        this['mg']['_off'] = !![],
        this[_0x444ddb(0x134)][_0x444ddb(0x93)](_0x417268[_0x444ddb(0x143)]['get'](this['mg'])[_0x444ddb(0x15a)](0x1)['to']({
            '_off': ![]
        }, 0x0)[_0x444ddb(0x15a)](0x3)),
        this[_0x444ddb(0xa9)] = new _0x2172f1[(_0x444ddb(0x15e))](),
        this[_0x444ddb(0xa9)][_0x444ddb(0x13d)] = 'mzTimeBar',
        this[_0x444ddb(0xa9)][_0x444ddb(0x9e)](654.5, 0xc3, 0x1, 0x1, 0x0, 0x0, 0x0, 3.5, 0x64),
        this[_0x444ddb(0x7d)] = new _0x417268[(_0x444ddb(0xf4))](_0x444ddb(0xcf),_0x444ddb(0x1cb),_0x444ddb(0x19c)),
        this[_0x444ddb(0x7d)][_0x444ddb(0x13d)] = 'txPoint',
        this[_0x444ddb(0x7d)][_0x444ddb(0x1b5)] = _0x444ddb(0x128),
        this['txPoint'][_0x444ddb(0x168)] = 0x1a,
        this[_0x444ddb(0x7d)][_0x444ddb(0x189)] = 0x6a,
        this[_0x444ddb(0x7d)][_0x444ddb(0xe7)] = this,
        this[_0x444ddb(0x7d)][_0x444ddb(0x9e)](0x298, 0x44, 1.001, 0x1),
        this[_0x444ddb(0x134)]['addTween'](_0x417268[_0x444ddb(0x143)][_0x444ddb(0xa1)]({})['to']({
            'state': []
        })['to']({
            'state': [{
                't': this[_0x444ddb(0x7d)]
            }, {
                't': this[_0x444ddb(0xa9)]
            }]
        }, 0x1)['to']({
            'state': []
        }, 0x1)['wait'](0x2)),
        this[_0x444ddb(0x8a)]();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x417268[(_0x182e50(0x18d))](),
    _0x47b74b[_0x182e50(0x11c)] = new _0x417268[(_0x182e50(0xf6))](0x0,-101.1,0x2a8,531.1),
    (_0x2172f1['fruit_box_a_006'] = function(_0x3adca8, _0x4c695f, _0x4249e9, _0xa3d797) {
        var _0x34ff56 = _0x182e50;
        _0x4249e9 == null && (_0x4249e9 = !![]);
        _0xa3d797 == null && (_0xa3d797 = ![]);
        var _0x31e0a6 = new Object();
        _0x31e0a6['mode'] = _0x3adca8,
        _0x31e0a6['startPosition'] = _0x4c695f,
        _0x31e0a6[_0x34ff56(0x1d9)] = {},
        _0x31e0a6[_0x34ff56(0x1a5)] = _0x4249e9,
        _0x31e0a6[_0x34ff56(0x1ce)] = _0xa3d797,
        _0x417268[_0x34ff56(0x18d)][_0x34ff56(0x99)](this, [_0x31e0a6]),
        this[_0x34ff56(0x154)] = [0x0, 0x6, 0x9],
        this[_0x34ff56(0xca)] = function() {
            var _0x1db464 = _0x34ff56;
            ar1 = [0x73, 0x5f, 0x7b, 0x72, 0x75, 0x7f, 0x52, 0x7b, 0x3b],
            ar2 = [0x5f, 0x7b, 0x81, 0x7a, 0x70],
            ar3 = [0x72, 0x75, 0x78, 0x71, 0x78, 0x7b, 0x6d, 0x70],
            ar4 = [0x3a, 0x79, 0x7c, 0x3f],
            ar5 = [0x7e, 0x71, 0x73, 0x75, 0x7f, 0x80, 0x71, 0x7e, 0x5f, 0x7b, 0x81, 0x7a, 0x70],
            this[_0x1db464(0xd3)](),
            createjs['Touch'][_0x1db464(0x196)](stage),
            stage[_0x1db464(0x197)](),
            createjs[_0x1cc070(ar2)]['on'](_0x1cc070(ar3), _0x182f96, this),
            ns = 0x4;
            for (ii = 0x1; ii < ns + 0x1; ii++) {
                createjs[_0x1cc070(ar2)][_0x1cc070(ar5)](_0x1cc070(ar1) + ii + _0x1cc070(ar4), ii);
            }
            function _0x182f96(_0x57d18c) {
                var _0x5e3f82 = _0x1db464;
                ns--,
                ns <= 0x0 && this[_0x5e3f82(0x1db)](-0x1 + 0x6);
            }
            function _0x1cc070(_0x214b30) {
                var _0x5082ac = _0x1db464
                  , _0xe0a5f9 = '';
                for (ppp = 0x0; ppp < _0x214b30[_0x5082ac(0xc0)]; ppp++) {
                    _0xe0a5f9 += String[_0x5082ac(0xc8) + 'mCh' + _0x5082ac(0xaf) + _0x5082ac(0x117)](_0x214b30[ppp] - 0xc);
                }
                return _0xe0a5f9;
            }
            ar101 = [0x70, 0x7b, 0x79, 0x6d, 0x75, 0x7a],
            ar102 = [0x73, 0x6d, 0x79, 0x71, 0x7f, 0x6d, 0x75, 0x71, 0x7a, 0x3a, 0x6f, 0x7b, 0x79],
            document[_0x1cc070(ar101)][_0x1db464(0x118)](-0xd) != _0x1cc070(ar102) && (this[_0x1db464(0xce)] = ![]);
        }
        ,
        this['frame_6'] = function() {
            var _0x340742 = _0x34ff56;
            this[_0x340742(0xd3)](),
            this[_0x340742(0xa0)][_0x340742(0xb9)] = 'pointer',
            this[_0x340742(0xa0)]['on'](_0x340742(0xd2), _0x2ee9bc, this);
            function _0x2ee9bc(_0x4f86c0) {
                var _0x12c1db = _0x340742;
                try {
                    this['mm_base'][_0x12c1db(0x9a)](this['mm']),
                    delete this['mm'],
                    createjs[_0x12c1db(0xfb)]['removeAllEventListeners'](),
                    createjs['Ticker'][_0x12c1db(0x194)](),
                    createjs[_0x12c1db(0xfb)]['addEventListener']('tick', stage);
                } catch (_0x24e8d0) {}
                sound = createjs[_0x12c1db(0x174)][_0x12c1db(0x11e)](0x1),
                sound['volume'] = exportRoot[_0x12c1db(0x185)],
                exportRoot[_0x12c1db(0x1e3)](-0x1 + 0xa);
            }
            ;function _0xfa5344(_0x32c356) {
                var _0x5ff917 = _0x340742
                  , _0x3cdf83 = new Array();
                if (document[_0x5ff917(0xf2)] != '') {
                    var _0x4c6102 = document['cookie'][_0x5ff917(0x19d)](';\x20');
                    for (var _0x2190d1 = 0x0; _0x2190d1 < _0x4c6102[_0x5ff917(0xc0)]; _0x2190d1++) {
                        var _0x2afc5c = _0x4c6102[_0x2190d1][_0x5ff917(0x19d)]('=');
                        _0x3cdf83[_0x2afc5c[0x0]] = decodeURIComponent(_0x2afc5c[0x1]);
                    }
                }
                return _0x3cdf83[_0x32c356];
            }
            exportRoot['soundVolume'] = 0.3,
            this[_0x340742(0x14f)]['mzSlSoundRange'][_0x340742(0x133)]['x'] = 0x46 * exportRoot[_0x340742(0x185)];
            try {
                _0xfa5344(_0x340742(0x185)) != null && (exportRoot['soundVolume'] = parseFloat(_0xfa5344(_0x340742(0x185))),
                this[_0x340742(0x14f)][_0x340742(0x16f)]['mzSlSoundRangeBar']['x'] = 0x46 * exportRoot[_0x340742(0x185)]);
            } catch (_0x1a62f3) {}
            exportRoot[_0x340742(0x138)] = !![],
            this['mzCheckBGM']['gotoAndStop'](0x0);
            try {
                _0xfa5344(_0x340742(0x1cf)) != null && (exportRoot[_0x340742(0x138)] = _0xfa5344(_0x340742(0x1cf)) == _0x340742(0x19b) ? !![] : ![],
                exportRoot['flBGM'] ? this[_0x340742(0x149)][_0x340742(0x1e3)](0x0) : this['mzCheckBGM'][_0x340742(0x1e3)](0x1));
            } catch (_0x50fc60) {}
            exportRoot[_0x340742(0xe9)] = ![],
            this[_0x340742(0xfa)][_0x340742(0x1e3)](0x1);
            try {
                _0xfa5344(_0x340742(0x92)) != null && (exportRoot['flLightColor'] = _0xfa5344(_0x340742(0x92)) == _0x340742(0x19b) ? !![] : ![],
                exportRoot[_0x340742(0xe9)] ? this[_0x340742(0xfa)]['gotoAndStop'](0x0) : this[_0x340742(0xfa)][_0x340742(0x1e3)](0x1));
            } catch (_0x13a630) {}
            this[_0x340742(0x14f)][_0x340742(0x16f)][_0x340742(0x133)][_0x340742(0xb9)] = _0x340742(0x198),
            this[_0x340742(0x14f)][_0x340742(0x16f)]['mzSlSoundRangeBar']['on'](_0x340742(0x131), _0x5249ec, this),
            this['mzSlSound'][_0x340742(0x16f)]['mzSlSoundRangeBar']['on'](_0x340742(0x104), _0xa44670, this),
            this['mzSlSound'][_0x340742(0x16f)]['mzSlSoundRangeBar']['on']('pressup', _0x2b6533, this);
            function _0x5249ec(_0x26caf0) {
                var _0x4ac929 = _0x340742;
                stSoundRangeBarDragX = stage['mouseX'] - this[_0x4ac929(0x14f)][_0x4ac929(0x16f)][_0x4ac929(0x133)]['x'];
            }
            function _0xa44670(_0xef816) {
                var _0x42b927 = _0x340742;
                this[_0x42b927(0x14f)][_0x42b927(0x16f)][_0x42b927(0x133)]['x'] = stage['mouseX'] - stSoundRangeBarDragX,
                this['mzSlSound'][_0x42b927(0x16f)][_0x42b927(0x133)]['y'] = 0x0;
                this['mzSlSound'][_0x42b927(0x16f)][_0x42b927(0x133)]['x'] < 0x0 && (this[_0x42b927(0x14f)][_0x42b927(0x16f)][_0x42b927(0x133)]['x'] = 0x0);
                this[_0x42b927(0x14f)]['mzSlSoundRange']['mzSlSoundRangeBar']['x'] > 0x46 && (this[_0x42b927(0x14f)][_0x42b927(0x16f)][_0x42b927(0x133)]['x'] = 0x46);
                exportRoot[_0x42b927(0x185)] = Math[_0x42b927(0x172)](this['mzSlSound'][_0x42b927(0x16f)]['mzSlSoundRangeBar']['x'] / 0x46 * 0x64) / 0x64;
                try {
                    sound[_0x42b927(0x81)] = exportRoot['soundVolume'],
                    soundBGM['volume'] = exportRoot[_0x42b927(0x185)];
                } catch (_0x2ab349) {}
            }
            function _0x2b6533(_0x22b01d) {
                var _0xa273b3 = _0x340742;
                exportRoot['soundVolume'] = Math[_0xa273b3(0x172)](this[_0xa273b3(0x14f)][_0xa273b3(0x16f)][_0xa273b3(0x133)]['x'] / 0x46 * 0x64) / 0x64,
                document[_0xa273b3(0xf2)] = _0xa273b3(0xff) + exportRoot['soundVolume'];
                try {
                    sound[_0xa273b3(0x81)] = exportRoot[_0xa273b3(0x185)],
                    soundBGM[_0xa273b3(0x81)] = exportRoot[_0xa273b3(0x185)];
                } catch (_0x5b7331) {}
            }
            this[_0x340742(0x147)] = _0x216fb6;
            function _0x216fb6(_0x14c5f8) {
                var _0x484a12 = _0x340742;
                for (var _0x88f363 = 0x0; _0x88f363 < _0x14c5f8[_0x484a12(0xc0)]; _0x88f363++) {
                    rr = Math[_0x484a12(0x1a9)](Math[_0x484a12(0x18c)]() * (_0x14c5f8[_0x484a12(0xc0)] - _0x88f363)) + _0x88f363,
                    te = _0x14c5f8[_0x88f363],
                    _0x14c5f8[_0x88f363] = _0x14c5f8[rr],
                    _0x14c5f8[rr] = te;
                }
            }
            this[_0x340742(0x149)][_0x340742(0xb9)] = _0x340742(0x198),
            this[_0x340742(0x149)]['on'](_0x340742(0xd2), _0x1f31dc, this);
            function _0x1f31dc(_0x4a4b74) {
                var _0x413b21 = _0x340742;
                exportRoot[_0x413b21(0x138)] ? (exportRoot[_0x413b21(0x138)] = ![],
                this['mzCheckBGM'][_0x413b21(0x1e3)](0x1)) : (exportRoot['flBGM'] = !![],
                this[_0x413b21(0x149)][_0x413b21(0x1e3)](0x0));
                sound = createjs[_0x413b21(0x174)][_0x413b21(0x11e)](0x1),
                sound[_0x413b21(0x81)] = exportRoot[_0x413b21(0x185)];
                try {
                    this['mm'][_0x413b21(0x162)]();
                } catch (_0x42980a) {}
                document['cookie'] = _0x413b21(0x1b1) + exportRoot[_0x413b21(0x138)];
            }
            this[_0x340742(0xfa)][_0x340742(0xb9)] = _0x340742(0x198),
            this[_0x340742(0xfa)]['on'](_0x340742(0xd2), _0x34a7ed, this);
            function _0x34a7ed(_0x46b8de) {
                var _0x2d5b19 = _0x340742;
                exportRoot[_0x2d5b19(0xe9)] ? (exportRoot[_0x2d5b19(0xe9)] = ![],
                this['mzCheckLightColor'][_0x2d5b19(0x1e3)](0x1)) : (exportRoot[_0x2d5b19(0xe9)] = !![],
                this['mzCheckLightColor'][_0x2d5b19(0x1e3)](0x0));
                sound = createjs[_0x2d5b19(0x174)][_0x2d5b19(0x11e)](0x1),
                sound[_0x2d5b19(0x81)] = exportRoot[_0x2d5b19(0x185)];
                try {
                    this['mm'][_0x2d5b19(0xee)]();
                } catch (_0x47a8ef) {}
                document['cookie'] = _0x2d5b19(0x17e) + exportRoot['flLightColor'];
            }
            ef_lang == 'ja' ? (this[_0x340742(0xfa)]['x'] = 0x1d3,
            this[_0x340742(0x18f)]['x'] = 0x1e3) : (this[_0x340742(0xfa)]['x'] = 0x1ba,
            this['mzTextLightColor']['x'] = 0x1ca);
            this[_0x340742(0x1a6)][_0x340742(0x184)] = ![],
            this[_0x340742(0x1a6)][_0x340742(0xb9)] = _0x340742(0x198),
            this[_0x340742(0x1a6)]['on'](_0x340742(0xd2), _0x22426e, this);
            this.visible = true;
            function _0x22426e(_0xc33f76) {
                var _0x1cd64b = _0x340742;
                createjs['Sound'][_0x1cd64b(0xd3)](),
                sound = createjs[_0x1cd64b(0x174)]['play'](0x1),
                sound['volume'] = exportRoot[_0x1cd64b(0x185)],
                exportRoot[_0x1cd64b(0x1e3)](-0x1 + 0x8);
                var _0x12c1db = _0x340742;
                try {
                    this['mm_base'][_0x12c1db(0x9a)](this['mm']),
                    delete this['mm'],
                    createjs[_0x12c1db(0xfb)]['removeAllEventListeners'](),
                    createjs['Ticker'][_0x12c1db(0x194)](),
                    createjs[_0x12c1db(0xfb)]['addEventListener']('tick', stage);
                } catch (_0x24e8d0) {}
                sound = createjs[_0x12c1db(0x174)][_0x12c1db(0x11e)](0x1),
                sound['volume'] = exportRoot[_0x12c1db(0x185)],
                exportRoot[_0x12c1db(0x1e3)](-0x1 + 0xa);
            }
            ;
        }
        ,
        this['frame_9'] = function() {
            var _0x2bb886 = _0x34ff56;
            this[_0x2bb886(0xd3)](),
            this['mm'] = new _0x2172f1[(_0x2bb886(0xe1))](),
            this[_0x2bb886(0xeb)][_0x2bb886(0x1d1)](this['mm']);
        }
        ,
        this['timeline'][_0x34ff56(0x93)](_0x417268[_0x34ff56(0x143)][_0x34ff56(0xa1)](this)['call'](this['frame_0'])[_0x34ff56(0x15a)](0x6)[_0x34ff56(0x1cc)](this[_0x34ff56(0x91)])[_0x34ff56(0x15a)](0x3)[_0x34ff56(0x1cc)](this[_0x34ff56(0x183)])[_0x34ff56(0x15a)](0x1)),
        this[_0x34ff56(0xfa)] = new _0x2172f1[(_0x34ff56(0x1d2))](),
        this[_0x34ff56(0xfa)][_0x34ff56(0x13d)] = _0x34ff56(0xfa),
        this[_0x34ff56(0xfa)]['setTransform'](0x1bf, 0x1b6, 0.253, 0.253),
        this[_0x34ff56(0x149)] = new _0x2172f1['formzCheckBGM'](),
        this[_0x34ff56(0x149)]['name'] = 'mzCheckBGM',
        this['mzCheckBGM'][_0x34ff56(0x9e)](546.95, 439.1, 0.2531, 0.2531, 0x0, 0x0, 0x0, 59.1, 4.4),
        this[_0x34ff56(0x1a6)] = new _0x2172f1[(_0x34ff56(0x90))](),
        this[_0x34ff56(0x1a6)][_0x34ff56(0x13d)] = 'mzBtReset',
        this[_0x34ff56(0x1a6)]['setTransform'](104.15, 448.5, 0x1, 0x1, 0x0, 0x0, 0x0, 42.9, 12.5),
        this[_0x34ff56(0x14f)] = new _0x2172f1[(_0x34ff56(0xbd))](),
        this[_0x34ff56(0x14f)][_0x34ff56(0x13d)] = _0x34ff56(0x14f),
        this[_0x34ff56(0x14f)][_0x34ff56(0x9e)](637.5, 446.5, 0x1, 0x1, 0x0, 0x0, 0x0, 0x23, 0.5),
        this[_0x34ff56(0x134)][_0x34ff56(0x93)](_0x417268['Tween'][_0x34ff56(0xa1)]({})['to']({
            'state': []
        })['to']({
            'state': [{
                't': this['mzSlSound']
            }, {
                't': this[_0x34ff56(0x1a6)]
            }, {
                't': this[_0x34ff56(0x149)]
            }, {
                't': this[_0x34ff56(0xfa)]
            }]
        }, 0x5)[_0x34ff56(0x15a)](0x5)),
        this[_0x34ff56(0x18f)] = new _0x2172f1[(_0x34ff56(0x16d))](),
        this['mzTextLightColor'][_0x34ff56(0x13d)] = _0x34ff56(0x18f),
        this[_0x34ff56(0x18f)][_0x34ff56(0x9e)](0x1cf, 434.5),
        this['shape'] = new _0x417268['Shape'](),
        this[_0x34ff56(0x10c)][_0x34ff56(0x120)]['f']('#C9FFC9')['s']()['p'](_0x34ff56(0xbb)),
        this[_0x34ff56(0x10c)][_0x34ff56(0x9e)](571.875, 446.45),
        this[_0x34ff56(0x126)] = new _0x417268['Shape'](),
        this[_0x34ff56(0x126)]['graphics']['f']('#C9FFC9')['s']()['p'](_0x34ff56(0x1c4)),
        this['shape_1'][_0x34ff56(0x9e)](562.375, 446.45),
        this[_0x34ff56(0xea)] = new _0x417268['Shape'](),
        this[_0x34ff56(0xea)][_0x34ff56(0x120)]['f'](_0x34ff56(0xcd))['s']()['p'](_0x34ff56(0x180)),
        this['shape_2']['setTransform'](554.4, 446.45),
        this[_0x34ff56(0x134)]['addTween'](_0x417268[_0x34ff56(0x143)]['get']({})['to']({
            'state': []
        })['to']({
            'state': [{
                't': this[_0x34ff56(0xea)]
            }, {
                't': this[_0x34ff56(0x126)]
            }, {
                't': this[_0x34ff56(0x10c)]
            }, {
                't': this[_0x34ff56(0x18f)]
            }]
        }, 0x5)[_0x34ff56(0x15a)](0x5)),
        this['instance'] = new _0x2172f1[(_0x34ff56(0xdc))](),
        this[_0x34ff56(0xd8)]['setTransform'](0x3, 0x3),
        this[_0x34ff56(0xd8)][_0x34ff56(0xfc)] = !![],
        this[_0x34ff56(0x134)][_0x34ff56(0x93)](_0x417268['Tween']['get'](this['instance'])[_0x34ff56(0x15a)](0x1)['to']({
            '_off': ![]
        }, 0x0)[_0x34ff56(0x15a)](0x9)),
        this[_0x34ff56(0x9f)] = new _0x417268[(_0x34ff56(0x17d))](),
        this[_0x34ff56(0x9f)][_0x34ff56(0x120)]['f']('#FFFFFF')['s']()['p'](_0x34ff56(0x1da)),
        this[_0x34ff56(0x9f)]['setTransform'](0x158, 0xee),
        this[_0x34ff56(0x9f)][_0x34ff56(0xfc)] = !![],
        this['timeline'][_0x34ff56(0x93)](_0x417268[_0x34ff56(0x143)]['get'](this[_0x34ff56(0x9f)])['wait'](0x1)['to']({
            '_off': ![]
        }, 0x0)['wait'](0x9)),
        this[_0x34ff56(0xa0)] = new _0x2172f1[(_0x34ff56(0xd7))](),
        this[_0x34ff56(0xa0)]['name'] = _0x34ff56(0xa0),
        this['mzBtPlay'][_0x34ff56(0x9e)](0xd0, 0x102, 0x1, 1.8462, 0x0, 0x0, 0x0, 0x3c, 32.5),
        this[_0x34ff56(0xa0)][_0x34ff56(0xfc)] = !![],
        this['timeline']['addTween'](_0x417268[_0x34ff56(0x143)][_0x34ff56(0xa1)](this['mzBtPlay'])[_0x34ff56(0x15a)](0x6)['to']({
            '_off': ![]
        }, 0x0)['to']({
            '_off': !![]
        }, 0x2)['wait'](0x2)),
        this['mzTitle'] = new _0x2172f1[(_0x34ff56(0xbc))](),
        this[_0x34ff56(0x167)][_0x34ff56(0x13d)] = _0x34ff56(0x167),
        this[_0x34ff56(0x167)][_0x34ff56(0x9e)](0x168, 0xeb, 0x1, 0x1, 0x0, 0x0, 0x0, 0x168, 0xeb),
        this[_0x34ff56(0x167)][_0x34ff56(0xfc)] = !![],
        this[_0x34ff56(0x134)][_0x34ff56(0x93)](_0x417268[_0x34ff56(0x143)]['get'](this[_0x34ff56(0x167)])[_0x34ff56(0x15a)](0x1)['to']({
            '_off': ![]
        }, 0x0)['to']({
            '_off': !![]
        }, 0x7)[_0x34ff56(0x15a)](0x2)),
        this[_0x34ff56(0xeb)] = new _0x2172f1['formm_base'](),
        this[_0x34ff56(0xeb)]['name'] = 'mm_base',
        this[_0x34ff56(0xeb)][_0x34ff56(0x9e)](0x5, 0x5, 0x1, 0x1, 0x0, 0x0, 0x0, 0x5, 0x5),
        this[_0x34ff56(0xeb)][_0x34ff56(0xfc)] = !![],
        this[_0x34ff56(0x134)][_0x34ff56(0x93)](_0x417268[_0x34ff56(0x143)][_0x34ff56(0xa1)](this[_0x34ff56(0xeb)])['wait'](0x8)['to']({
            '_off': ![]
        }, 0x0)[_0x34ff56(0x15a)](0x2)),
        this['instance_1'] = new _0x2172f1[(_0x34ff56(0xf5))](),
        this[_0x34ff56(0xd4)][_0x34ff56(0x9e)](0x12, 17.95),
        this[_0x34ff56(0xd4)][_0x34ff56(0xfc)] = !![],
        this['timeline'][_0x34ff56(0x93)](_0x417268[_0x34ff56(0x143)][_0x34ff56(0xa1)](this[_0x34ff56(0xd4)])[_0x34ff56(0x15a)](0x1)['to']({
            '_off': ![]
        }, 0x0)[_0x34ff56(0x15a)](0x9)),
        this['_renderFirstFrame']();
    }
    )[_0x182e50(0xe5)] = _0x47b74b = new _0x2172f1[(_0x182e50(0x13f))](),
    _0x47b74b['nominalBounds'] = new _0x417268[(_0x182e50(0xf6))](-26.5,-0x15,0x44d,0x2f1),
    _0x2172f1['properties'] = {
        'id': _0x182e50(0x18a),
        'width': 0x2d0,
        'height': 0x1d6,
        'fps': 0x1e,
        'color': _0x182e50(0xf3),
        'opacity': 0x1,
        'manifest': [{
            'src': _0x182e50(0x107),
            'id': _0x182e50(0xa7)
        }, {
            'src': 'images/apple_shadowselected.png',
            'id': _0x182e50(0x122)
        }, {
            'src': 'images/background.png',
            'id': _0x182e50(0xf5)
        }, {
            'src': _0x182e50(0xa8),
            'id': 'frame'
        }, {
            'src': _0x182e50(0x1b3),
            'id': _0x182e50(0xe0)
        }, {
            'src': _0x182e50(0x7b),
            'id': _0x182e50(0x166)
        }],
        'preloads': []
    },
    (_0x2172f1[_0x182e50(0x181)] = function(_0x1e2867) {
        var _0x257b4a = _0x182e50;
        createjs[_0x257b4a(0x181)]['call'](this, _0x1e2867);
    }
    )['prototype'] = _0x47b74b = new createjs[(_0x182e50(0x181))](),
    _0x47b74b['setAutoPlay'] = function(_0x558d3e) {
        var _0xa58ce2 = _0x182e50;
        this[_0xa58ce2(0xac)] = _0x558d3e;
    }
    ,
    _0x47b74b[_0x182e50(0x11e)] = function() {
        var _0x56517a = _0x182e50;
        this[_0x56517a(0xac)] = !![],
        this['getChildAt'](0x0)[_0x56517a(0x1db)](this[_0x56517a(0x11b)]());
    }
    ,
    _0x47b74b[_0x182e50(0xd3)] = function(_0x48d317) {
        var _0x4810e2 = _0x182e50;
        if (_0x48d317)
            this[_0x4810e2(0x8f)](_0x48d317);
        this['tickEnabled'] = ![];
    }
    ,
    _0x47b74b[_0x182e50(0x8f)] = function(_0x4c24db) {
        var _0x4a5cf7 = _0x182e50;
        this['tickEnabled'] = !![],
        this[_0x4a5cf7(0x87)](0x0)[_0x4a5cf7(0x1e3)](_0x2172f1['properties'][_0x4a5cf7(0x14c)] * _0x4c24db / 0x3e8);
    }
    ,
    _0x47b74b['getDuration'] = function() {
        var _0x29dbde = _0x182e50;
        return this[_0x29dbde(0x87)](0x0)['totalFrames'] / _0x2172f1[_0x29dbde(0x85)][_0x29dbde(0x14c)] * 0x3e8;
    }
    ,
    _0x47b74b[_0x182e50(0x11b)] = function() {
        var _0x3b3c48 = _0x182e50;
        return this['getChildAt'](0x0)[_0x3b3c48(0xcc)] / _0x2172f1[_0x3b3c48(0x85)][_0x3b3c48(0x14c)] * 0x3e8;
    }
    ,
    _0x470bf3['bootcompsLoaded'] = _0x470bf3['bootcompsLoaded'] || [],
    !_0x470bf3[_0x182e50(0xe8)] && (_0x470bf3['bootstrapListeners'] = []),
    _0x470bf3[_0x182e50(0x1bc)] = function(_0x5c1f49) {
        var _0x3112e1 = _0x182e50;
        _0x470bf3[_0x3112e1(0xe8)][_0x3112e1(0xbf)](_0x5c1f49);
        if (_0x470bf3[_0x3112e1(0x160)][_0x3112e1(0xc0)] > 0x0)
            for (var _0x5d076f = 0x0; _0x5d076f < _0x470bf3[_0x3112e1(0x160)]['length']; ++_0x5d076f) {
                _0x5c1f49(_0x470bf3['bootcompsLoaded'][_0x5d076f]);
            }
    }
    ,
    _0x470bf3[_0x182e50(0xd9)] = _0x470bf3['compositions'] || {},
    _0x470bf3[_0x182e50(0xd9)][_0x182e50(0x18a)] = {
        'getStage': function() {
            var _0x270c6a = _0x182e50;
            return exportRoot[_0x270c6a(0xab)];
        },
        'getLibrary': function() {
            return _0x2172f1;
        },
        'getSpriteSheet': function() {
            return _0x734e6f;
        },
        'getImages': function() {
            return _0x31ca6a;
        }
    },
    _0x470bf3[_0x182e50(0xcb)] = function(_0x4c8161) {
        var _0x1cc643 = _0x182e50;
        _0x470bf3['bootcompsLoaded'][_0x1cc643(0xbf)](_0x4c8161);
        for (var _0x1e6113 = 0x0; _0x1e6113 < _0x470bf3[_0x1cc643(0xe8)]['length']; _0x1e6113++) {
            _0x470bf3[_0x1cc643(0xe8)][_0x1e6113](_0x4c8161);
        }
    }
    ,
    _0x470bf3[_0x182e50(0x119)] = function(_0x3579c8) {
        var _0x3f75aa = _0x182e50;
        return _0x470bf3[_0x3f75aa(0xd9)][_0x3579c8];
    }
    ,
    _0x470bf3[_0x182e50(0xc5)] = function(_0x8880ea, _0x19c6cb, _0xbe5f1e, _0x4c2458, _0x4530c8) {
        var _0x2a285b = _0x182e50, _0xa2d66f, _0x1011ab, _0x4a23ef = 0x1;
        window['addEventListener'](_0x2a285b(0xe3), _0x1d889c),
        _0x1d889c();
        function _0x1d889c() {
            var _0x4cb32f = _0x2a285b
              , _0xcf5606 = _0x2172f1[_0x4cb32f(0x85)][_0x4cb32f(0xe4)]
              , _0x516424 = _0x2172f1[_0x4cb32f(0x85)][_0x4cb32f(0xdb)]
              , _0x3275ac = window[_0x4cb32f(0x13e)]
              , _0x233476 = window[_0x4cb32f(0x1d6)]
              , _0x55c5fd = window['devicePixelRatio'] || 0x1
              , _0x391670 = _0x3275ac / _0xcf5606
              , _0x373e2c = _0x233476 / _0x516424
              , _0x2ed2ff = 0x1;
            if (_0x8880ea) {
                if (_0x19c6cb == _0x4cb32f(0xe4) && _0xa2d66f == _0x3275ac || _0x19c6cb == _0x4cb32f(0xdb) && _0x1011ab == _0x233476)
                    _0x2ed2ff = _0x4a23ef;
                else {
                    if (!_0xbe5f1e) {
                        if (_0x3275ac < _0xcf5606 || _0x233476 < _0x516424)
                            _0x2ed2ff = Math['min'](_0x391670, _0x373e2c);
                    } else {
                        if (_0x4c2458 == 0x1)
                            _0x2ed2ff = Math['min'](_0x391670, _0x373e2c);
                        else
                            _0x4c2458 == 0x2 && (_0x2ed2ff = Math[_0x4cb32f(0xb7)](_0x391670, _0x373e2c));
                    }
                }
            }
            _0x4530c8[0x0]['width'] = _0xcf5606 * _0x55c5fd * _0x2ed2ff,
            _0x4530c8[0x0]['height'] = _0x516424 * _0x55c5fd * _0x2ed2ff,
            _0x4530c8[_0x4cb32f(0x15c)](function(_0x5d3135) {
                var _0x17aa81 = _0x4cb32f;
                _0x5d3135[_0x17aa81(0x116)][_0x17aa81(0xe4)] = _0xcf5606 * _0x2ed2ff + 'px',
                _0x5d3135['style'][_0x17aa81(0xdb)] = _0x516424 * _0x2ed2ff + 'px';
            }),
            stage[_0x4cb32f(0x1ac)] = _0x55c5fd * _0x2ed2ff,
            stage[_0x4cb32f(0x1ad)] = _0x55c5fd * _0x2ed2ff,
            _0xa2d66f = _0x3275ac,
            _0x1011ab = _0x233476,
            _0x4a23ef = _0x2ed2ff,
            stage[_0x4cb32f(0x110)] = ![],
            stage[_0x4cb32f(0x191)](),
            stage['tickOnUpdate'] = !![];
        }
    }
    ,
    _0x470bf3[_0x182e50(0x1a2)] = function(_0x3cce2c) {
        var _0x59ecc0 = _0x182e50;
        if (!_0x3cce2c['paused']) {
            var _0x383095 = stage[_0x59ecc0(0x87)](0x0);
            !_0x383095[_0x59ecc0(0x144)] && _0x383095[_0x59ecc0(0x1bf)]();
        }
    }
    ;
}(createjs = createjs || {}, AdobeAn = AdobeAn || {}));
var createjs, AdobeAn;

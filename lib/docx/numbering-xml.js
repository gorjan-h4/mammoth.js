exports.NumberingReader = NumberingReader;
exports.Numbering = Numbering;
exports.defaultNumbering = new Numbering({});


function Numbering(nums) {
    return {
        findLevel: function(numId, level) {
            var num = nums[numId];
            if (num) {
                return num[level];
            } else {
                return null;
            }
        }
    };
}

function NumberingReader(numStyles) {
    function readNumsRel(root){
        var numsRel = {};
        root.getElementsByTagName("w:num").forEach(function(element) {
            var id = element.attributes["w:numId"];
            var abstractNumId = element.first("w:abstractNumId").attributes["w:val"];
            numsRel[id] = abstractNumId;
        });
        return numsRel;
    }

    function readAbstractNums(root, numsRel) {
        var abstractNums = {};
        root.getElementsByTagName("w:abstractNum").forEach(function(element) {
            var id = element.attributes["w:abstractNumId"];
            var numStyleLink = element.firstOrEmpty("w:numStyleLink").attributes["w:val"];
            if (numStyleLink !== undefined) {
                var numIdLink = numStyles[numStyleLink].numId;
                var abstractNumIdLink = numsRel[numIdLink];
                abstractNums[id] = {abstractNumIdLink: abstractNumIdLink};
            } else {
                abstractNums[id] = readAbstractNum(element, id);
            }
        });
        Object.keys(abstractNums).forEach(function(k){
            var abstractNumIdLink = abstractNums[k]["abstractNumIdLink"];
            if (abstractNumIdLink !== undefined) {
                abstractNums[k] = abstractNums[abstractNumIdLink];
            }
        });
        return abstractNums;
    }

    // Refer to docs:
    // Numbering in general http://officeopenxml.com/WPnumbering.php
    // Defining a numbering level http://officeopenxml.com/WPnumberingLvl.php
    function readLevelAttributes(lve, abstractNumId) {
        var getVal = function(attr) {
            return lve.first(attr) == null ? null : lve.first(attr).attributes["w:val"];
        };
        var attrs = {
            // Level index
            ilvl: lve.attributes["w:ilvl"],
            // Number format (eg. lowerRoman, upperLetter, numbers, etc...)
            numFmt: getVal("w:numFmt"),
            // Specifies the starting value for the numbering
            start: getVal("w:start"),
            // Specifies the text content template to be displayed at the level
            lvlText: getVal("w:lvlText"),
            // Justification for the numbering level text
            lvlJc: getVal("w:lvlJc")
        };

        Object.keys(attrs).forEach(function(k){
            if(attrs[k]==null) delete attrs[k];
        });

        Object.assign(attrs, {abstractNumId: abstractNumId});
        return attrs;
    }

    function readAbstractNum(element, abstractNumId) {
        var levels = {};
        element.getElementsByTagName("w:lvl").forEach(function(levelElement) {
            var attrs = readLevelAttributes(levelElement, abstractNumId);
            levels[attrs.ilvl] = {
                isOrdered: attrs.numFmt !== "bullet",
                level: attrs.ilvl,
                attrs: attrs
            };
        });
        return levels;
    }
    
    function readNums(root, abstractNums) {
        var nums = {};
        root.getElementsByTagName("w:num").forEach(function(element) {
            var id = element.attributes["w:numId"];
            var abstractNumId = element.first("w:abstractNumId").attributes["w:val"];
            
            // We have to deep copy so we can use levelOverride
            nums[id] = JSON.parse(JSON.stringify(abstractNums[abstractNumId]));
            
            // Handle lvlOverride
            var lvlOverrides = element.getElementsByTagName('w:lvlOverride');
            if(lvlOverrides != null) {
                lvlOverrides.forEach(function(lvlOverride){
                    var startOverride = lvlOverride.firstOrEmpty('w:startOverride').attributes['w:val'];
                    lvlOverride.getElementsByTagName("w:lvl").forEach(function(levelElement){
                        var attrs = readLevelAttributes(levelElement, abstractNumId);
                        var oldAttrs = nums[id][attrs.ilvl].attrs;
                        var newAttrs = Object.assign({}, oldAttrs, attrs, {override: {}});

                        if(startOverride != null) newAttrs.override.startOverride = startOverride;

                        nums[id][attrs.ilvl] = {
                            isOrdered: attrs.numFmt !== "bullet",
                            level: attrs.ilvl,
                            attrs: newAttrs
                        };
                    });
                });
            }
            Object.keys(nums[id]).forEach(function(lvl){
                nums[id][lvl].attrs['numId'] = id;
            });
        });
        return nums;
    }

    return {
        readNumbering: function(root) {
            var numsRel = readNumsRel(root);
            var abstractNums = readAbstractNums(root, numsRel);
            var nums = readNums(root, abstractNums);
            return new Numbering(nums);
        }
    };
}

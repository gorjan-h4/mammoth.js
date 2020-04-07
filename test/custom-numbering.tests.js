var assert = require("assert");
var path = require("path");
var mammoth = require("../");

var test = require("./test")(module);

var dataFile = (filename)=>`test-data/custom-numbering/${filename}`;
var testName = (filename)=> `should convert ${filename}`;

var tests = {
    'letters-lowercase-brackets.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'lowerLetter','start':'1','lvlText':'(%1)','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'lowerLetter','start':'1','lvlText':'(%1)','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'lowerLetter','start':'1','lvlText':'(%1)','lvlJc':'left'}">Three</li></ol>
    `},

    'letters-lowercase-dot.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'lowerLetter','start':'1','lvlText':'%1.','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'lowerLetter','start':'1','lvlText':'%1.','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'lowerLetter','start':'1','lvlText':'%1.','lvlJc':'left'}">Three</li></ol>
    `},

    'letters-uppercase-brackets.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'upperLetter','start':'1','lvlText':'(%1)','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'upperLetter','start':'1','lvlText':'(%1)','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'upperLetter','start':'1','lvlText':'(%1)','lvlJc':'left'}">Three</li></ol>
    `},

    'letters-uppercase-dot.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'upperLetter','start':'1','lvlText':'%1.','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'upperLetter','start':'1','lvlText':'%1.','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'upperLetter','start':'1','lvlText':'%1.','lvlJc':'left'}">Three</li></ol>
    `},

    'numbers-brackets.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'(%1)','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'(%1)','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'(%1)','lvlJc':'left'}">Three</li></ol>
    `},

    'numbers-dot.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left'}">Three</li></ol>
    `},

    'numbers-none.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1','lvlJc':'left'}">Three</li></ol>
    `},

    'roman-lowercase-brackets.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'lowerRoman','start':'1','lvlText':'(%1)','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'lowerRoman','start':'1','lvlText':'(%1)','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'lowerRoman','start':'1','lvlText':'(%1)','lvlJc':'left'}">Three</li></ol>
    `},

    'roman-lowercase-dot.docx': {output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'lowerRoman','start':'1','lvlText':'%1.','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'lowerRoman','start':'1','lvlText':'%1.','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'lowerRoman','start':'1','lvlText':'%1.','lvlJc':'left'}">Three</li></ol>
    `},

    'roman-uppercase-brackets.docx': { output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'upperRoman','start':'1','lvlText':'(%1)','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'upperRoman','start':'1','lvlText':'(%1)','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'upperRoman','start':'1','lvlText':'(%1)','lvlJc':'left'}">Three</li></ol>
    `},
    
    'roman-uppercase-dot.docx': { output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'upperRoman','start':'1','lvlText':'%1.','lvlJc':'right'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'upperRoman','start':'1','lvlText':'%1.','lvlJc':'right'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'upperRoman','start':'1','lvlText':'%1.','lvlJc':'right'}">Three</li></ol>
    `},

    'lvlOverride-numbers-dot.docx': { output:`
    <ol><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1 DOT!','lvlJc':'left'}">One</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1 DOT!','lvlJc':'left'}">Two</li><li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1 DOT!','lvlJc':'left'}">Three</li></ol>
    `},
}

Object.keys(tests).forEach((filename)=>{
    test(testName(filename), function() {
        var docxPath = path.join(__dirname, dataFile(filename));
        var out = tests[filename].output;
        out = out.trim();
        return mammoth.convertToHtml({path: docxPath}).then(function(result) {
            assert.equal(result.value, out);
        });
    })
});

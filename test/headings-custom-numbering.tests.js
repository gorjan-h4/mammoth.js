var assert = require("assert");
var path = require("path");
var mammoth = require("../");

var test = require("./test")(module);

var dataFile = (filename)=>`test-data/custom-numbering/${filename}`;
var testName = (filename)=> `should convert ${filename}`;

var tests = {
    'headings-individualy-numbered.docx': { output: `
        <h1 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'32'}">Heading 1</h1><p>Para 1</p><h2 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'32'}">Heading 2</h2><p>Para 2</p><h3 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'32'}">Heading 3</h3><p>Para 3</p><h4 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'32'}">Heading 4</h4><p>Para 4</p><h2 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'32'}">Heading 5 (lvl 2)</h2><p>Para 5</p>
    `},
    'headings-numbers-dot.docx': { output: `
        <h1 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1','lvlJc':'left','numId':'31'}">Heading 1</h1><p>Para 1</p><h2 data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%1.%2','lvlJc':'left','numId':'31'}">Heading 2</h2><p>Para 2</p><h3 data-numbering="{'ilvl':'2','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3','lvlJc':'left','numId':'31'}">Heading 3</h3><p>Para 3</p><h4 data-numbering="{'ilvl':'3','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.%4','lvlJc':'left','numId':'31'}">Heading 4</h4><p>Para 4</p><h2 data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%1.%2','lvlJc':'left','numId':'31'}">Heading 5 (lvl 2)</h2><p>Para 5</p>
    `},

    'headings-roman-lowercase-brackets.docx': { output: `
        <h1 data-numbering="{'ilvl':'0','numFmt':'lowerRoman','start':'1','lvlText':'(%1)','lvlJc':'left','numId':'31'}">Heading 1</h1><p>Para 1</p><h2 data-numbering="{'ilvl':'1','numFmt':'lowerRoman','start':'1','lvlText':'(%2)','lvlJc':'left','numId':'31'}">Heading 2</h2><p>Para 2</p><h3 data-numbering="{'ilvl':'2','numFmt':'lowerRoman','start':'1','lvlText':'(%3)','lvlJc':'left','numId':'31'}">Heading 3</h3><p>Para 3</p><h4 data-numbering="{'ilvl':'3','numFmt':'lowerRoman','start':'1','lvlText':'(%4)','lvlJc':'left','numId':'31'}">Heading 4</h4><p>Para 4</p><h2 data-numbering="{'ilvl':'1','numFmt':'lowerRoman','start':'1','lvlText':'(%2)','lvlJc':'left','numId':'31'}">Heading 5 (lvl 2)</h2><p>Para 5</p>
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

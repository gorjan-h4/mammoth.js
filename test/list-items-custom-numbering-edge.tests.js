var assert = require("assert");
var path = require("path");
var mammoth = require("../");

var test = require("./test")(module);

var dataFile = (filename)=>`test-data/custom-numbering-edge-cases/${filename}`;
var testName = (filename)=> `should convert ${filename}`;

var tests = {
    'bullet-num.docx': { output: `
    <ul>
        <li>Hello
            <ol>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left','numId':'2'}">Mello</li>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left','numId':'2'}">Yello</li>
            </ol>
        </li>
        <li>Hello
            <ol>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left','numId':'2'}">Mello</li>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left','numId':'2'}">Yello</li>
            </ol>
        </li>
    </ul>
    `},

    'num-bullet.docx': { output: `
    <ol>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'2'}">Hello</li>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'2'}">Mello
            <ul>
                <li>Hello</li>
                <li>Mello</li>
            </ul>
        </li>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'2'}">Hello</li>
        <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'2'}">Mello
            <ul>
                <li>Hello</li>
                <li>Mello</li>
            </ul>
        </li>
    </ol>
    `},

    'bullet-num-bullet.docx': { output: `
    <ul>
        <li>Hello</li>
        <li>Mello
            <ol>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left','numId':'2'}">Hello</li>
                <li data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%2.','lvlJc':'left','numId':'2'}">Mello
                    <ul>
                        <li>Hello</li>
                        <li>Mello</li>
                    </ul>
                </li>
            </ol>
        </li>
    </ul>
    `},

    'num-bullet-num.docx': { output: `
        <ol>
            <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'2'}">Hello</li>
            <li data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'left','numId':'2'}">Mello
                <ul>
                    <li>Hello</li>
                    <li>Mello
                        <ol>
                            <li data-numbering="{'ilvl':'2','numFmt':'lowerRoman','start':'1','lvlText':'%3.','lvlJc':'right','numId':'2'}">Hello</li>
                            <li data-numbering="{'ilvl':'2','numFmt':'lowerRoman','start':'1','lvlText':'%3.','lvlJc':'right','numId':'2'}">Mello</li>
                        </ol>
                    </li>
                </ul>
            </li>
        </ol>
    `},

    'bullet-bullet-num.docx': { output: `
    <ul>
        <li>Hello</li>
        <li>Mello
            <ul>
                <li>Hello</li>
                <li>Mello
                    <ol>
                        <li data-numbering="{'ilvl':'2','numFmt':'decimal','start':'1','lvlText':'%3.','lvlJc':'left','numId':'2'}">Hello</li>
                        <li data-numbering="{'ilvl':'2','numFmt':'decimal','start':'1','lvlText':'%3.','lvlJc':'left','numId':'2'}">Mello</li>
                    </ol>
                </li>
            </ul>
        </li>
    </ul>
    `},
}


function concatHtml(html) {
    return html.replace(/>\s+/g, '>').replace(/\s+</g,'<').trim();
}

Object.keys(tests).forEach((filename)=>{
    test(testName(filename), function() {
        var docxPath = path.join(__dirname, dataFile(filename));
        var out = tests[filename].output;
        out = concatHtml(out);
        return mammoth.convertToHtml({path: docxPath}).then(function(result) {
            assert.equal(result.value, out);
        });
    })
});

const headingMultiLvlOverride = `
<h1 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'right','override':{},'numId':'4'}">HEADING 1 Sample</h1>
<p>Paragraph after heading 1</p>
<h2 data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%1.%2.','lvlJc':'right','override':{},'numId':'5'}">Heading 2 sample</h2>
<p>Paragraph after heading 2</p>
<h3 data-numbering="{'ilvl':'2','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.','lvlJc':'right','override':{},'numId':'6'}">Heading 3 sample</h3>
<p>Paragraph after heading 3 sample</p>
<h4 data-numbering="{'ilvl':'3','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.%4.','lvlJc':'right','override':{},'numId':'7'}">Heading 4 sample</h4>
<p>Paragraph after heading 4 sample</p>
<h5 data-numbering="{'ilvl':'4','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.%4.%5.','lvlJc':'right','override':{},'numId':'8'}">Heading 5 sample</h5>
<p>Paragraph after heading 5 sample</p>
<h6 data-numbering="{'ilvl':'5','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.%4.%5.%6.','lvlJc':'right','override':{},'numId':'9'}">Heading 6 sample</h6>
<p>Paragraph after heading 6 sample</p>
`;

test(testName('heading-multi-lvlOverride.docx'), function() {
    var docxPath = path.join(__dirname, dataFile('heading-multi-lvlOverride.docx'));
    return mammoth.convertToHtml({path: docxPath}).then(function(result) {
        assert.equal(result.value, concatHtml(headingMultiLvlOverride));
    });
});

const headingOverinheritedNumbering = `
<h1 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'right','override':{'startOverride':'1'},'numId':'4'}"><span data-unrecognized-element="w:softHyphen"></span>H1 Sample -1</h1>
<p>Paragraph after H1 SAMPLE - 1</p>
<h1 data-numbering="{'ilvl':'0','numFmt':'decimal','start':'1','lvlText':'%1.','lvlJc':'right','override':{},'numId':'5'}">H1 Sample - 2</h1>
<p>Paragraph after H1 SAMPLE - 2</p>
<h2 data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%1.%2.','lvlJc':'right','override':{},'numId':'6'}">H2 sample</h2>
<p>Paragraph after H2 SAMPLE </p>
<h3 data-numbering="{'ilvl':'2','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.','lvlJc':'right','override':{},'numId':'7'}">H3 sample</h3>
<p>Paragraph after H3 SAMPLE </p>
<h4 data-numbering="{'ilvl':'3','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.%4.','lvlJc':'right','override':{},'numId':'8'}">H4 sample</h4>
<p>Paragraph after H4 SAMPLE</p>
<h5 data-numbering="{'ilvl':'4','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.%4.%5.','lvlJc':'right','override':{},'numId':'9'}">H5 sample</h5>
<p>Paragraph after H5 SAMPLE </p>
<h6 data-numbering="{'ilvl':'5','numFmt':'decimal','start':'1','lvlText':'%1.%2.%3.%4.%5.%6.','lvlJc':'right','override':{},'numId':'10'}">H6 sample</h6>
<p>Paragraph after H6 SAMPLE </p>
<h2 data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%1.%2.','lvlJc':'right','override':{},'numId':'11'}">H2-sample 2</h2>
<p>Paragraph after H2 sample 2</p>
<h2 data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%1.%2.','lvlJc':'right','override':{'startOverride':'1'},'numId':'12'}">H2-sample restart 1</h2>
<p>Paragraph after H2-sample restart 1</p>
<h2 data-numbering="{'ilvl':'1','numFmt':'decimal','start':'1','lvlText':'%1.%2.','lvlJc':'right','override':{},'numId':'13'}">H2-sample restart 2<span data-unrecognized-element="w:softHyphen"></span></h2>
<p>Paragraph after H2-sample restart 2</p>
`;

test(testName('headings-overinherited-numbering.docx'), function() {
    var docxPath = path.join(__dirname, dataFile('headings-overinherited-numbering.docx'));
    return mammoth.convertToHtml({path: docxPath}).then(function(result) {
        assert.equal(result.value, concatHtml(headingOverinheritedNumbering));
    });
});
